package com.zipduck.application.ai;

import com.zipduck.domain.eligibility.EligibilityCalculator;
import com.zipduck.domain.subscription.Subscription;
import com.zipduck.domain.user.UserProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service for calculating detailed eligibility match scores
 * FR-008: Calculate eligibility score for each subscription
 * T064: EligibilityScorer implementation
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EligibilityScorer {

    private final EligibilityCalculator eligibilityCalculator;

    /**
     * Calculate detailed match score with breakdown
     * FR-008: Provide detailed scoring information
     */
    public MatchScoreResult calculateDetailedScore(UserProfile profile, Subscription subscription) {
        log.debug("Calculating detailed match score for subscription: {}", subscription.getName());

        MatchScoreResult result = new MatchScoreResult();
        result.subscriptionId = subscription.getId();
        result.subscriptionName = subscription.getName();

        // Check eligibility first
        boolean isEligible = eligibilityCalculator.isEligible(profile, subscription);
        result.isEligible = isEligible;

        if (!isEligible) {
            result.overallScore = 0;
            result.reason = "자격 조건 미달";
            return result;
        }

        // Calculate component scores
        int baseScore = 100;
        int penalties = 0;

        // Age compatibility (5 points)
        result.ageScore = calculateAgeScore(profile.getAge(), subscription.getMinAge(), subscription.getMaxAge());
        penalties += (10 - result.ageScore);

        // Income compatibility (30 points)
        result.incomeScore = calculateIncomeScore(profile.getAnnualIncome(),
                subscription.getMinIncome(), subscription.getMaxIncome());
        penalties += (30 - result.incomeScore);

        // Household compatibility (10 points)
        result.householdScore = calculateHouseholdScore(profile.getHouseholdMembers(),
                subscription.getMinHouseholdMembers(), subscription.getMaxHouseholdMembers());
        penalties += (10 - result.householdScore);

        // Housing owned compatibility (20 points)
        result.housingOwnedScore = calculateHousingOwnedScore(profile.getHousingOwned(),
                subscription.getMaxHousingOwned());
        penalties += (20 - result.housingOwnedScore);

        // Location preference match (30 points)
        result.locationScore = calculateLocationScore(profile.getLocationPreferences(),
                subscription.getLocation());
        penalties += (30 - result.locationScore);

        result.overallScore = Math.max(0, baseScore - penalties);
        result.reason = generateScoreReason(result);

        log.debug("Match score calculated: {} for subscription: {}", result.overallScore, subscription.getName());
        return result;
    }

    private int calculateAgeScore(Integer userAge, Integer minAge, Integer maxAge) {
        if (minAge == null && maxAge == null) {
            return 10; // No age restriction = perfect score
        }

        // Check how far from boundaries
        if (minAge != null && userAge < minAge + 5) {
            return 7; // Close to minimum
        }
        if (maxAge != null && userAge > maxAge - 5) {
            return 7; // Close to maximum
        }

        return 10; // Well within range
    }

    private int calculateIncomeScore(Long userIncome, Long minIncome, Long maxIncome) {
        if (minIncome == null && maxIncome == null) {
            return 30; // No income restriction = perfect score
        }

        if (minIncome != null && maxIncome != null) {
            long range = maxIncome - minIncome;
            long position = userIncome - minIncome;
            double ratio = (double) position / range;

            // Best score in middle 60% of range
            if (ratio >= 0.2 && ratio <= 0.8) {
                return 30;
            } else if (ratio >= 0.1 && ratio <= 0.9) {
                return 25;
            } else {
                return 20; // Near boundaries
            }
        }

        return 25; // Partial restriction
    }

    private int calculateHouseholdScore(Integer userHousehold, Integer minHousehold, Integer maxHousehold) {
        if (minHousehold == null && maxHousehold == null) {
            return 10; // No restriction = perfect score
        }

        // Exact match or middle of range gets higher score
        if (minHousehold != null && maxHousehold != null) {
            int middle = (minHousehold + maxHousehold) / 2;
            int distance = Math.abs(userHousehold - middle);

            if (distance == 0) return 10;
            if (distance <= 1) return 8;
            return 6;
        }

        return 8; // Partial restriction
    }

    private int calculateHousingOwnedScore(Integer userHousingOwned, Integer maxHousingOwned) {
        if (maxHousingOwned == null) {
            return 20; // No restriction = perfect score
        }

        // Perfect score for 0 housing owned (most common requirement)
        if (userHousingOwned == 0 && maxHousingOwned == 0) {
            return 20;
        }

        // Penalty for owning housing when not allowed
        if (userHousingOwned > 0 && maxHousingOwned == 0) {
            return 0; // Should not be eligible
        }

        // Proportional score based on how much housing owned vs allowed
        double ratio = (double) userHousingOwned / maxHousingOwned;
        if (ratio <= 0.5) return 20;
        if (ratio <= 0.75) return 15;
        return 10;
    }

    private int calculateLocationScore(String userPreferences, String subscriptionLocation) {
        if (userPreferences == null || userPreferences.isEmpty()) {
            return 15; // No preference specified
        }

        if (subscriptionLocation == null || subscriptionLocation.isEmpty()) {
            return 15; // No location info
        }

        String[] preferredLocations = userPreferences.split(",");
        for (String loc : preferredLocations) {
            String trimmedLoc = loc.trim();
            if (subscriptionLocation.contains(trimmedLoc)) {
                return 30; // Perfect match
            }
        }

        return 5; // No match
    }

    private String generateScoreReason(MatchScoreResult result) {
        if (!result.isEligible) {
            return "자격 조건을 충족하지 못합니다";
        }

        if (result.overallScore >= 90) {
            return "매우 적합한 청약입니다";
        } else if (result.overallScore >= 75) {
            return "적합한 청약입니다";
        } else if (result.overallScore >= 60) {
            return "조건부 적합입니다";
        } else {
            return "자격은 있으나 조건이 다소 맞지 않습니다";
        }
    }

    /**
     * Match score result with detailed breakdown
     */
    public static class MatchScoreResult {
        public Long subscriptionId;
        public String subscriptionName;
        public boolean isEligible;
        public int overallScore;
        public int ageScore;
        public int incomeScore;
        public int householdScore;
        public int housingOwnedScore;
        public int locationScore;
        public String reason;
    }
}
