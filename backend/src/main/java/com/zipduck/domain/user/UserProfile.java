package com.zipduck.domain.user;

import com.zipduck.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * UserProfile entity representing user's personal eligibility information
 * FR-001: age, income, household members, housing ownership, location preferences
 */
@Entity
@Table(name = "user_profiles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private Long annualIncome; // in KRW

    @Column(nullable = false)
    private Integer householdMembers;

    @Column(nullable = false)
    private Integer housingOwned;

    @Column(length = 500)
    private String locationPreferences; // Comma-separated list of preferred locations

    @Column(nullable = false)
    @Builder.Default
    private Boolean notificationsEnabled = false;

    public void setUser(User user) {
        this.user = user;
    }

    /**
     * Update profile fields
     * FR-014: Allow profile updates
     */
    public void update(Integer age, Long annualIncome, Integer householdMembers,
                      Integer housingOwned, String locationPreferences) {
        this.age = age;
        this.annualIncome = annualIncome;
        this.householdMembers = householdMembers;
        this.housingOwned = housingOwned;
        this.locationPreferences = locationPreferences;
    }

    public void updateNotificationSettings(Boolean enabled) {
        this.notificationsEnabled = enabled;
    }
}