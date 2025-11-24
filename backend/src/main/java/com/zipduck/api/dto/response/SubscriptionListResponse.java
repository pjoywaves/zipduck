package com.zipduck.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for subscription list
 * FR-005: Display filtered subscription results
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Subscription list response")
public class SubscriptionListResponse {

    @Schema(description = "List of subscriptions")
    private List<SubscriptionDto> subscriptions;

    @Schema(description = "Total count", example = "10")
    private Integer totalCount;

    @Schema(description = "Applied source filter", example = "PUBLIC_DB")
    private String sourceFilter;

    public static SubscriptionListResponse of(List<SubscriptionDto> subscriptions, String sourceFilter) {
        return SubscriptionListResponse.builder()
                .subscriptions(subscriptions)
                .totalCount(subscriptions.size())
                .sourceFilter(sourceFilter)
                .build();
    }
}