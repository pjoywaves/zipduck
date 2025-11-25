package com.zipduck.user.application;

import com.zipduck.common.config.JwtConfig;
import com.zipduck.user.domain.RefreshToken;
import com.zipduck.user.domain.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;

/**
 * Token Service
 * - JWT Access Token 생성/검증
 * - Refresh Token 생성/검증/관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenService {

    private final JwtConfig jwtConfig;
    private final RefreshTokenRepository refreshTokenRepository;

    /**
     * Generate Access Token
     */
    public String generateAccessToken(Long userId, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtConfig.getAccessTokenValidity());

        return Jwts.builder()
            .subject(String.valueOf(userId))
            .claim("email", email)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(jwtConfig.getSecretKey())
            .compact();
    }

    /**
     * Generate Refresh Token
     */
    @Transactional
    public String generateRefreshToken(Long userId) {
        String tokenValue = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusSeconds(jwtConfig.getRefreshTokenValidity() / 1000);

        RefreshToken refreshToken = RefreshToken.builder()
            .token(tokenValue)
            .userId(userId)
            .issuedAt(now)
            .expiresAt(expiresAt)
            .revoked(false)
            .build();

        refreshTokenRepository.save(refreshToken);
        log.info("Generated refresh token for user: {}", userId);

        return tokenValue;
    }

    /**
     * Validate Access Token and extract user ID
     */
    public Long validateAccessToken(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

            return Long.parseLong(claims.getSubject());
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
            throw new RuntimeException("Token expired");
        } catch (MalformedJwtException | SignatureException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            throw new RuntimeException("Invalid token");
        } catch (Exception e) {
            log.error("JWT validation error: {}", e.getMessage());
            throw new RuntimeException("Token validation failed");
        }
    }

    /**
     * Validate Refresh Token
     */
    public RefreshToken validateRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
            .orElseThrow(() -> new RuntimeException("Refresh token not found"));

        if (refreshToken.isRevoked()) {
            log.warn("Revoked refresh token used: {}", token);
            throw new RuntimeException("Token revoked");
        }

        if (refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            log.warn("Expired refresh token used: {}", token);
            throw new RuntimeException("Token expired");
        }

        return refreshToken;
    }

    /**
     * Revoke Refresh Token
     */
    @Transactional
    public void revokeRefreshToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
            log.info("Revoked refresh token: {}", token);
        });
    }

    /**
     * Revoke all Refresh Tokens for user
     */
    @Transactional
    public void revokeAllRefreshTokens(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
        log.info("Revoked all refresh tokens for user: {}", userId);
    }

    /**
     * Extract user ID from Access Token (without validation)
     */
    public Long extractUserId(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

            return Long.parseLong(claims.getSubject());
        } catch (Exception e) {
            log.error("Failed to extract user ID from token: {}", e.getMessage());
            return null;
        }
    }
}
