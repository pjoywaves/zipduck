package com.zipduck.api.controller;

import com.zipduck.api.dto.response.ApiResponse;
import com.zipduck.api.exception.BusinessException;
import com.zipduck.domain.eligibility.EligibilityCalculator;
import com.zipduck.domain.eligibility.EligibilityDetails;
import com.zipduck.domain.subscription.Subscription;
import com.zipduck.domain.subscription.SubscriptionQueryService;
import com.zipduck.domain.user.User;
import com.zipduck.domain.user.UserQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for eligibility checking and detailed analysis
 * T098: EligibilityController implementation
 * FR-007: Detailed eligibility breakdown for subscriptions
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/eligibility")
@RequiredArgsConstructor
@Tag(name = "Eligibility", description = "Eligibility checking and analysis APIs")
public class EligibilityController {

    private final EligibilityCalculator eligibilityCalculator;
    private final UserQueryService userQueryService;
    private final SubscriptionQueryService subscriptionQueryService;

    /**
     * Get detailed eligibility breakdown for a subscription
     * FR-007: Show which criteria the user passes or fails
     * FR-018: Requirements met and failed
     */
    @GetMapping("/{subscriptionId}")
    @Operation(
            summary = "Get eligibility details for a subscription",
            description = "Returns detailed breakdown showing which eligibility criteria pass or fail for the user"
    )
    public ResponseEntity<ApiResponse<EligibilityDetails>> getEligibilityDetails(
            @Parameter(description = "Subscription ID", required = true)
            @PathVariable Long subscriptionId,
            @Parameter(description = "User ID", required = true)
            @RequestParam Long userId) {

        log.debug("Get eligibility details request - Subscription: {}, User: {}", subscriptionId, userId);

        // Get user with profile
        User user = userQueryService.getByIdWithProfile(userId);
        if (user.getProfile() == null) {
            throw new BusinessException("PROFILE_NOT_FOUND",
                    "사용자 프로필을 찾을 수 없습니다. 먼저 프로필을 생성해주세요.");
        }

        // Get subscription
        Subscription subscription = subscriptionQueryService.getById(subscriptionId);

        // Calculate detailed eligibility
        EligibilityDetails details = eligibilityCalculator.getEligibilityDetails(
                user.getProfile(), subscription);

        log.info("Eligibility check - User: {}, Subscription: {}, Eligible: {}, Score: {}",
                userId, subscriptionId, details.getOverallEligible(), details.getMatchScore());

        return ResponseEntity.ok(ApiResponse.success(details));
    }

    /**
     * Check basic eligibility (yes/no only)
     * Faster alternative when detailed breakdown is not needed
     */
    @GetMapping("/{subscriptionId}/check")
    @Operation(
            summary = "Check basic eligibility",
            description = "Quick check to see if user is eligible for a subscription (yes/no only)"
    )
    public ResponseEntity<ApiResponse<Boolean>> checkEligibility(
            @PathVariable Long subscriptionId,
            @RequestParam Long userId) {

        log.debug("Basic eligibility check - Subscription: {}, User: {}", subscriptionId, userId);

        User user = userQueryService.getByIdWithProfile(userId);
        if (user.getProfile() == null) {
            throw new BusinessException("PROFILE_NOT_FOUND",
                    "사용자 프로필을 찾을 수 없습니다. 먼저 프로필을 생성해주세요.");
        }

        Subscription subscription = subscriptionQueryService.getById(subscriptionId);
        boolean isEligible = eligibilityCalculator.isEligible(user.getProfile(), subscription);

        log.debug("Basic eligibility result - User: {}, Subscription: {}, Eligible: {}",
                userId, subscriptionId, isEligible);

        return ResponseEntity.ok(ApiResponse.success(isEligible));
    }

    /**
     * Calculate match score for a subscription
     * FR-008: Eligibility score calculation
     */
    @GetMapping("/{subscriptionId}/score")
    @Operation(
            summary = "Calculate match score",
            description = "Calculate how well the user matches the subscription criteria (0-100)"
    )
    public ResponseEntity<ApiResponse<Integer>> calculateMatchScore(
            @PathVariable Long subscriptionId,
            @RequestParam Long userId) {

        log.debug("Calculate match score - Subscription: {}, User: {}", subscriptionId, userId);

        User user = userQueryService.getByIdWithProfile(userId);
        if (user.getProfile() == null) {
            throw new BusinessException("PROFILE_NOT_FOUND",
                    "사용자 프로필을 찾을 수 없습니다. 먼저 프로필을 생성해주세요.");
        }

        Subscription subscription = subscriptionQueryService.getById(subscriptionId);
        int matchScore = eligibilityCalculator.calculateMatchScore(user.getProfile(), subscription);

        log.debug("Match score calculated - User: {}, Subscription: {}, Score: {}",
                userId, subscriptionId, matchScore);

        return ResponseEntity.ok(ApiResponse.success(matchScore));
    }
}
