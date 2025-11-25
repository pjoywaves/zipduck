package com.zipduck.user.domain.repository;

import com.zipduck.user.domain.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * RefreshToken Repository (Redis)
 * Refresh Token을 Redis에서 관리
 */
@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {

    /**
     * Find refresh token by token string
     */
    Optional<RefreshToken> findByToken(String token);

    /**
     * Find all refresh tokens by user ID
     */
    Iterable<RefreshToken> findByUserId(Long userId);

    /**
     * Delete all refresh tokens by user ID
     * 로그아웃 시 사용
     */
    void deleteByUserId(Long userId);

    /**
     * Check if token exists and is not revoked
     */
    default boolean existsByTokenAndRevokedFalse(String token) {
        return findByToken(token)
            .map(rt -> !rt.isRevoked())
            .orElse(false);
    }
}
