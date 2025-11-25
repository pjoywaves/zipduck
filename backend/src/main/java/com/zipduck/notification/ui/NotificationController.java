package com.zipduck.notification.ui;

import com.zipduck.notification.application.NotificationService;
import com.zipduck.notification.domain.NotificationSubscription;
import com.zipduck.notification.dto.SubscriptionDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Notification Controller
 * - POST /api/v1/notifications/subscriptions - 알림 구독 생성
 * - GET /api/v1/notifications/subscriptions - 내 구독 목록 조회
 * - PATCH /api/v1/notifications/subscriptions/{id} - 구독 수정
 * - DELETE /api/v1/notifications/subscriptions/{id} - 구독 삭제
 * - PATCH /api/v1/notifications/subscriptions/{id}/toggle - 구독 활성화/비활성화
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Create subscription
     */
    @PostMapping("/subscriptions")
    public ResponseEntity<SubscriptionDto> createSubscription(
        Authentication authentication,
        @Valid @RequestBody CreateSubscriptionRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Create subscription request: userId={}, type={}", userId, request.notificationType());

        NotificationSubscription subscription = NotificationSubscription.builder()
            .userId(userId)
            .region(request.region())
            .minIncome(request.minIncome())
            .maxIncome(request.maxIncome())
            .notificationType(request.notificationType())
            .deliveryMethod(request.deliveryMethod())
            .active(true)
            .build();

        NotificationSubscription created = notificationService.createSubscription(subscription);
        SubscriptionDto dto = SubscriptionDto.from(created);

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /**
     * Get my subscriptions
     */
    @GetMapping("/subscriptions")
    public ResponseEntity<List<SubscriptionDto>> getMySubscriptions(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Get subscriptions request: userId={}", userId);

        List<NotificationSubscription> subscriptions = notificationService.getUserSubscriptions(userId);
        List<SubscriptionDto> dtos = subscriptions.stream()
            .map(SubscriptionDto::from)
            .toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * Update subscription
     */
    @PatchMapping("/subscriptions/{id}")
    public ResponseEntity<SubscriptionDto> updateSubscription(
        @PathVariable Long id,
        @Valid @RequestBody UpdateSubscriptionRequest request
    ) {
        log.info("Update subscription request: id={}", id);

        NotificationSubscription updates = NotificationSubscription.builder()
            .region(request.region())
            .minIncome(request.minIncome())
            .maxIncome(request.maxIncome())
            .deliveryMethod(request.deliveryMethod())
            .build();

        NotificationSubscription updated = notificationService.updateSubscription(id, updates);
        SubscriptionDto dto = SubscriptionDto.from(updated);

        return ResponseEntity.ok(dto);
    }

    /**
     * Toggle subscription active status
     */
    @PatchMapping("/subscriptions/{id}/toggle")
    public ResponseEntity<Void> toggleSubscription(
        @PathVariable Long id,
        @RequestParam boolean active
    ) {
        log.info("Toggle subscription request: id={}, active={}", id, active);

        notificationService.toggleSubscription(id, active);

        return ResponseEntity.noContent().build();
    }

    /**
     * Delete subscription
     */
    @DeleteMapping("/subscriptions/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        log.info("Delete subscription request: id={}", id);

        notificationService.deleteSubscription(id);

        return ResponseEntity.noContent().build();
    }

    /**
     * Request DTOs
     */
    public record CreateSubscriptionRequest(
        String region,
        Long minIncome,
        Long maxIncome,
        NotificationSubscription.NotificationType notificationType,
        NotificationSubscription.DeliveryMethod deliveryMethod
    ) {}

    public record UpdateSubscriptionRequest(
        String region,
        Long minIncome,
        Long maxIncome,
        NotificationSubscription.DeliveryMethod deliveryMethod
    ) {}
}
