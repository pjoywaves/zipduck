package com.zipduck.api.dto.response;

import com.zipduck.domain.favorite.Favorite;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for Favorite entity
 * Used in API responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteDto {

    private Long id;
    private Long userId;
    private Long subscriptionId;
    private String subscriptionName;
    private String subscriptionLocation;
    private String note;
    private LocalDateTime createdAt;

    /**
     * Convert Favorite entity to DTO
     */
    public static FavoriteDto from(Favorite favorite) {
        return FavoriteDto.builder()
                .id(favorite.getId())
                .userId(favorite.getUser().getId())
                .subscriptionId(favorite.getSubscription().getId())
                .subscriptionName(favorite.getSubscription().getName())
                .subscriptionLocation(favorite.getSubscription().getLocation())
                .note(favorite.getNote())
                .createdAt(favorite.getCreatedAt())
                .build();
    }

    /**
     * Convert Favorite entity to DTO with full subscription details
     */
    public static FavoriteDto fromWithSubscription(Favorite favorite, SubscriptionDto subscriptionDto) {
        FavoriteDto dto = from(favorite);
        // You can add subscription details here if needed
        return dto;
    }
}
