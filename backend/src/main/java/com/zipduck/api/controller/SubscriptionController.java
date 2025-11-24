package com.zipduck.api.controller;

import com.zipduck.api.dto.response.ApiResponse;
import com.zipduck.api.dto.response.SubscriptionDto;
import com.zipduck.api.dto.response.SubscriptionListResponse;
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Subscription API Controller
 * T038: GET /api/v1/subscriptions/recommendations with sourceFilter param
 */
@RestController
@RequestMapping("/api/v1/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscription", description = "Housing subscription recommendation APIs")
public class SubscriptionController {

    private final SubscriptionQueryService subscriptionQueryService;
    private final UserQueryService userQueryService;
    private final EligibilityCalculator eligibilityCalculator;

    /**
     * Get personalized recommendations for a user
     * FR-004, FR-005, FR-026, FR-027, FR-032
     */
    @GetMapping("/recommendations")
    @Operation(
            summary = "Get personalized subscription recommendations",
            description = "Get housing subscriptions filtered by user eligibility with optional source filtering"
    )
    public ResponseEntity<ApiResponse<SubscriptionListResponse>> getRecommendations(
            @Parameter(description = "User ID", required = true)
            @RequestParam Long id,
            @Parameter(description = "Source filter: ALL, PUBLIC_DB, PDF_UPLOAD, MERGED")
            @RequestParam(required = false) String sourceFilter) {

        // Get user with profile
        User user = userQueryService.getByIdWithProfile(id);
        if (user.getProfile() == null) {
            throw new BusinessException("PROFILE_NOT_FOUND", "User profile not found. Please create a profile first.");
        }

        // Parse source filter
        Subscription.DataSource dataSourceFilter = null;
        if (sourceFilter != null && !sourceFilter.equalsIgnoreCase("ALL")) {
            try {
                dataSourceFilter = Subscription.DataSource.valueOf(sourceFilter.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BusinessException("INVALID_SOURCE_FILTER", "Invalid source filter: " + sourceFilter);
            }
        }

        // Get recommendations with eligibility filtering
        List<Subscription> recommendations = subscriptionQueryService.getRecommendations(
                user.getProfile(), dataSourceFilter);

        // Convert to DTOs with eligibility details
        List<SubscriptionDto> dtos = recommendations.stream()
                .map(subscription -> {
                    EligibilityDetails details = eligibilityCalculator.getEligibilityDetails(
                            user.getProfile(), subscription);
                    return SubscriptionDto.fromWithEligibility(subscription, details);
                })
                .collect(Collectors.toList());

        SubscriptionListResponse response = SubscriptionListResponse.of(dtos,
                sourceFilter != null ? sourceFilter : "ALL");

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Get subscription by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get subscription by ID", description = "Retrieve detailed subscription information")
    public ResponseEntity<ApiResponse<SubscriptionDto>> getById(@PathVariable Long id) {
        Subscription subscription = subscriptionQueryService.getById(id);
        SubscriptionDto dto = SubscriptionDto.from(subscription);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /**
     * Get subscription by ID with eligibility check
     */
    @GetMapping("/{id}/eligibility")
    @Operation(
            summary = "Get subscription with eligibility details",
            description = "Retrieve subscription with detailed eligibility analysis for a user"
    )
    public ResponseEntity<ApiResponse<SubscriptionDto>> getByIdWithEligibility(
            @PathVariable Long id,
            @RequestParam Long userId) {

        Subscription subscription = subscriptionQueryService.getById(id);
        User user = userQueryService.getByIdWithProfile(userId);

        if (user.getProfile() == null) {
            throw new BusinessException("PROFILE_NOT_FOUND", "User profile not found");
        }

        EligibilityDetails details = eligibilityCalculator.getEligibilityDetails(
                user.getProfile(), subscription);
        SubscriptionDto dto = SubscriptionDto.fromWithEligibility(subscription, details);

        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /**
     * Get all active subscriptions (no filtering)
     */
    @GetMapping
    @Operation(summary = "Get all active subscriptions", description = "Retrieve all active housing subscriptions")
    public ResponseEntity<ApiResponse<SubscriptionListResponse>> getAllActive(
            @Parameter(description = "Source filter: ALL, PUBLIC_DB, PDF_UPLOAD, MERGED")
            @RequestParam(required = false) String sourceFilter) {

        List<Subscription> subscriptions;

        if (sourceFilter != null && !sourceFilter.equalsIgnoreCase("ALL")) {
            try {
                Subscription.DataSource dataSourceFilter = Subscription.DataSource.valueOf(sourceFilter.toUpperCase());
                subscriptions = subscriptionQueryService.getAllActive().stream()
                        .filter(s -> s.getDataSource() == dataSourceFilter)
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                throw new BusinessException("INVALID_SOURCE_FILTER", "Invalid source filter: " + sourceFilter);
            }
        } else {
            subscriptions = subscriptionQueryService.getAllActive();
        }

        List<SubscriptionDto> dtos = subscriptions.stream()
                .map(SubscriptionDto::from)
                .collect(Collectors.toList());

        SubscriptionListResponse response = SubscriptionListResponse.of(dtos,
                sourceFilter != null ? sourceFilter : "ALL");

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}