package com.zipduck.user.application;

import com.zipduck.user.domain.User;
import com.zipduck.user.domain.repository.UserRepository;
import com.zipduck.common.exception.BadRequestException;
import com.zipduck.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * User Service
 * - 사용자 계정 관리
 * - 프로필 조회/수정
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Create new user
     */
    @Transactional
    public User createUser(String email, String password, String name) {
        if (userRepository.existsByEmail(email)) {
            log.warn("Email already exists: {}", email);
            throw new BadRequestException("Email already exists");
        }

        String encodedPassword = password != null ? passwordEncoder.encode(password) : null;

        User user = User.builder()
            .email(email)
            .password(encodedPassword)
            .name(name)
            .accountStatus(User.AccountStatus.ACTIVE)
            .build();

        User savedUser = userRepository.save(user);
        log.info("Created user: id={}, email={}", savedUser.getId(), savedUser.getEmail());

        return savedUser;
    }

    /**
     * Find user by ID
     */
    public User findById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    /**
     * Find active user by email
     */
    public User findActiveUserByEmail(String email) {
        return userRepository.findByEmailAndAccountStatus(email, User.AccountStatus.ACTIVE)
            .orElseThrow(() -> new RuntimeException("Active user not found"));
    }

    /**
     * Find user by email (any status)
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Verify password
     */
    public boolean verifyPassword(User user, String rawPassword) {
        if (user.getPassword() == null) {
            log.warn("User has no password (OAuth-only): {}", user.getEmail());
            return false;
        }
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    /**
     * Update user profile
     */
    @Transactional
    public User updateProfile(Long userId, String name, String profileImage) {
        User user = findById(userId);

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }

        if (profileImage != null) {
            user.setProfileImage(profileImage);
        }

        User updatedUser = userRepository.save(user);
        log.info("Updated user profile: id={}", userId);

        return updatedUser;
    }

    /**
     * Check if email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Deactivate user account
     */
    @Transactional
    public void deactivateAccount(Long userId) {
        User user = findById(userId);
        user.setAccountStatus(User.AccountStatus.INACTIVE);
        userRepository.save(user);
        log.info("Deactivated user account: id={}", userId);
    }

    /**
     * Reactivate user account
     */
    @Transactional
    public void reactivateAccount(Long userId) {
        User user = findById(userId);
        user.setAccountStatus(User.AccountStatus.ACTIVE);
        userRepository.save(user);
        log.info("Reactivated user account: id={}", userId);
    }

    /**
     * Suspend user account
     */
    @Transactional
    public void suspendAccount(Long userId) {
        User user = findById(userId);
        user.setAccountStatus(User.AccountStatus.SUSPENDED);
        userRepository.save(user);
        log.info("Suspended user account: id={}", userId);
    }
}
