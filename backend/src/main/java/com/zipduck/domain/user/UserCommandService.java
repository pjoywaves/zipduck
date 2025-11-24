package com.zipduck.domain.user;

import com.zipduck.api.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for User write operations
 */
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
     */
    public UserProfile createOrUpdateProfile(Long id, Integer age, Long annualIncome,
                                            Integer householdMembers, Integer housingOwned,
                                            String locationPreferences) {
        User user = userRepository.findByIdWithProfile(id)
                .orElseThrow(() -> new BusinessException("USER_NOT_FOUND", "User not found with id: " + id));

        if (user.getProfile() == null) {
            // Create new profile
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
            return profile;
        } else {
            // Update existing profile
            user.getProfile().update(age, annualIncome, householdMembers, housingOwned, locationPreferences);
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