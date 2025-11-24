package com.zipduck.domain.eligibility;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Details about eligibility criteria matching
 * FR-007: Detailed eligibility breakdown
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EligibilityDetails {

    private Boolean ageEligible;
    private Boolean incomeEligible;
    private Boolean householdEligible;
    private Boolean housingOwnedEligible;
    private Boolean overallEligible;
    private Integer matchScore; // 0-100
}