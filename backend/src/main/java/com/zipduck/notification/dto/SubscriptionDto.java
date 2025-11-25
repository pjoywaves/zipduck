package com.zipduck.notification.dto;

import com.zipduck.notification.domain.NotificationSubscription;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Subscription DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDto {

    private Long id;
    private Long userId;
    private String region;
    private Long minIncome;
    private Long maxIncome;

    @NotNull(message = "Notification type is required")
    private NotificationSubscription.NotificationType notificationType;

    @NotNull(message = "Delivery method is required")
    private NotificationSubscription.DeliveryMethod deliveryMethod;

    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Convert entity to DTO
     */
    public static SubscriptionDto from(NotificationSubscription subscription) {
        return SubscriptionDto.builder()
            .id(subscription.getId())
            .userId(subscription.getUserId())
            .region(subscription.getRegion())
            .minIncome(subscription.getMinIncome())
            .maxIncome(subscription.getMaxIncome())
            .notificationType(subscription.getNotificationType())
            .deliveryMethod(subscription.getDeliveryMethod())
            .active(subscription.isActive())
            .createdAt(subscription.getCreatedAt())
            .updatedAt(subscription.getUpdatedAt())
            .build();
    }

    /**
     * Convert DTO to entity
     */
    public NotificationSubscription toEntity() {
        return NotificationSubscription.builder()
            .id(id)
            .userId(userId)
            .region(region)
            .minIncome(minIncome)
            .maxIncome(maxIncome)
            .notificationType(notificationType)
            .deliveryMethod(deliveryMethod)
            .active(active)
            .build();
    }
}
