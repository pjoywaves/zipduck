package com.zipduck.user.ui;

import com.zipduck.common.config.JwtConfig;
import com.zipduck.user.application.AuthService;
import com.zipduck.user.dto.LoginRequest;
import com.zipduck.user.dto.SignupRequest;
import com.zipduck.user.dto.TokenResponse;
import com.zipduck.user.dto.UserProfileDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Auth Controller
 * - POST /api/v1/auth/signup - 회원가입
 * - POST /api/v1/auth/login - 로그인
 * - POST /api/v1/auth/logout - 로그아웃
 * - POST /api/v1/auth/refresh - 토큰 갱신
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtConfig jwtConfig;

    /**
     * Sign up
     */
    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request received: email={}", request.getEmail());

        AuthService.SignupResult result = authService.signup(
            request.getEmail(),
            request.getPassword(),
            request.getName()
        );

        TokenResponse tokens = TokenResponse.of(
            result.accessToken(),
            result.refreshToken(),
            jwtConfig.getAccessTokenValidity()
        );

        UserProfileDto userProfile = UserProfileDto.from(result.user());

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new SignupResponse(userProfile, tokens));
    }

    /**
     * Login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received: email={}", request.getEmail());

        AuthService.LoginResult result = authService.login(
            request.getEmail(),
            request.getPassword()
        );

        TokenResponse tokens = TokenResponse.of(
            result.accessToken(),
            result.refreshToken(),
            jwtConfig.getAccessTokenValidity()
        );

        UserProfileDto userProfile = UserProfileDto.from(result.user());

        return ResponseEntity.ok(new LoginResponse(userProfile, tokens));
    }

    /**
     * Logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Refresh-Token") String refreshToken) {
        log.info("Logout request received");

        authService.logout(refreshToken);

        return ResponseEntity.noContent().build();
    }

    /**
     * Refresh access token
     */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@RequestHeader("Refresh-Token") String refreshToken) {
        log.info("Token refresh request received");

        AuthService.RefreshResult result = authService.refresh(refreshToken);

        TokenResponse tokens = TokenResponse.of(
            result.accessToken(),
            null, // Don't return refresh token
            jwtConfig.getAccessTokenValidity()
        );

        return ResponseEntity.ok(new RefreshResponse(tokens));
    }

    /**
     * Response DTOs
     */
    public record SignupResponse(UserProfileDto user, TokenResponse tokens) {}
    public record LoginResponse(UserProfileDto user, TokenResponse tokens) {}
    public record RefreshResponse(TokenResponse tokens) {}
}
