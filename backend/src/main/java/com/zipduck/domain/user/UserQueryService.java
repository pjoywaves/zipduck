package com.zipduck.domain.user;

import com.zipduck.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for User read operations
 */
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
     * Get user by userId
     */
    public User getByUserId(String userId) {
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userId: " + userId));
    }

    /**
     * Get user with profile by ID
     */
    public User getByIdWithProfile(Long id) {
        return userRepository.findByIdWithProfile(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Get user with profile by userId
     */
    public User getByUserIdWithProfile(String userId) {
        return userRepository.findByUserIdWithProfile(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with userId: " + userId));
    }

    /**
     * Check if userId exists
     */
    public boolean existsByUserId(String userId) {
        return userRepository.existsByUserId(userId);
    }

    /**
     * Check if email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}