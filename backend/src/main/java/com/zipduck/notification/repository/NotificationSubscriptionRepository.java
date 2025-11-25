package com.zipduck.notification.repository;

import com.zipduck.notification.domain.NotificationSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Notification Subscription Repository
 */
@Repository
public interface NotificationSubscriptionRepository extends JpaRepository<NotificationSubscription, Long> {

    /**
     * Find all subscriptions by user ID
     */
    List<NotificationSubscription> findByUserId(Long userId);

    /**
     * Find all active subscriptions by user ID
     */
    List<NotificationSubscription> findByUserIdAndActiveTrue(Long userId);

    /**
     * Find all active subscriptions by type
     */
    List<NotificationSubscription> findByActiveTrueAndNotificationType(
        NotificationSubscription.NotificationType notificationType
    );

    /**
     * Find matching subscriptions for an offer
     * - Active subscriptions only
     * - Match region (if specified)
     * - Match income range (if specified)
     */
    @Query("""
        SELECT ns FROM NotificationSubscription ns
        WHERE ns.active = true
        AND ns.notificationType = :notificationType
        AND (ns.region IS NULL OR ns.region = :region)
        AND (ns.minIncome IS NULL OR :income >= ns.minIncome)
        AND (ns.maxIncome IS NULL OR :income <= ns.maxIncome)
        """)
    List<NotificationSubscription> findMatchingSubscriptions(
        NotificationSubscription.NotificationType notificationType,
        String region,
        Long income
    );

    /**
     * Delete all subscriptions by user ID
     */
    void deleteByUserId(Long userId);
}
