package com.zipduck.notification.service;

import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Push Notification Service
 * - Firebase Cloud Messaging (FCM)을 통한 푸시 알림
 * - 비동기 처리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PushNotificationService {

    private final FirebaseMessaging firebaseMessaging;

    /**
     * Send push notification to FCM token
     */
    @Async("notificationExecutor")
    public void sendPushNotification(String fcmToken, String title, String body, String offerId) {
        try {
            Message message = Message.builder()
                .setToken(fcmToken)
                .setNotification(Notification.builder()
                    .setTitle(title)
                    .setBody(body)
                    .build())
                .putData("offerId", offerId)
                .putData("type", "offer_notification")
                .setAndroidConfig(AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .setNotification(AndroidNotification.builder()
                        .setSound("default")
                        .setClickAction("OPEN_OFFER")
                        .build())
                    .build())
                .setApnsConfig(ApnsConfig.builder()
                    .setAps(Aps.builder()
                        .setSound("default")
                        .setBadge(1)
                        .build())
                    .build())
                .build();

            String response = firebaseMessaging.send(message);
            log.info("Push notification sent successfully: token={}, response={}", fcmToken, response);

        } catch (FirebaseMessagingException e) {
            log.error("Failed to send push notification: token={}, error={}",
                fcmToken, e.getMessage());
            throw new RuntimeException("Failed to send push notification", e);
        }
    }

    /**
     * Send new offer push notification
     */
    public void sendNewOfferNotification(String fcmToken, String userName, String offerName, Long offerId) {
        String title = "새로운 청약 공고";
        String body = String.format("%s님, 조건에 맞는 청약이 등록되었습니다: %s", userName, offerName);

        sendPushNotification(fcmToken, title, body, String.valueOf(offerId));
    }

    /**
     * Send deadline alert push notification
     */
    public void sendDeadlineAlertNotification(
        String fcmToken,
        String userName,
        String offerName,
        int daysLeft,
        Long offerId
    ) {
        String title = String.format("마감 임박 (%d일 남음)", daysLeft);
        String body = String.format("%s님, '%s' 청약 마감이 %d일 남았습니다!", userName, offerName, daysLeft);

        sendPushNotification(fcmToken, title, body, String.valueOf(offerId));
    }
}
