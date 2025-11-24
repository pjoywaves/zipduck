package com.zipduck.api.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for adding a subscription to favorites
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddFavoriteRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Subscription ID is required")
    private Long subscriptionId;

    private String note; // Optional note about the favorite
}
