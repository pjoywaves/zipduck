package com.zipduck.application.ai;

import com.zipduck.infrastructure.external.VisionClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for OCR and image content detection using Google Vision API
 * FR-017, FR-033, FR-034: OCR support for scanned PDFs and photos
 * T062: VisionService implementation
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class VisionService {

    private final VisionClient visionClient;

    /**
     * Detect if file contains image content requiring OCR
     * FR-033: Detect scanned images vs text-based PDFs
     */
    public boolean detectImageContent(String filePath) {
        log.info("Detecting image content for file: {}", filePath);
        try {
            return visionClient.detectImageContent(filePath);
        } catch (Exception e) {
            log.error("Failed to detect image content: {}", e.getMessage(), e);
            // Assume OCR needed if detection fails (safer approach)
            return true;
        }
    }

    /**
     * Perform OCR on image/scanned PDF
     * FR-034: Extract text from scanned documents
     * FR-035: Support mobile phone photos
     */
    public String performOcr(String filePath) {
        log.info("Performing OCR on file: {}", filePath);
        try {
            String extractedText = visionClient.performOcr(filePath);

            if (extractedText == null || extractedText.trim().isEmpty()) {
                log.warn("OCR returned empty text for file: {}", filePath);
                return "";
            }

            log.info("OCR completed successfully. Extracted {} characters", extractedText.length());
            return extractedText;
        } catch (Exception e) {
            log.error("OCR failed: {}", e.getMessage(), e);
            throw new RuntimeException("OCR processing failed: " + e.getMessage(), e);
        }
    }

    /**
     * Assess OCR quality based on extracted text characteristics
     * FR-037: Notify users of poor OCR quality
     */
    public OcrQualityResult assessOcrQuality(String extractedText) {
        if (extractedText == null || extractedText.trim().isEmpty()) {
            return new OcrQualityResult("LOW", "추출된 텍스트가 없습니다. 이미지 품질을 확인해주세요.");
        }

        int textLength = extractedText.length();
        int koreanChars = countKoreanCharacters(extractedText);
        int numericChars = countNumericCharacters(extractedText);
        int alphaChars = countAlphabetCharacters(extractedText);

        // Quality assessment logic
        if (textLength < 100) {
            return new OcrQualityResult("LOW", "추출된 텍스트가 너무 짧습니다. 더 선명한 이미지를 사용해주세요.");
        }

        // Check if we have reasonable amount of Korean text (expected for Korean documents)
        double koreanRatio = (double) koreanChars / textLength;
        if (koreanRatio < 0.1 && numericChars + alphaChars < 50) {
            return new OcrQualityResult("LOW", "텍스트 인식이 불완전합니다. 이미지가 흐리거나 해상도가 낮을 수 있습니다.");
        }

        // Check for reasonable structure (we expect numbers for eligibility criteria)
        if (numericChars < 5) {
            return new OcrQualityResult("MEDIUM", "자격 조건 숫자가 불완전할 수 있습니다. 결과를 확인해주세요.");
        }

        // Good quality indicators
        if (textLength > 500 && koreanRatio > 0.3) {
            return new OcrQualityResult("HIGH", null);
        }

        return new OcrQualityResult("MEDIUM", "일부 내용이 불완전할 수 있습니다. 결과를 확인해주세요.");
    }

    private int countKoreanCharacters(String text) {
        return (int) text.chars()
                .filter(c -> (c >= 0xAC00 && c <= 0xD7A3))
                .count();
    }

    private int countNumericCharacters(String text) {
        return (int) text.chars()
                .filter(Character::isDigit)
                .count();
    }

    private int countAlphabetCharacters(String text) {
        return (int) text.chars()
                .filter(c -> (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
                .count();
    }

    /**
     * OCR quality assessment result
     */
    public static class OcrQualityResult {
        public final String quality; // HIGH, MEDIUM, LOW
        public final String warning; // null if quality is good

        public OcrQualityResult(String quality, String warning) {
            this.quality = quality;
            this.warning = warning;
        }
    }
}
