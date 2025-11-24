package com.zipduck.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for user profile creation/update
 * FR-001, FR-002: User profile input with validation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User profile request")
public class UserProfileRequest {

    @NotNull(message = "Age is required")
    @Positive(message = "Age must be a positive integer")
    @Min(value = 19, message = "Age must be at least 19")
    @Max(value = 150, message = "Age must be less than 150")
    @Schema(description = "User age", example = "32")
    private Integer age;

    @NotNull(message = "Annual income is required")
    @Positive(message = "Annual income must be a positive number")
    @Schema(description = "Annual household income in KRW", example = "60000000")
    private Long annualIncome;

    @NotNull(message = "Household members is required")
    @Positive(message = "Household members must be a positive integer")
    @Max(value = 20, message = "Household members must be less than 20")
    @Schema(description = "Number of household members", example = "2")
    private Integer householdMembers;

    @NotNull(message = "Housing owned is required")
    @Min(value = 0, message = "Housing owned must be non-negative")
    @Max(value = 10, message = "Housing owned must be less than 10")
    @Schema(description = "Number of housing units owned", example = "0")
    private Integer housingOwned;

    @Size(max = 500, message = "Location preferences must be less than 500 characters")
    @Schema(description = "Comma-separated list of preferred locations", example = "서울,경기,인천")
    private String locationPreferences;
}