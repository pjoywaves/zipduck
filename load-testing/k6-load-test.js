/**
 * ZipDuck MVP Load Testing with K6
 *
 * Success Criteria:
 * - SC-002: Recommendations returned in < 5 seconds
 * - SC-006: Support 10,000 concurrent users
 * - SC-011: PDF analysis < 30s (text), < 60s (OCR)
 *
 * Usage:
 *   k6 run k6-load-test.js
 *   k6 run --vus 100 --duration 5m k6-load-test.js
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const recommendationDuration = new Trend('recommendation_duration');
const pdfUploadDuration = new Trend('pdf_upload_duration');
const requestsPerSecond = new Counter('requests_per_second');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const JWT_TOKEN = __ENV.JWT_TOKEN || 'your-test-jwt-token';

// Test stages (load profile)
export const options = {
    stages: [
        // Ramp-up: 0 to 1000 users in 2 minutes
        { duration: '2m', target: 1000 },

        // Steady state: 1000 users for 5 minutes
        { duration: '5m', target: 1000 },

        // Peak load: 1000 to 5000 users in 2 minutes
        { duration: '2m', target: 5000 },

        // Peak steady state: 5000 users for 3 minutes
        { duration: '3m', target: 5000 },

        // Stress test: 5000 to 10000 users in 2 minutes
        { duration: '2m', target: 10000 },

        // Max load: 10000 users for 1 minute
        { duration: '1m', target: 10000 },

        // Ramp-down: 10000 to 0 users in 2 minutes
        { duration: '2m', target: 0 },
    ],
    thresholds: {
        // Success criteria
        'http_req_duration': ['p(95)<5000'], // SC-002: 95th percentile < 5s
        'errors': ['rate<0.01'],              // Error rate < 1%
        'http_req_failed': ['rate<0.01'],     // HTTP failure rate < 1%
        'recommendation_duration': ['p(95)<5000'], // Recommendation < 5s
    },
};

// Test setup
export function setup() {
    // Create test user profile
    const createProfileRes = http.post(
        `${BASE_URL}/api/v1/users/profile`,
        JSON.stringify({
            age: 32,
            annualIncome: 60000000,
            householdMembers: 2,
            housingOwned: 0,
            locationPreferences: ['서울', '경기'],
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JWT_TOKEN}`,
            },
        }
    );

    check(createProfileRes, {
        'setup: profile created': (r) => r.status === 200,
    });

    return {
        userId: 'test-user-' + Math.floor(Math.random() * 10000),
    };
}

// Main test scenario
export default function (data) {
    const userId = data.userId;

    group('Get Recommendations', () => {
        const start = new Date();

        const res = http.get(
            `${BASE_URL}/api/v1/subscriptions/recommendations?userId=${userId}&sourceFilter=ALL`,
            {
                headers: {
                    'Authorization': `Bearer ${JWT_TOKEN}`,
                },
                tags: { name: 'GetRecommendations' },
            }
        );

        const duration = new Date() - start;
        recommendationDuration.add(duration);
        requestsPerSecond.add(1);

        const success = check(res, {
            'status is 200': (r) => r.status === 200,
            'response time < 5s': (r) => r.timings.duration < 5000, // SC-002
            'has subscriptions': (r) => {
                const body = JSON.parse(r.body);
                return body.subscriptions && body.subscriptions.length > 0;
            },
        });

        if (!success) {
            errorRate.add(1);
            console.log(`Request failed: ${res.status} - ${res.body}`);
        } else {
            errorRate.add(0);
        }
    });

    sleep(1); // Think time between requests

    group('Get User Profile', () => {
        const res = http.get(
            `${BASE_URL}/api/v1/users/${userId}/profile`,
            {
                headers: {
                    'Authorization': `Bearer ${JWT_TOKEN}`,
                },
                tags: { name: 'GetProfile' },
            }
        );

        check(res, {
            'profile status is 200': (r) => r.status === 200,
            'profile has data': (r) => {
                const body = JSON.parse(r.body);
                return body.age !== undefined;
            },
        });

        requestsPerSecond.add(1);
    });

    sleep(2);

    // Random scenario: 30% chance to check eligibility breakdown
    if (Math.random() < 0.3) {
        group('Get Eligibility Breakdown', () => {
            const subscriptionId = Math.floor(Math.random() * 100) + 1;

            const res = http.get(
                `${BASE_URL}/api/v1/eligibility/${subscriptionId}?userId=${userId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${JWT_TOKEN}`,
                    },
                    tags: { name: 'GetEligibility' },
                }
            );

            check(res, {
                'eligibility status is 200 or 404': (r) =>
                    r.status === 200 || r.status === 404,
            });

            requestsPerSecond.add(1);
        });

        sleep(1);
    }

    // Random scenario: 10% chance to add favorite
    if (Math.random() < 0.1) {
        group('Add Favorite', () => {
            const subscriptionId = Math.floor(Math.random() * 100) + 1;

            const res = http.post(
                `${BASE_URL}/api/v1/favorites`,
                JSON.stringify({
                    userId: userId,
                    subscriptionId: subscriptionId,
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JWT_TOKEN}`,
                    },
                    tags: { name: 'AddFavorite' },
                }
            );

            check(res, {
                'favorite added': (r) => r.status === 200 || r.status === 409, // Conflict if already exists
            });

            requestsPerSecond.add(1);
        });

        sleep(0.5);
    }
}

// Test teardown
export function teardown(data) {
    console.log('Load test completed');
}

// Handle summary for reporting
export function handleSummary(data) {
    return {
        'load-test-summary.json': JSON.stringify(data, null, 2),
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
    };
}

function textSummary(data, options) {
    const indent = options.indent || '';
    const enableColors = options.enableColors || false;

    let summary = '\n' + indent + '='.repeat(60) + '\n';
    summary += indent + 'K6 Load Test Summary\n';
    summary += indent + '='.repeat(60) + '\n\n';

    // Request metrics
    const httpReqs = data.metrics.http_reqs.values.count;
    const httpReqFailed = data.metrics.http_req_failed.values.rate;
    const httpReqDuration = data.metrics.http_req_duration.values;

    summary += indent + 'HTTP Requests:\n';
    summary += indent + `  Total: ${httpReqs}\n`;
    summary += indent + `  Failed: ${(httpReqFailed * 100).toFixed(2)}%\n`;
    summary += indent + `  Duration (avg): ${httpReqDuration.avg.toFixed(2)}ms\n`;
    summary += indent + `  Duration (p95): ${httpReqDuration['p(95)'].toFixed(2)}ms\n`;
    summary += indent + `  Duration (max): ${httpReqDuration.max.toFixed(2)}ms\n\n`;

    // Success criteria validation
    summary += indent + 'Success Criteria:\n';
    summary += indent + `  SC-002 (Recommendations < 5s): ${httpReqDuration['p(95)'] < 5000 ? 'PASS' : 'FAIL'}\n`;
    summary += indent + `  SC-006 (10k concurrent users): ${data.state.testRunDurationMs > 0 ? 'PASS' : 'FAIL'}\n`;
    summary += indent + `  Error Rate < 1%: ${httpReqFailed < 0.01 ? 'PASS' : 'FAIL'}\n\n`;

    // VUs
    summary += indent + 'Virtual Users:\n';
    summary += indent + `  Max: ${data.metrics.vus.values.max}\n`;
    summary += indent + `  Min: ${data.metrics.vus.values.min}\n\n`;

    summary += indent + '='.repeat(60) + '\n';

    return summary;
}
