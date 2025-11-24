package com.zipduck.application.async;

import com.zipduck.application.ai.EligibilityScorer;
import com.zipduck.application.ai.GeminiService;
import com.zipduck.application.ai.VisionService;
import com.zipduck.domain.eligibility.EligibilityCalculator;
import com.zipduck.domain.pdf.PdfAnalysisResult;
import com.zipduck.domain.pdf.PdfCommandService;
import com.zipduck.domain.pdf.PdfDocument;
import com.zipduck.domain.pdf.PdfQueryService;
import com.zipduck.domain.subscription.Subscription;
import com.zipduck.domain.subscription.SubscriptionCommandService;
import com.zipduck.domain.subscription.SubscriptionQueryService;
import com.zipduck.domain.user.UserProfile;
import com.zipduck.infrastructure.cache.PdfCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Async processor for PDF analysis
 * T065-T070: PDF analysis workflow implementation
 * FR-016 to FR-025, FR-028, FR-029, FR-030
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PdfAnalysisTask {

    private final PdfQueryService pdfQueryService;
    private final PdfCommandService pdfCommandService;
    private final VisionService visionService;
    private final GeminiService geminiService;
    private final EligibilityCalculator eligibilityCalculator;
    private final EligibilityScorer eligibilityScorer;
    private final SubscriptionQueryService subscriptionQueryService;
    private final SubscriptionCommandService subscriptionCommandService;
    private final PdfCacheService pdfCacheService;

    /**
     * Analyze PDF asynchronously
     * T066: Complete workflow implementation
     */
    @Async
    public void analyzePdfAsync(Long pdfDocumentId, UserProfile userProfile) {
        log.info("Starting async PDF analysis for document ID: {}", pdfDocumentId);
        long startTime = System.currentTimeMillis();

        try {
            PdfDocument pdfDocument = pdfQueryService.getById(pdfDocumentId);

            // Step 1: Update status to PROCESSING
            pdfCommandService.markAsProcessing(pdfDocumentId);

            // Step 2: Check cache first (FR-023, FR-024)
            String cacheKey = pdfDocument.getCacheKey();
            PdfAnalysisResult cachedResult = pdfCacheService.getCachedAnalysisResult(cacheKey);

            if (cachedResult != null) {
                log.info("Using cached analysis result for PDF: {}", cacheKey);
                // Save cached result for this user
                cachedResult.setPdfDocument(pdfDocument);
                pdfCommandService.saveAnalysisResult(cachedResult);
                pdfCommandService.markAsCompleted(pdfDocumentId);
                pdfCacheService.extendCacheTTL(cacheKey); // Extend TTL for popular PDFs
                return;
            }

            // Step 3: Detect if OCR is needed (FR-033)
            boolean needsOcr = visionService.detectImageContent(pdfDocument.getFilePath());
            String extractedText;

            // Step 4: Extract text (with OCR if needed) (FR-034, FR-035)
            if (needsOcr) {
                log.info("PDF contains images, performing OCR");
                extractedText = visionService.performOcr(pdfDocument.getFilePath());
            } else {
                log.info("PDF is text-based, extracting directly");
                extractedText = extractTextFromPdf(pdfDocument.getFilePath());
            }

            // Step 5: Assess OCR quality if OCR was used (FR-037)
            String ocrQuality = "HIGH";
            String ocrWarning = null;
            if (needsOcr) {
                VisionService.OcrQualityResult qualityResult = visionService.assessOcrQuality(extractedText);
                ocrQuality = qualityResult.quality;
                ocrWarning = qualityResult.warning;
            }

            // Step 6: Extract criteria using Gemini AI (FR-017)
            GeminiService.SubscriptionCriteria criteria = geminiService.extractCriteria(extractedText);

            // Step 7: Calculate match score with user profile (FR-018, FR-019)
            boolean isEligible = false;
            int matchScore = 0;

            if (userProfile != null) {
                // Create temporary subscription for eligibility check
                Subscription tempSubscription = buildSubscriptionFromCriteria(criteria);
                isEligible = eligibilityCalculator.isEligible(userProfile, tempSubscription);
                matchScore = eligibilityCalculator.calculateMatchScore(userProfile, tempSubscription);
            }

            // Step 8: Check for duplicate subscriptions (FR-028, T067)
            Subscription existingSubscription = findDuplicateSubscription(criteria);

            if (existingSubscription != null) {
                // Step 9: Merge with existing subscription (FR-029, T068)
                log.info("Found duplicate subscription, merging: {}", existingSubscription.getName());
                subscriptionCommandService.mergeWithPdfData(existingSubscription, String.valueOf(pdfDocumentId));
            } else {
                // Step 10: Create new subscription from PDF (T069)
                log.info("Creating new subscription from PDF: {}", criteria.subscriptionName);
                createSubscriptionFromPdf(criteria, pdfDocumentId);
            }

            // Step 11: Save analysis result
            long processingTime = System.currentTimeMillis() - startTime;
            PdfAnalysisResult analysisResult = buildAnalysisResult(
                    pdfDocument, criteria, extractedText, isEligible, matchScore,
                    ocrQuality, ocrWarning, (int) processingTime
            );
            pdfCommandService.saveAnalysisResult(analysisResult);

            // Step 12: Cache result (FR-024)
            pdfCacheService.cacheAnalysisResult(cacheKey, analysisResult);

            // Step 13: Mark as completed
            pdfCommandService.markAsCompleted(pdfDocumentId);

            log.info("PDF analysis completed successfully in {}ms", processingTime);

        } catch (Exception e) {
            log.error("PDF analysis failed for document ID: {}", pdfDocumentId, e);
            pdfCommandService.markAsFailed(pdfDocumentId, e.getMessage());
        }
    }

    /**
     * Extract text from text-based PDF (simplified - use Apache PDFBox in production)
     */
    private String extractTextFromPdf(String filePath) {
        // Placeholder - in production, use Apache PDFBox or similar
        log.warn("Text extraction not implemented, returning empty string");
        return "";
    }

    /**
     * Build Subscription entity from extracted criteria
     */
    private Subscription buildSubscriptionFromCriteria(GeminiService.SubscriptionCriteria criteria) {
        Subscription.HousingType housingType = parseHousingType(criteria.housingType);

        return Subscription.builder()
                .name(criteria.subscriptionName)
                .location(criteria.location)
                .address(criteria.address)
                .housingType(housingType)
                .minAge(criteria.minAge)
                .maxAge(criteria.maxAge)
                .minIncome(criteria.minIncome)
                .maxIncome(criteria.maxIncome)
                .minHouseholdMembers(criteria.minHouseholdMembers)
                .maxHouseholdMembers(criteria.maxHouseholdMembers)
                .maxHousingOwned(criteria.maxHousingOwned)
                .specialQualifications(criteria.specialQualifications)
                .preferenceCategories(criteria.preferenceCategories)
                .minPrice(criteria.minPrice)
                .maxPrice(criteria.maxPrice)
                .applicationStartDate(LocalDate.now()) // Default
                .applicationEndDate(parseApplicationEndDate(criteria.applicationPeriod))
                .dataSource(Subscription.DataSource.PDF_UPLOAD)
                .isActive(true)
                .build();
    }

    /**
     * Find duplicate subscription by name and location (FR-028, T067)
     */
    private Subscription findDuplicateSubscription(GeminiService.SubscriptionCriteria criteria) {
        // Simple duplicate detection - can be enhanced with fuzzy matching
        if (criteria.subscriptionName == null || criteria.location == null) {
            return null;
        }

        // Search for subscriptions with similar name and location
        return subscriptionQueryService.getAllActive().stream()
                .filter(s -> s.getName() != null && s.getName().contains(criteria.subscriptionName))
                .filter(s -> s.getLocation() != null && s.getLocation().equals(criteria.location))
                .findFirst()
                .orElse(null);
    }

    /**
     * Create new subscription from PDF (T069)
     */
    private void createSubscriptionFromPdf(GeminiService.SubscriptionCriteria criteria, Long pdfDocumentId) {
        Subscription subscription = buildSubscriptionFromCriteria(criteria);
        subscription = subscriptionCommandService.create(subscription);

        // Note: Automatic expiration handling (T070) is done by PublicDataCollector scheduled task
        log.info("Created subscription from PDF: {} (ID: {})", subscription.getName(), subscription.getId());
    }

    /**
     * Build PdfAnalysisResult entity
     */
    private PdfAnalysisResult buildAnalysisResult(
            PdfDocument pdfDocument,
            GeminiService.SubscriptionCriteria criteria,
            String extractedText,
            boolean isEligible,
            int matchScore,
            String ocrQuality,
            String ocrWarning,
            int processingTimeMs) {

        return PdfAnalysisResult.builder()
                .pdfDocument(pdfDocument)
                .subscriptionName(criteria.subscriptionName)
                .location(criteria.location)
                .address(criteria.address)
                .housingType(criteria.housingType)
                .minAge(criteria.minAge)
                .maxAge(criteria.maxAge)
                .minIncome(criteria.minIncome)
                .maxIncome(criteria.maxIncome)
                .minHouseholdMembers(criteria.minHouseholdMembers)
                .maxHouseholdMembers(criteria.maxHouseholdMembers)
                .maxHousingOwned(criteria.maxHousingOwned)
                .specialQualifications(criteria.specialQualifications)
                .preferenceCategories(criteria.preferenceCategories)
                .minPrice(criteria.minPrice)
                .maxPrice(criteria.maxPrice)
                .applicationPeriod(criteria.applicationPeriod)
                .matchScore(matchScore)
                .isEligible(isEligible)
                .ocrQuality(ocrQuality)
                .ocrWarning(ocrWarning)
                .extractedText(extractedText.length() > 10000 ? extractedText.substring(0, 10000) : extractedText)
                .aiModel("gemini-1.5-pro")
                .processingTimeMs(processingTimeMs)
                .build();
    }

    /**
     * Parse housing type from string
     */
    private Subscription.HousingType parseHousingType(String typeStr) {
        if (typeStr == null) {
            return Subscription.HousingType.ETC;
        }

        String normalized = typeStr.trim();
        if (normalized.contains("아파트")) {
            return Subscription.HousingType.APARTMENT;
        } else if (normalized.contains("오피스텔")) {
            return Subscription.HousingType.OFFICETEL;
        } else if (normalized.contains("빌라")) {
            return Subscription.HousingType.VILLA;
        } else if (normalized.contains("타운하우스")) {
            return Subscription.HousingType.TOWNHOUSE;
        }

        return Subscription.HousingType.ETC;
    }

    /**
     * Parse application end date from period string
     */
    private LocalDate parseApplicationEndDate(String applicationPeriod) {
        if (applicationPeriod == null) {
            return LocalDate.now().plusMonths(1); // Default 1 month from now
        }

        try {
            // Try to extract date (simplified - can be enhanced with NLP)
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return LocalDate.parse(applicationPeriod, formatter);
        } catch (Exception e) {
            return LocalDate.now().plusMonths(1); // Default on parse error
        }
    }
}
