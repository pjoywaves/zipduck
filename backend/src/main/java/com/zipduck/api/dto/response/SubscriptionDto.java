package com.zipduck.api.dto.response;

import com.zipduck.domain.eligibility.EligibilityDetails;
import com.zipduck.domain.subscription.Subscription;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Response DTO for subscription data
 * FR-005, FR-026: Display with source indicators
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Subscription details")
public class SubscriptionDto {

    @Schema(description = "Subscription ID", example = "1")
    private Long id;

    @Schema(description = "Subscription name", example = "서울 강남 아파트")
    private String name;

    @Schema(description = "Location", example = "서울")
    private String location;

    @Schema(description = "Detailed address", example = "서울시 강남구 테헤란로 123")
    private String address;

    @Schema(description = "Housing type", example = "APARTMENT")
    private String housingType;

    @Schema(description = "Housing type Korean name", example = "아파트")
    private String housingTypeKorean;

    @Schema(description = "Minimum price in KRW", example = "300000000")
    private Long minPrice;

    @Schema(description = "Maximum price in KRW", example = "600000000")
    private Long maxPrice;

    // Eligibility criteria
    @Schema(description = "Minimum age", example = "19")
    private Integer minAge;

    @Schema(description = "Maximum age", example = "65")
    private Integer maxAge;

    @Schema(description = "Minimum income in KRW", example = "30000000")
    private Long minIncome;

    @Schema(description = "Maximum income in KRW", example = "100000000")
    private Long maxIncome;

    @Schema(description = "Minimum household members", example = "1")
    private Integer minHouseholdMembers;

    @Schema(description = "Maximum household members", example = "5")
    private Integer maxHouseholdMembers;

    @Schema(description = "Maximum housing owned", example = "0")
    private Integer maxHousingOwned;

    @Schema(description = "Special qualifications")
    private String specialQualifications;

    @Schema(description = "Preference categories")
    private String preferenceCategories;

    // Application period
    @Schema(description = "Application start date")
    private LocalDate applicationStartDate;

    @Schema(description = "Application end date")
    private LocalDate applicationEndDate;

    // Data source (FR-026)
    @Schema(description = "Data source", example = "PUBLIC_DB")
    private String dataSource;

    @Schema(description = "Data source Korean name", example = "공공데이터")
    private String dataSourceKorean;

    @Schema(description = "Is merged with multiple sources", example = "false")
    private Boolean isMerged;

    @Schema(description = "Detail URL")
    private String detailUrl;

    // Eligibility info (optional, included when user profile is provided)
    @Schema(description = "Eligibility details for current user")
    private EligibilityDetails eligibilityDetails;

    public static SubscriptionDto from(Subscription subscription) {
        return SubscriptionDto.builder()
                .id(subscription.getId())
                .name(subscription.getName())
                .location(subscription.getLocation())
                .address(subscription.getAddress())
                .housingType(subscription.getHousingType().name())
                .housingTypeKorean(subscription.getHousingType().getKoreanName())
                .minPrice(subscription.getMinPrice())
                .maxPrice(subscription.getMaxPrice())
                .minAge(subscription.getMinAge())
                .maxAge(subscription.getMaxAge())
                .minIncome(subscription.getMinIncome())
                .maxIncome(subscription.getMaxIncome())
                .minHouseholdMembers(subscription.getMinHouseholdMembers())
                .maxHouseholdMembers(subscription.getMaxHouseholdMembers())
                .maxHousingOwned(subscription.getMaxHousingOwned())
                .specialQualifications(subscription.getSpecialQualifications())
                .preferenceCategories(subscription.getPreferenceCategories())
                .applicationStartDate(subscription.getApplicationStartDate())
                .applicationEndDate(subscription.getApplicationEndDate())
                .dataSource(subscription.getDataSource().name())
                .dataSourceKorean(subscription.getDataSource().getKoreanName())
                .isMerged(subscription.getIsMerged())
                .detailUrl(subscription.getDetailUrl())
                .build();
    }

    public static SubscriptionDto fromWithEligibility(Subscription subscription, EligibilityDetails details) {
        SubscriptionDto dto = from(subscription);
        dto.setEligibilityDetails(details);
        return dto;
    }
}