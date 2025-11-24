package com.zipduck.domain.favorite;

import com.zipduck.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for Favorite read operations
 * FR-009: Favorites management
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteQueryService {

    private final FavoriteRepository favoriteRepository;

    /**
     * Get all favorites for a user
     */
    public List<Favorite> getFavoritesByUserId(Long userId) {
        log.debug("Fetching favorites for user: {}", userId);
        return favoriteRepository.findByUserIdWithSubscription(userId);
    }

    /**
     * Get favorite by ID
     */
    public Favorite getById(Long id) {
        return favoriteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found with id: " + id));
    }

    /**
     * Check if subscription is favorited by user
     */
    public boolean isFavorited(Long userId, Long subscriptionId) {
        return favoriteRepository.existsByUserIdAndSubscriptionId(userId, subscriptionId);
    }

    /**
     * Count user's favorites
     */
    public long countByUserId(Long userId) {
        return favoriteRepository.countByUserId(userId);
    }
}
