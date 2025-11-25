package com.zipduck.notification.repository;

import com.zipduck.notification.domain.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Notification Log Repository
 */
@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    /**
     * Find logs by user ID
     */
    List<NotificationLog> findByUserId(Long userId);

    /**
     * Find logs by user ID and offer ID
     */
    List<NotificationLog> findByUserIdAndOfferId(Long userId, Long offerId);

    /**
     * Check if notification was already sent today
     */
    @Query("""
        SELECT COUNT(nl) > 0 FROM NotificationLog nl
        WHERE nl.userId = :userId
        AND nl.offerId = :offerId
        AND DATE(nl.sentAt) = :date
        AND nl.status = 'SUCCESS'
        """)
    boolean existsByUserIdAndOfferIdAndDate(Long userId, Long offerId, LocalDate date);

    /**
     * Find logs by date range
     */
    List<NotificationLog> findBySentAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Find failed logs
     */
    List<NotificationLog> findByStatus(NotificationLog.NotificationStatus status);

    /**
     * Delete logs older than specified date
     */
    void deleteBySentAtBefore(LocalDateTime date);
}
