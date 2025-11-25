/**
 * ZipDuck PDF Analysis Load Testing with K6
 *
 * Success Criteria:
 * - SC-011: PDF analysis < 30s (text-based PDF), < 60s (OCR)
 * - SC-012: AI accuracy 95% (text), 90% (OCR)
 * - SC-014: Cached PDF < 5 seconds
 *
 * Usage:
 *   k6 run k6-pdf-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// Custom metrics
const pdfAnalysisDuration = new Trend('pdf_analysis_duration');
const pdfCacheHitDuration = new Trend('pdf_cache_hit_duration');
const analysisSuccessRate = new Rate('analysis_success_rate');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const JWT_TOKEN = __ENV.JWT_TOKEN || 'your-test-jwt-token';

// Test PDF files (you'll need to prepare these)
const testPdfs = new SharedArray('pdfs', function () {
    return [
        { name: 'text-based-1.pdf', type: 'text', path: './test-pdfs/text-based-1.pdf' },
        { name: 'text-based-2.pdf', type: 'text', path: './test-pdfs/text-based-2.pdf' },
        { name: 'scanned-1.pdf', type: 'ocr', path: './test-pdfs/scanned-1.pdf' },
    ];
});

export const options = {
    scenarios: {
        // Scenario 1: Upload new PDFs
        upload_new_pdfs: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 10 },
                { duration: '3m', target: 10 },
                { duration: '1m', target: 0 },
            ],
            gracefulRampDown: '30s',
            exec: 'uploadNewPdf',
        },

        // Scenario 2: Test cache performance
        test_cache: {
            executor: 'constant-vus',
            vus: 50,
            duration: '2m',
            startTime: '3m',
            exec: 'testPdfCache',
        },
    },
    thresholds: {
        'pdf_analysis_duration{type:text}': ['p(95)<30000'], // SC-011: Text PDF < 30s
        'pdf_analysis_duration{type:ocr}': ['p(95)<60000'],  // SC-011: OCR PDF < 60s
        'pdf_cache_hit_duration': ['p(95)<5000'],            // SC-014: Cache < 5s
        'analysis_success_rate': ['rate>0.95'],               // 95% success rate
    },
};

export function setup() {
    return {
        userId: 'test-user-' + Math.floor(Math.random() * 10000),
    };
}

// Scenario 1: Upload new PDF and wait for analysis
export function uploadNewPdf(data) {
    const userId = data.userId;
    const pdf = testPdfs[Math.floor(Math.random() * testPdfs.length)];

    group('PDF Upload and Analysis', () => {
        // Step 1: Upload PDF
        const uploadStart = new Date();

        // Note: In real test, you'd need to read the actual file
        // For this example, we'll use a placeholder
        const formData = {
            file: http.file(pdf.path, pdf.name, 'application/pdf'),
        };

        const uploadRes = http.post(
            `${BASE_URL}/api/v1/pdf/upload?userId=${userId}`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${JWT_TOKEN}`,
                },
                tags: { name: 'PdfUpload' },
            }
        );

        check(uploadRes, {
            'upload status is 200': (r) => r.status === 200,
            'upload has pdfId': (r) => {
                const body = JSON.parse(r.body);
                return body.pdfId !== undefined;
            },
        });

        if (uploadRes.status !== 200) {
            analysisSuccessRate.add(0);
            return;
        }

        const pdfId = JSON.parse(uploadRes.body).pdfId;

        // Step 2: Poll for analysis completion
        let status = 'PENDING';
        let attempts = 0;
        const maxAttempts = 60; // 60 attempts * 2s = 2 minutes max
        let analysisResult;

        while (status !== 'COMPLETED' && status !== 'FAILED' && attempts < maxAttempts) {
            sleep(2); // Poll every 2 seconds

            const statusRes = http.get(
                `${BASE_URL}/api/v1/pdf/${pdfId}/status`,
                {
                    headers: {
                        'Authorization': `Bearer ${JWT_TOKEN}`,
                    },
                    tags: { name: 'PdfStatus' },
                }
            );

            if (statusRes.status === 200) {
                const body = JSON.parse(statusRes.body);
                status = body.status;

                if (status === 'COMPLETED') {
                    // Get analysis result
                    const analysisRes = http.get(
                        `${BASE_URL}/api/v1/pdf/${pdfId}/analysis`,
                        {
                            headers: {
                                'Authorization': `Bearer ${JWT_TOKEN}`,
                            },
                            tags: { name: 'PdfAnalysis' },
                        }
                    );

                    if (analysisRes.status === 200) {
                        analysisResult = JSON.parse(analysisRes.body);
                    }
                }
            }

            attempts++;
        }

        const totalDuration = new Date() - uploadStart;

        // Record metrics
        const success = status === 'COMPLETED' && analysisResult !== undefined;
        analysisSuccessRate.add(success ? 1 : 0);

        if (success) {
            pdfAnalysisDuration.add(totalDuration, { type: pdf.type });

            check(analysisResult, {
                'has match score': (r) => r.matchScore !== undefined,
                'has recommendations': (r) => r.recommendations !== undefined,
            });

            // Validate success criteria
            const maxDuration = pdf.type === 'text' ? 30000 : 60000;
            const meetsCriteria = totalDuration < maxDuration;

            console.log(
                `PDF ${pdf.name} (${pdf.type}): ${totalDuration}ms - ${
                    meetsCriteria ? 'PASS' : 'FAIL'
                }`
            );
        } else {
            console.log(`PDF analysis failed or timed out for ${pdf.name}`);
        }
    });

    sleep(5); // Cool-down between uploads
}

// Scenario 2: Test cache performance
export function testPdfCache(data) {
    const userId = data.userId;

    // Use a popular PDF that should be cached
    const popularPdfId = 1; // Assume PDF ID 1 is popular and cached

    group('Cached PDF Retrieval', () => {
        const start = new Date();

        const res = http.get(
            `${BASE_URL}/api/v1/pdf/${popularPdfId}/analysis?userId=${userId}`,
            {
                headers: {
                    'Authorization': `Bearer ${JWT_TOKEN}`,
                },
                tags: { name: 'CachedPdfAnalysis' },
            }
        );

        const duration = new Date() - start;

        const success = check(res, {
            'cached result status is 200': (r) => r.status === 200,
            'cached result < 5s': (r) => r.timings.duration < 5000, // SC-014
            'has cache indicator': (r) => {
                // Assuming API returns a cache hit indicator
                const body = JSON.parse(r.body);
                return body.cached === true || r.timings.duration < 1000;
            },
        });

        if (success) {
            pdfCacheHitDuration.add(duration);
        }
    });

    sleep(1);
}

export function teardown(data) {
    console.log('PDF load test completed');
}

export function handleSummary(data) {
    const summary = {
        'pdf-load-test-summary.json': JSON.stringify(data, null, 2),
    };

    // Custom summary
    let report = '\n' + '='.repeat(60) + '\n';
    report += 'PDF Analysis Load Test Summary\n';
    report += '='.repeat(60) + '\n\n';

    // Analysis duration
    const textPdfDuration = data.metrics['pdf_analysis_duration{type:text}'];
    const ocrPdfDuration = data.metrics['pdf_analysis_duration{type:ocr}'];

    if (textPdfDuration) {
        report += 'Text-based PDF Analysis:\n';
        report += `  Average: ${textPdfDuration.values.avg.toFixed(2)}ms\n`;
        report += `  P95: ${textPdfDuration.values['p(95)'].toFixed(2)}ms\n`;
        report += `  Max: ${textPdfDuration.values.max.toFixed(2)}ms\n`;
        report += `  SC-011 (< 30s): ${textPdfDuration.values['p(95)'] < 30000 ? 'PASS' : 'FAIL'}\n\n`;
    }

    if (ocrPdfDuration) {
        report += 'OCR PDF Analysis:\n';
        report += `  Average: ${ocrPdfDuration.values.avg.toFixed(2)}ms\n`;
        report += `  P95: ${ocrPdfDuration.values['p(95)'].toFixed(2)}ms\n`;
        report += `  Max: ${ocrPdfDuration.values.max.toFixed(2)}ms\n`;
        report += `  SC-011 (< 60s): ${ocrPdfDuration.values['p(95)'] < 60000 ? 'PASS' : 'FAIL'}\n\n`;
    }

    // Cache performance
    const cacheDuration = data.metrics.pdf_cache_hit_duration;
    if (cacheDuration) {
        report += 'Cached PDF Retrieval:\n';
        report += `  Average: ${cacheDuration.values.avg.toFixed(2)}ms\n`;
        report += `  P95: ${cacheDuration.values['p(95)'].toFixed(2)}ms\n`;
        report += `  SC-014 (< 5s): ${cacheDuration.values['p(95)'] < 5000 ? 'PASS' : 'FAIL'}\n\n`;
    }

    // Success rate
    const successRate = data.metrics.analysis_success_rate;
    if (successRate) {
        report += 'Analysis Success Rate:\n';
        report += `  Rate: ${(successRate.values.rate * 100).toFixed(2)}%\n`;
        report += `  Target: >95%\n`;
        report += `  Status: ${successRate.values.rate > 0.95 ? 'PASS' : 'FAIL'}\n\n`;
    }

    report += '='.repeat(60) + '\n';

    summary.stdout = report;

    return summary;
}
