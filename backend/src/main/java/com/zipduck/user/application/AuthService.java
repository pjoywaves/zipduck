package com.zipduck.user.application;

import com.zipduck.user.domain.RefreshToken;
import com.zipduck.user.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Auth Service
 * - 회원가입
 * - 로그인
 * - 로그아웃
 * - 토큰 갱신
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final TokenService tokenService;

    /**
     * Sign up new user
     */
    @Transactional
    public SignupResult signup(String email, String password, String name) {
        // Create user
        User user = userService.createUser(email, password, name);

        // Generate tokens
        String accessToken = tokenService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = tokenService.generateRefreshToken(user.getId());

        log.info("User signed up successfully: id={}, email={}", user.getId(), user.getEmail());

        return new SignupResult(user, accessToken, refreshToken);
    }

    /**
     * Login
     */
    @Transactional
    public LoginResult login(String email, String password) {
        // Find active user
        User user = userService.findActiveUserByEmail(email);

        // Verify password
        if (!userService.verifyPassword(user, password)) {
            log.warn("Invalid password for user: {}", email);
            throw new RuntimeException("Invalid credentials");
        }

        // Generate tokens
        String accessToken = tokenService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = tokenService.generateRefreshToken(user.getId());

        log.info("User logged in successfully: id={}, email={}", user.getId(), user.getEmail());

        return new LoginResult(user, accessToken, refreshToken);
    }

    /**
     * Logout
     */
    @Transactional
    public void logout(String refreshToken) {
        tokenService.revokeRefreshToken(refreshToken);
        log.info("User logged out successfully");
    }

    /**
     * Logout all sessions
     */
    @Transactional
    public void logoutAll(Long userId) {
        tokenService.revokeAllRefreshTokens(userId);
        log.info("User logged out from all sessions: userId={}", userId);
    }

    /**
     * Refresh access token
     */
    @Transactional
    public RefreshResult refresh(String refreshToken) {
        // Validate refresh token
        RefreshToken validatedToken = tokenService.validateRefreshToken(refreshToken);

        // Get user
        User user = userService.findById(validatedToken.getUserId());

        // Check if user is active
        if (user.getAccountStatus() != User.AccountStatus.ACTIVE) {
            log.warn("Inactive user attempted token refresh: userId={}", user.getId());
            throw new RuntimeException("User account is not active");
        }

        // Generate new access token
        String newAccessToken = tokenService.generateAccessToken(user.getId(), user.getEmail());

        log.info("Access token refreshed for user: userId={}", user.getId());

        return new RefreshResult(newAccessToken);
    }

    /**
     * Signup Result
     */
    public record SignupResult(User user, String accessToken, String refreshToken) {}

    /**
     * Login Result
     */
    public record LoginResult(User user, String accessToken, String refreshToken) {}

    /**
     * Refresh Result
     */
    public record RefreshResult(String accessToken) {}
}
