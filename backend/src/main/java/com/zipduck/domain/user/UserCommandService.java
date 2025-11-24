package com.zipduck.domain.user;

import com.zipduck.api.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for User write operations
 * T092: Enhanced with profile persistence and automatic recommendation refresh
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserCommandService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Create new user
     */
    public User createUser(String username, String email, String password) {
        // Check for duplicates
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("EMAIL_EXISTS", "Email already exists: " + email);
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .status(User.UserStatus.ACTIVE)
                .build();

        return userRepository.save(user);
    }

    /**
     * Create or update user profile
     * FR-001, FR-014
     * T092: Profile persistence with automatic recommendation refresh
     *
     * When profile is updated, recommendations are automatically refreshed on next query
     * since eligibility calculation is performed in real-time based on current profile data
     */
    public UserProfile createOrUpdateProfile(Long id, Integer age, Long annualIncome,
                                            Integer householdMembers, Integer housingOwned,
                                            String locationPreferences) {
        User user = userRepository.findByIdWithProfile(id)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found with id: " + id));

        boolean isNewProfile = (user.getProfile() == null);

        if (isNewProfile) {
            // Create new profile
            log.info("Creating new profile for user id: {}", id);
            UserProfile profile = UserProfile.builder()
                    .user(user)
                    .age(age)
                    .annualIncome(annualIncome)
                    .householdMembers(householdMembers)
                    .housingOwned(housingOwned)
                    .locationPreferences(locationPreferences)
                    .build();
            user.updateProfile(profile);
            userRepository.save(user);
            log.info("Profile created successfully for user id: {} - Age: {}, Income: {}, Household: {}, Housing: {}",
                    id, age, annualIncome, householdMembers, housingOwned);
            return profile;
        } else {
            // Update existing profile
            log.info("Updating existing profile for user id: {}", id);
            UserProfile oldProfile = user.getProfile();
            log.debug("Old profile values - Age: {}, Income: {}, Household: {}, Housing: {}",
                    oldProfile.getAge(), oldProfile.getAnnualIncome(),
                    oldProfile.getHouseholdMembers(), oldProfile.getHousingOwned());

            user.getProfile().update(age, annualIncome, householdMembers, housingOwned, locationPreferences);

            log.info("Profile updated successfully for user id: {} - Age: {}, Income: {}, Household: {}, Housing: {}",
                    id, age, annualIncome, householdMembers, housingOwned);
            log.debug("Profile changes will trigger automatic recommendation refresh on next query");

            return user.getProfile();
        }
    }

    /**
     * Update notification settings
     * FR-015
     */
    public void updateNotificationSettings(Long id, Boolean enabled) {
        User user = userRepository.findByIdWithProfile(id)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found with id: " + id));

        if (user.getProfile() == null) {
            throw new BusinessException("PROFILE_NOT_FOUND", "User profile not found for user id: " + id);
        }

        user.getProfile().updateNotificationSettings(enabled);
    }
}