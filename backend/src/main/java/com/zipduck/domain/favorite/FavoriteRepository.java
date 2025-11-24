package com.zipduck.domain.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Favorite entity
 * T097: FavoriteRepository interface
 * FR-009: Favorites management data access
 */
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    /**
     * Find all favorites for a specific user
     */
    @Query("SELECT f FROM Favorite f " +
            "JOIN FETCH f.subscription s " +
            "WHERE f.user.id = :userId " +
            "AND s.isActive = true " +
            "ORDER BY f.createdAt DESC")
    List<Favorite> findByUserIdWithSubscription(@Param("userId") Long userId);

    /**
     * Check if a subscription is already favorited by user
     */
    @Query("SELECT f FROM Favorite f " +
            "WHERE f.user.id = :userId " +
            "AND f.subscription.id = :subscriptionId")
    Optional<Favorite> findByUserIdAndSubscriptionId(
            @Param("userId") Long userId,
            @Param("subscriptionId") Long subscriptionId
    );

    /**
     * Check if favorite exists
     */
    boolean existsByUserIdAndSubscriptionId(Long userId, Long subscriptionId);

    /**
     * Delete a specific favorite
     */
    void deleteByUserIdAndSubscriptionId(Long userId, Long subscriptionId);

    /**
     * Count user's favorites
     */
    long countByUserId(Long userId);

    /**
     * Delete all favorites for a subscription (when subscription is removed)
     */
    void deleteBySubscriptionId(Long subscriptionId);
}
