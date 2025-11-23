package com.zipduck.domain.eligibility;

import com.zipduck.domain.subscription.Subscription;
import com.zipduck.domain.user.UserProfile;
import org.springframework.stereotype.Service;

/**
 * Service for calculating eligibility and filtering logic
 * FR-004, FR-012, FR-032
 */
@Service
public class EligibilityCalculator {

    /**
     * Check if user is eligible for a subscription
     * FR-004: Filter based on user profile criteria
     * FR-012: Handle edge cases at exact thresholds (inclusive)
     */
    public boolean isEligible(UserProfile profile, Subscription subscription) {
        // Age check
        if (!isAgeEligible(profile.getAge(), subscription.getMinAge(), subscription.getMaxAge())) {
            return false;
        }

        // Income check
        if (!isIncomeEligible(profile.getAnnualIncome(), subscription.getMinIncome(), subscription.getMaxIncome())) {
            return false;
        }

        // Household members check
        if (!isHouseholdEligible(profile.getHouseholdMembers(),
                subscription.getMinHouseholdMembers(), subscription.getMaxHouseholdMembers())) {
            return false;
        }

        // Housing owned check
        if (!isHousingOwnedEligible(profile.getHousingOwned(), subscription.getMaxHousingOwned())) {
            return false;
        }

        return true;
    }

    /**
     * Calculate match score for a subscription (0-100)
     * FR-008: Calculate eligibility score
     */
    public int calculateMatchScore(UserProfile profile, Subscription subscription) {
        if (!isEligible(profile, subscription)) {
            return 0;
        }

        int score = 100;
        int penalties = 0;

        // Prefer subscriptions with lower housing owned requirements
        if (subscription.getMaxHousingOwned() != null && profile.getHousingOwned() > 0) {
            penalties += 5;
        }

        // Prefer subscriptions with better income match
        if (subscription.getMinIncome() != null && subscription.getMaxIncome() != null) {
            long incomeRange = subscription.getMaxIncome() - subscription.getMinIncome();
            long incomePosition = profile.getAnnualIncome() - subscription.getMinIncome();
            // Penalize if user is near the boundaries
            if (incomePosition < incomeRange * 0.1 || incomePosition > incomeRange * 0.9) {
                penalties += 10;
            }
        }

        // Location preference bonus
        if (profile.getLocationPreferences() != null && subscription.getLocation() != null) {
            String[] preferredLocations = profile.getLocationPreferences().split(",");
            boolean locationMatch = false;
            for (String loc : preferredLocations) {
                if (subscription.getLocation().contains(loc.trim())) {
                    locationMatch = true;
                    break;
                }
            }
            if (!locationMatch) {
                penalties += 15;
            }
        }

        return Math.max(0, score - penalties);
    }

    /**
     * Get eligibility details showing which criteria pass/fail
     */
    public EligibilityDetails getEligibilityDetails(UserProfile profile, Subscription subscription) {
        return EligibilityDetails.builder()
                .ageEligible(isAgeEligible(profile.getAge(), subscription.getMinAge(), subscription.getMaxAge()))
                .incomeEligible(isIncomeEligible(profile.getAnnualIncome(),
                        subscription.getMinIncome(), subscription.getMaxIncome()))
                .householdEligible(isHouseholdEligible(profile.getHouseholdMembers(),
                        subscription.getMinHouseholdMembers(), subscription.getMaxHouseholdMembers()))
                .housingOwnedEligible(isHousingOwnedEligible(profile.getHousingOwned(),
                        subscription.getMaxHousingOwned()))
                .overallEligible(isEligible(profile, subscription))
                .matchScore(calculateMatchScore(profile, subscription))
                .build();
    }

    private boolean isAgeEligible(Integer userAge, Integer minAge, Integer maxAge) {
        if (minAge != null && userAge < minAge) {
            return false;
        }
        if (maxAge != null && userAge > maxAge) {
            return false;
        }
        return true;
    }

    private boolean isIncomeEligible(Long userIncome, Long minIncome, Long maxIncome) {
        // FR-012: Inclusive boundaries
        if (minIncome != null && userIncome < minIncome) {
            return false;
        }
        if (maxIncome != null && userIncome > maxIncome) {
            return false;
        }
        return true;
    }

    private boolean isHouseholdEligible(Integer userHousehold, Integer minHousehold, Integer maxHousehold) {
        if (minHousehold != null && userHousehold < minHousehold) {
            return false;
        }
        if (maxHousehold != null && userHousehold > maxHousehold) {
            return false;
        }
        return true;
    }

    private boolean isHousingOwnedEligible(Integer userHousingOwned, Integer maxHousingOwned) {
        // FR-012: Inclusive boundary
        if (maxHousingOwned != null && userHousingOwned > maxHousingOwned) {
            return false;
        }
        return true;
    }
}