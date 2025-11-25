package com.zipduck.user.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.time.LocalDateTime;

/**
 * RefreshToken Entity (Redis)
 * Redis에 저장되는 Refresh Token
 * TTL: 7일 (604800초)
 */
@RedisHash(value = "refresh_token", timeToLive = 604800)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    private String token;

    @Indexed
    private Long userId;

    private LocalDateTime issuedAt;

    private LocalDateTime expiresAt;

    private boolean revoked;
}
