package com.zipduck.api.auth;

import com.zipduck.api.auth.dto.AuthResponse;
import com.zipduck.api.auth.dto.LoginRequest;
import com.zipduck.api.auth.dto.SignupRequest;
import com.zipduck.domain.auth.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 API Controller
 * 회원가입, 로그인, 로그아웃 엔드포인트
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    private static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
    private static final int REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7일

    /**
     * 회원가입
     * POST /api/v1/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request,
            HttpServletResponse response
    ) {
        log.info("Signup request for email: {}", request.getEmail());

        AuthenticationService.AuthResponse serviceResponse = authenticationService.signup(
                request.getEmail(),
                request.getPassword(),
                request.getUsername()
        );

        // Refresh Token을 HttpOnly 쿠키로 설정
        setRefreshTokenCookie(response, serviceResponse.getRefreshToken());

        // API 응답 (Access Token만 포함)
        AuthResponse apiResponse = AuthResponse.from(serviceResponse);

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    /**
     * 로그인
     * POST /api/v1/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        log.info("Login request for email: {}", request.getEmail());

        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthenticationService.AuthResponse serviceResponse = authenticationService.login(
                request.getEmail(),
                request.getPassword(),
                ipAddress,
                userAgent
        );

        // Refresh Token을 HttpOnly 쿠키로 설정
        setRefreshTokenCookie(response, serviceResponse.getRefreshToken());

        // API 응답 (Access Token만 포함)
        AuthResponse apiResponse = AuthResponse.from(serviceResponse);

        return ResponseEntity.ok(apiResponse);
    }

    /**
     * Refresh Token을 HttpOnly 쿠키로 설정
     */
    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS에서만 전송
        cookie.setPath("/");
        cookie.setMaxAge(REFRESH_TOKEN_MAX_AGE);
        // cookie.setSameSite("Strict"); // Spring Boot 3.x에서는 별도 설정 필요
        response.addCookie(cookie);
    }

    /**
     * 클라이언트 IP 추출
     */
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
