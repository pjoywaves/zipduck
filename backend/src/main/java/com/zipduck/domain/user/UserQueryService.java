package com.zipduck.domain.user;

import com.zipduck.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for User read operations
 * T093: Supports profile auto-loading on user login
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserQueryService {

    private final UserRepository userRepository;

    /**
     * Get user by ID
     */
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Get user with profile by ID
     * T093: Auto-loads user profile on login for quick access to recommendations
     *
     * This method is used when user logs in to automatically load their saved profile,
     * enabling instant access to updated recommendations without re-entering information.
     * FR-014: Saved profiles for returning users
     */
    public User getByIdWithProfile(Long id) {
        log.debug("Loading user with profile for id: {}", id);
        User user = userRepository.findByIdWithProfile(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getProfile() != null) {
            log.debug("Profile auto-loaded for user id: {} - Age: {}, Income: {}, Household: {}",
                    id, user.getProfile().getAge(), user.getProfile().getAnnualIncome(),
                    user.getProfile().getHouseholdMembers());
        } else {
            log.debug("No profile found for user id: {}", id);
        }

        return user;
    }

    /**
     * Check if email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}