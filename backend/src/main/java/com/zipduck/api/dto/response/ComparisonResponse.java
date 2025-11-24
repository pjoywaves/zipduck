package com.zipduck.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for subscription comparison
 * T100: Side-by-side comparison of subscriptions
 * FR-010: Display subscriptions in comparison view
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComparisonResponse {

    private List<SubscriptionDto> subscriptions;
    private Integer totalCount;
    private ComparisonSummary summary;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComparisonSummary {
        private Long lowestMinPrice;
        private Long highestMaxPrice;
        private Integer highestMatchScore;
        private Integer lowestMatchScore;
        private String bestMatch; // Name of subscription with highest match score
    }

    public static ComparisonResponse of(List<SubscriptionDto> subscriptions) {
        ComparisonSummary summary = buildSummary(subscriptions);

        return ComparisonResponse.builder()
                .subscriptions(subscriptions)
                .totalCount(subscriptions.size())
                .summary(summary)
                .build();
    }

    private static ComparisonSummary buildSummary(List<SubscriptionDto> subscriptions) {
        if (subscriptions.isEmpty()) {
            return ComparisonSummary.builder().build();
        }

        Long lowestMinPrice = subscriptions.stream()
                .map(SubscriptionDto::getMinPrice)
                .min(Long::compareTo)
                .orElse(null);

        Long highestMaxPrice = subscriptions.stream()
                .map(SubscriptionDto::getMaxPrice)
                .max(Long::compareTo)
                .orElse(null);

        Integer highestMatchScore = subscriptions.stream()
                .map(s -> s.getEligibilityDetails() != null ? s.getEligibilityDetails().getMatchScore() : 0)
                .max(Integer::compareTo)
                .orElse(null);

        Integer lowestMatchScore = subscriptions.stream()
                .map(s -> s.getEligibilityDetails() != null ? s.getEligibilityDetails().getMatchScore() : 0)
                .min(Integer::compareTo)
                .orElse(null);

        String bestMatch = subscriptions.stream()
                .filter(s -> s.getEligibilityDetails() != null)
                .max((s1, s2) -> Integer.compare(
                        s1.getEligibilityDetails().getMatchScore(),
                        s2.getEligibilityDetails().getMatchScore()))
                .map(SubscriptionDto::getName)
                .orElse(null);

        return ComparisonSummary.builder()
                .lowestMinPrice(lowestMinPrice)
                .highestMaxPrice(highestMaxPrice)
                .highestMatchScore(highestMatchScore)
                .lowestMatchScore(lowestMatchScore)
                .bestMatch(bestMatch)
                .build();
    }
}
