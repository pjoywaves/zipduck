package com.zipduck.api.controller;

import com.zipduck.api.dto.request.UserProfileRequest;
import com.zipduck.api.dto.response.ApiResponse;
import com.zipduck.api.dto.response.UserProfileResponse;
import com.zipduck.domain.user.User;
import com.zipduck.domain.user.UserCommandService;
import com.zipduck.domain.user.UserProfile;
import com.zipduck.domain.user.UserQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * User and Profile API Controller
 * T029: POST /api/v1/users/profile, GET /api/v1/users/{userId}/profile, PUT /api/v1/users/{userId}/profile
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "User and profile management APIs")
public class UserController {

    private final UserQueryService userQueryService;
    private final UserCommandService userCommandService;

    /**
     * Create user profile
     * FR-001, FR-002
     */
    @PostMapping("/{userId}/profile")
    @Operation(summary = "Create or update user profile", description = "Create or update user profile with eligibility information")
    public ResponseEntity<ApiResponse<UserProfileResponse>> createOrUpdateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserProfileRequest request) {

        UserProfile profile = userCommandService.createOrUpdateProfile(
                userId,
                request.getAge(),
                request.getAnnualIncome(),
                request.getHouseholdMembers(),
                request.getHousingOwned(),
                request.getLocationPreferences()
        );

        UserProfileResponse response = UserProfileResponse.from(profile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    /**
     * Get user profile
     * FR-006
     */
    @GetMapping("/{userId}/profile")
    @Operation(summary = "Get user profile", description = "Retrieve user profile information")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(@PathVariable Long userId) {
        User user = userQueryService.getByIdWithProfile(userId);

        if (user.getProfile() == null) {
            return ResponseEntity.ok(ApiResponse.success(null));
        }

        UserProfileResponse response = UserProfileResponse.from(user.getProfile());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Update notification settings
     * FR-015
     */
    @PatchMapping("/{userId}/profile/notifications")
    @Operation(summary = "Update notification settings", description = "Enable or disable notifications for the user")
    public ResponseEntity<ApiResponse<Void>> updateNotifications(
            @PathVariable Long userId,
            @RequestParam Boolean enabled) {

        userCommandService.updateNotificationSettings(userId, enabled);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}