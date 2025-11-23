package com.zipduck.domain.subscription;

import com.zipduck.api.exception.ResourceNotFoundException;
import com.zipduck.domain.eligibility.EligibilityCalculator;
import com.zipduck.domain.user.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Subscription read operations
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubscriptionQueryService {

    private final SubscriptionRepository subscriptionRepository;
    private final EligibilityCalculator eligibilityCalculator;

    /**
     * Get subscription by ID
     */
    public Subscription getById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
    }

    /**
     * Get all active subscriptions
     */
    public List<Subscription> getAllActive() {
        return subscriptionRepository.findByIsActiveTrue();
    }

    /**
     * Get recommendations for user profile
     * FR-004, FR-005, FR-026, FR-027, FR-032
     * T035: Unified recommendation logic with source filtering
     */
    public List<Subscription> getRecommendations(UserProfile profile, Subscription.DataSource sourceFilter) {
        List<Subscription> subscriptions;

        // Apply source filter (FR-027)
        if (sourceFilter == null) {
            subscriptions = subscriptionRepository.findByIsActiveTrue();
        } else {
            subscriptions = subscriptionRepository.findByIsActiveTrueAndDataSource(sourceFilter);
        }

        // Filter by eligibility (FR-004, FR-032)
        List<Subscription> eligibleSubscriptions = subscriptions.stream()
                .filter(subscription -> eligibilityCalculator.isEligible(profile, subscription))
                .collect(Collectors.toList());

        // Sort by match score (FR-008)
        eligibleSubscriptions.sort(
                Comparator.comparingInt((Subscription s) ->
                        eligibilityCalculator.calculateMatchScore(profile, s)).reversed()
        );

        return eligibleSubscriptions;
    }

    /**
     * Get all active subscriptions by location
     */
    public List<Subscription> getByLocation(String location) {
        return subscriptionRepository.findByIsActiveTrueAndLocationContaining(location);
    }

    /**
     * Find subscription by public data ID (for duplicate detection)
     * FR-028
     */
    public Subscription findByPublicDataId(String publicDataId) {
        return subscriptionRepository.findByPublicDataId(publicDataId).orElse(null);
    }
}