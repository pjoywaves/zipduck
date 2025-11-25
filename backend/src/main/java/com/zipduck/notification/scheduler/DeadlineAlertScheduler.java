package com.zipduck.notification.scheduler;

import com.zipduck.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Deadline Alert Scheduler
 * - 매일 아침 9시에 마감 임박 알림 발송
 * - 마감 N일 전 알림 (설정 가능)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DeadlineAlertScheduler {

    private final NotificationService notificationService;

    @Value("${app.notification.deadline-alert-days:3}")
    private int deadlineAlertDays;

    /**
     * Send deadline alerts
     * Runs every day at 9:00 AM
     */
    @Scheduled(cron = "0 0 9 * * *", zone = "Asia/Seoul")
    public void sendDeadlineAlerts() {
        log.info("Starting deadline alert job: daysLeft={}", deadlineAlertDays);

        try {
            // TODO: Fetch offers with deadline in N days from database
            // For now, this is a placeholder
            log.info("Deadline alert job completed");

        } catch (Exception e) {
            log.error("Failed to send deadline alerts: {}", e.getMessage(), e);
        }
    }

    /**
     * Example method to trigger deadline alert for a specific offer
     * This would be called by the job above after fetching matching offers
     */
    public void sendDeadlineAlert(NotificationService.OfferNotificationInfo offer, int daysLeft) {
        try {
            notificationService.sendDeadlineAlertNotifications(offer, daysLeft);
            log.info("Sent deadline alerts for offer: offerId={}, daysLeft={}", offer.id(), daysLeft);
        } catch (Exception e) {
            log.error("Failed to send deadline alert for offer {}: {}",
                offer.id(), e.getMessage(), e);
        }
    }
}
