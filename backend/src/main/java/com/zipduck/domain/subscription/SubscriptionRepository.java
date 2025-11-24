package com.zipduck.domain.subscription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Subscription entity
 */
@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    /**
     * Find all active subscriptions
     */
    List<Subscription> findByIsActiveTrue();

    /**
     * Find active subscriptions by data source
     * FR-027: Source filtering
     */
    List<Subscription> findByIsActiveTrueAndDataSource(Subscription.DataSource dataSource);

    /**
     * Find active subscriptions by location
     */
    List<Subscription> findByIsActiveTrueAndLocationContaining(String location);

    /**
     * Find subscription by public data ID
     * FR-028: Duplicate detection
     */
    Optional<Subscription> findByPublicDataId(String publicDataId);

    /**
     * Find expired subscriptions
     * FR-030: Expiration management
     */
    @Query("SELECT s FROM Subscription s WHERE s.isActive = true AND s.applicationEndDate < :today")
    List<Subscription> findExpiredSubscriptions(@Param("today") LocalDate today);

    /**
     * Find subscriptions matching user criteria
     * This is a simplified version - full filtering is done in service layer
     */
    @Query("SELECT s FROM Subscription s WHERE s.isActive = true " +
           "AND (:location IS NULL OR s.location LIKE %:location%) " +
           "AND (:minPrice IS NULL OR s.minPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR s.maxPrice <= :maxPrice)")
    List<Subscription> findMatchingSubscriptions(
            @Param("location") String location,
            @Param("minPrice") Long minPrice,
            @Param("maxPrice") Long maxPrice
    );
}