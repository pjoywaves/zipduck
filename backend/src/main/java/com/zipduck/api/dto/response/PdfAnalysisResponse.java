package com.zipduck.api.dto.response;

import com.zipduck.domain.pdf.PdfAnalysisResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for PDF analysis results
 * T072: PdfAnalysisResponse
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "PDF analysis results")
public class PdfAnalysisResponse {

    @Schema(description = "PDF document ID", example = "1")
    private Long pdfId;

    @Schema(description = "Subscription name", example = "서울 강남 아파트")
    private String subscriptionName;

    @Schema(description = "Location", example = "서울")
    private String location;

    @Schema(description = "Address")
    private String address;

    @Schema(description = "Housing type", example = "아파트")
    private String housingType;

    // Eligibility criteria
    private Integer minAge;
    private Integer maxAge;
    private Long minIncome;
    private Long maxIncome;
    private Integer minHouseholdMembers;
    private Integer maxHouseholdMembers;
    private Integer maxHousingOwned;
    private String specialQualifications;
    private String preferenceCategories;

    // Price
    private Long minPrice;
    private Long maxPrice;

    @Schema(description = "Application period")
    private String applicationPeriod;

    // Match results
    @Schema(description = "Match score (0-100)", example = "85")
    private Integer matchScore;

    @Schema(description = "Is eligible", example = "true")
    private Boolean isEligible;

    // OCR quality
    @Schema(description = "OCR quality", example = "HIGH")
    private String ocrQuality;

    @Schema(description = "OCR warning message")
    private String ocrWarning;

    @Schema(description = "Processing time in milliseconds", example = "5000")
    private Integer processingTimeMs;

    public static PdfAnalysisResponse from(PdfAnalysisResult result) {
        return PdfAnalysisResponse.builder()
                .pdfId(result.getPdfDocument().getId())
                .subscriptionName(result.getSubscriptionName())
                .location(result.getLocation())
                .address(result.getAddress())
                .housingType(result.getHousingType())
                .minAge(result.getMinAge())
                .maxAge(result.getMaxAge())
                .minIncome(result.getMinIncome())
                .maxIncome(result.getMaxIncome())
                .minHouseholdMembers(result.getMinHouseholdMembers())
                .maxHouseholdMembers(result.getMaxHouseholdMembers())
                .maxHousingOwned(result.getMaxHousingOwned())
                .specialQualifications(result.getSpecialQualifications())
                .preferenceCategories(result.getPreferenceCategories())
                .minPrice(result.getMinPrice())
                .maxPrice(result.getMaxPrice())
                .applicationPeriod(result.getApplicationPeriod())
                .matchScore(result.getMatchScore())
                .isEligible(result.getIsEligible())
                .ocrQuality(result.getOcrQuality())
                .ocrWarning(result.getOcrWarning())
                .processingTimeMs(result.getProcessingTimeMs())
                .build();
    }
}
