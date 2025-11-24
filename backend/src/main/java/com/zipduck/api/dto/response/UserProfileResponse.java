package com.zipduck.api.dto.response;

import com.zipduck.domain.user.UserProfile;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for user profile
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User profile response")
public class UserProfileResponse {

    @Schema(description = "Profile ID", example = "1")
    private Long id;

    @Schema(description = "User age", example = "32")
    private Integer age;

    @Schema(description = "Annual household income in KRW", example = "60000000")
    private Long annualIncome;

    @Schema(description = "Number of household members", example = "2")
    private Integer householdMembers;

    @Schema(description = "Number of housing units owned", example = "0")
    private Integer housingOwned;

    @Schema(description = "Comma-separated list of preferred locations", example = "서울,경기,인천")
    private String locationPreferences;

    @Schema(description = "Notifications enabled", example = "false")
    private Boolean notificationsEnabled;

    @Schema(description = "Profile created at")
    private LocalDateTime createdAt;

    @Schema(description = "Profile updated at")
    private LocalDateTime updatedAt;

    public static UserProfileResponse from(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .age(profile.getAge())
                .annualIncome(profile.getAnnualIncome())
                .householdMembers(profile.getHouseholdMembers())
                .housingOwned(profile.getHousingOwned())
                .locationPreferences(profile.getLocationPreferences())
                .notificationsEnabled(profile.getNotificationsEnabled())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}