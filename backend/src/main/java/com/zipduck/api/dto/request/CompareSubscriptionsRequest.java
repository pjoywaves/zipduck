package com.zipduck.api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for comparing multiple subscriptions
 * T100: Subscription comparison API
 * FR-010: Side-by-side comparison of subscriptions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompareSubscriptionsRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Subscription IDs are required")
    @Size(min = 2, max = 5, message = "You can compare between 2 and 5 subscriptions")
    private List<Long> subscriptionIds;
}
