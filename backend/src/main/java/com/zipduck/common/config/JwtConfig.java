package com.zipduck.common.config;

import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * JWT Configuration
 * - JWT Secret Key 관리
 * - Token Validity 설정
 */
@Configuration
@Getter
public class JwtConfig {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.access-token-validity}")
    private Long accessTokenValidity;

    @Value("${app.jwt.refresh-token-validity}")
    private Long refreshTokenValidity;

    /**
     * Get SecretKey for JWT signing
     * HMAC-SHA256 requires at least 256-bit key
     */
    public SecretKey getSecretKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
