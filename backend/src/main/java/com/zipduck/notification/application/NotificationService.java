package com.zipduck.notification.application;

import com.zipduck.auth.domain.User;
import com.zipduck.auth.service.UserService;
import com.zipduck.notification.domain.NotificationLog;
import com.zipduck.notification.domain.NotificationSubscription;
import com.zipduck.notification.repository.NotificationLogRepository;
import com.zipduck.notification.repository.NotificationSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Notification Service
 * - 알림 구독 관리
 * - 알림 발송 조율
 * - 로깅
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationSubscriptionRepository subscriptionRepository;
    private final NotificationLogRepository logRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final PushNotificationService pushNotificationService;

    /**
     * Create notification subscription
     */
    @Transactional
    public NotificationSubscription createSubscription(NotificationSubscription subscription) {
        NotificationSubscription saved = subscriptionRepository.save(subscription);
        log.info("Created notification subscription: id={}, userId={}, type={}",
            saved.getId(), saved.getUserId(), saved.getNotificationType());
        return saved;
    }

    /**
     * Get user's subscriptions
     */
    public List<NotificationSubscription> getUserSubscriptions(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    /**
     * Get user's active subscriptions
     */
    public List<NotificationSubscription> getUserActiveSubscriptions(Long userId) {
        return subscriptionRepository.findByUserIdAndActiveTrue(userId);
    }

    /**
     * Update subscription
     */
    @Transactional
    public NotificationSubscription updateSubscription(Long subscriptionId, NotificationSubscription updates) {
        NotificationSubscription subscription = subscriptionRepository.findById(subscriptionId)
            .orElseThrow(() -> new RuntimeException("Subscription not found"));

        if (updates.getRegion() != null) {
            subscription.setRegion(updates.getRegion());
        }
        if (updates.getMinIncome() != null) {
            subscription.setMinIncome(updates.getMinIncome());
        }
        if (updates.getMaxIncome() != null) {
            subscription.setMaxIncome(updates.getMaxIncome());
        }
        if (updates.getDeliveryMethod() != null) {
            subscription.setDeliveryMethod(updates.getDeliveryMethod());
        }

        NotificationSubscription saved = subscriptionRepository.save(subscription);
        log.info("Updated notification subscription: id={}", subscriptionId);
        return saved;
    }

    /**
     * Toggle subscription active status
     */
    @Transactional
    public void toggleSubscription(Long subscriptionId, boolean active) {
        NotificationSubscription subscription = subscriptionRepository.findById(subscriptionId)
            .orElseThrow(() -> new RuntimeException("Subscription not found"));

        subscription.setActive(active);
        subscriptionRepository.save(subscription);
        log.info("Toggled subscription: id={}, active={}", subscriptionId, active);
    }

    /**
     * Delete subscription
     */
    @Transactional
    public void deleteSubscription(Long subscriptionId) {
        subscriptionRepository.deleteById(subscriptionId);
        log.info("Deleted subscription: id={}", subscriptionId);
    }

    /**
     * Send new offer notification to matching subscribers
     */
    @Transactional
    public void sendNewOfferNotifications(OfferNotificationInfo offer) {
        List<NotificationSubscription> matchingSubscriptions =
            subscriptionRepository.findMatchingSubscriptions(
                NotificationSubscription.NotificationType.NEW,
                offer.region(),
                offer.income()
            );

        log.info("Found {} matching subscriptions for new offer: offerId={}",
            matchingSubscriptions.size(), offer.id());

        for (NotificationSubscription subscription : matchingSubscriptions) {
            // Check if already notified today
            if (isAlreadyNotifiedToday(subscription.getUserId(), offer.id())) {
                log.debug("User already notified today: userId={}, offerId={}",
                    subscription.getUserId(), offer.id());
                continue;
            }

            sendNotification(subscription, offer, NotificationLog.DeliveryType.EMAIL);
        }
    }

    /**
     * Send deadline alert notifications
     */
    @Transactional
    public void sendDeadlineAlertNotifications(OfferNotificationInfo offer, int daysLeft) {
        List<NotificationSubscription> matchingSubscriptions =
            subscriptionRepository.findMatchingSubscriptions(
                NotificationSubscription.NotificationType.DEADLINE,
                offer.region(),
                offer.income()
            );

        log.info("Found {} matching subscriptions for deadline alert: offerId={}, daysLeft={}",
            matchingSubscriptions.size(), offer.id(), daysLeft);

        for (NotificationSubscription subscription : matchingSubscriptions) {
            // Check if already notified today
            if (isAlreadyNotifiedToday(subscription.getUserId(), offer.id())) {
                log.debug("User already notified today: userId={}, offerId={}",
                    subscription.getUserId(), offer.id());
                continue;
            }

            sendDeadlineAlert(subscription, offer, daysLeft);
        }
    }

    /**
     * Send notification based on delivery method
     */
    private void sendNotification(
        NotificationSubscription subscription,
        OfferNotificationInfo offer,
        NotificationLog.DeliveryType deliveryType
    ) {
        try {
            User user = userService.findById(subscription.getUserId());

            EmailService.OfferInfo offerInfo = new EmailService.OfferInfo(
                offer.id(),
                offer.name(),
                offer.region(),
                offer.startDate(),
                offer.endDate(),
                offer.incomeRequirement()
            );

            switch (subscription.getDeliveryMethod()) {
                case EMAIL -> {
                    emailService.sendNewOfferNotification(user.getEmail(), user.getName(), offerInfo);
                    logNotification(subscription, offer.id(), NotificationLog.DeliveryType.EMAIL, true, null);
                }
                case PUSH -> {
                    // TODO: Get FCM token from user
                    // pushNotificationService.sendNewOfferNotification(fcmToken, user.getName(), offer.name(), offer.id());
                    log.warn("Push notification not implemented yet");
                }
                case BOTH -> {
                    emailService.sendNewOfferNotification(user.getEmail(), user.getName(), offerInfo);
                    logNotification(subscription, offer.id(), NotificationLog.DeliveryType.EMAIL, true, null);
                    // TODO: Send push notification
                }
            }

        } catch (Exception e) {
            log.error("Failed to send notification: subscriptionId={}, error={}",
                subscription.getId(), e.getMessage());
            logNotification(subscription, offer.id(), deliveryType, false, e.getMessage());
        }
    }

    /**
     * Send deadline alert
     */
    private void sendDeadlineAlert(
        NotificationSubscription subscription,
        OfferNotificationInfo offer,
        int daysLeft
    ) {
        try {
            User user = userService.findById(subscription.getUserId());

            EmailService.OfferInfo offerInfo = new EmailService.OfferInfo(
                offer.id(),
                offer.name(),
                offer.region(),
                offer.startDate(),
                offer.endDate(),
                offer.incomeRequirement()
            );

            switch (subscription.getDeliveryMethod()) {
                case EMAIL -> {
                    emailService.sendDeadlineAlertNotification(user.getEmail(), user.getName(), offerInfo, daysLeft);
                    logNotification(subscription, offer.id(), NotificationLog.DeliveryType.EMAIL, true, null);
                }
                case PUSH -> {
                    // TODO: Get FCM token and send push
                    log.warn("Push notification not implemented yet");
                }
                case BOTH -> {
                    emailService.sendDeadlineAlertNotification(user.getEmail(), user.getName(), offerInfo, daysLeft);
                    logNotification(subscription, offer.id(), NotificationLog.DeliveryType.EMAIL, true, null);
                    // TODO: Send push notification
                }
            }

        } catch (Exception e) {
            log.error("Failed to send deadline alert: subscriptionId={}, error={}",
                subscription.getId(), e.getMessage());
            logNotification(subscription, offer.id(), NotificationLog.DeliveryType.EMAIL, false, e.getMessage());
        }
    }

    /**
     * Check if user was already notified today
     */
    private boolean isAlreadyNotifiedToday(Long userId, Long offerId) {
        return logRepository.existsByUserIdAndOfferIdAndDate(userId, offerId, LocalDate.now());
    }

    /**
     * Log notification
     */
    private void logNotification(
        NotificationSubscription subscription,
        Long offerId,
        NotificationLog.DeliveryType deliveryType,
        boolean success,
        String failureReason
    ) {
        NotificationLog log = NotificationLog.builder()
            .userId(subscription.getUserId())
            .subscriptionId(subscription.getId())
            .offerId(offerId)
            .deliveryType(deliveryType)
            .status(success ? NotificationLog.NotificationStatus.SUCCESS : NotificationLog.NotificationStatus.FAILED)
            .failureReason(failureReason)
            .build();

        logRepository.save(log);
    }

    /**
     * Offer Notification Info record
     */
    public record OfferNotificationInfo(
        Long id,
        String name,
        String region,
        Long income,
        String startDate,
        String endDate,
        String incomeRequirement
    ) {}
}
