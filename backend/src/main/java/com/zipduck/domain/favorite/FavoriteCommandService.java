package com.zipduck.domain.favorite;

import com.zipduck.api.exception.BusinessException;
import com.zipduck.domain.subscription.Subscription;
import com.zipduck.domain.subscription.SubscriptionQueryService;
import com.zipduck.domain.user.User;
import com.zipduck.domain.user.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for Favorite write operations
 * FR-009: Favorites management
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteCommandService {

    private final FavoriteRepository favoriteRepository;
    private final UserQueryService userQueryService;
    private final SubscriptionQueryService subscriptionQueryService;

    /**
     * Add subscription to favorites
     */
    public Favorite addFavorite(Long userId, Long subscriptionId, String note) {
        // Check if already favorited
        if (favoriteRepository.existsByUserIdAndSubscriptionId(userId, subscriptionId)) {
            throw new BusinessException("ALREADY_FAVORITED",
                    "이 청약은 이미 즐겨찾기에 추가되어 있습니다.");
        }

        // Get user and subscription
        User user = userQueryService.getById(userId);
        Subscription subscription = subscriptionQueryService.getById(subscriptionId);

        // Validate subscription is active
        if (!subscription.getIsActive()) {
            throw new BusinessException("SUBSCRIPTION_INACTIVE",
                    "비활성화된 청약은 즐겨찾기에 추가할 수 없습니다.");
        }

        // Create favorite
        Favorite favorite = Favorite.builder()
                .user(user)
                .subscription(subscription)
                .note(note)
                .build();

        Favorite saved = favoriteRepository.save(favorite);
        log.info("Added favorite - User: {}, Subscription: {}", userId, subscriptionId);

        return saved;
    }

    /**
     * Remove subscription from favorites
     */
    public void removeFavorite(Long userId, Long subscriptionId) {
        // Check if favorite exists
        if (!favoriteRepository.existsByUserIdAndSubscriptionId(userId, subscriptionId)) {
            throw new BusinessException("FAVORITE_NOT_FOUND",
                    "즐겨찾기를 찾을 수 없습니다.");
        }

        favoriteRepository.deleteByUserIdAndSubscriptionId(userId, subscriptionId);
        log.info("Removed favorite - User: {}, Subscription: {}", userId, subscriptionId);
    }

    /**
     * Update note for a favorite
     */
    public Favorite updateNote(Long userId, Long subscriptionId, String note) {
        Favorite favorite = favoriteRepository.findByUserIdAndSubscriptionId(userId, subscriptionId)
                .orElseThrow(() -> new BusinessException("FAVORITE_NOT_FOUND",
                        "즐겨찾기를 찾을 수 없습니다."));

        favorite.updateNote(note);
        log.debug("Updated favorite note - User: {}, Subscription: {}", userId, subscriptionId);

        return favorite;
    }
}
