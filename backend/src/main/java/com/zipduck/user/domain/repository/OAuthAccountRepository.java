package com.zipduck.user.domain.repository;

import com.zipduck.user.domain.OAuthAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * OAuth Account Repository
 */
@Repository
public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, Long> {

    /**
     * Find OAuth account by provider and provider ID
     */
    Optional<OAuthAccount> findByProviderAndProviderId(
        OAuthAccount.OAuthProvider provider,
        String providerId
    );

    /**
     * Find all OAuth accounts by user ID
     */
    List<OAuthAccount> findByUserId(Long userId);

    /**
     * Check if OAuth account exists
     */
    boolean existsByProviderAndProviderId(
        OAuthAccount.OAuthProvider provider,
        String providerId
    );

    /**
     * Delete OAuth account by user ID and provider
     */
    void deleteByUserIdAndProvider(Long userId, OAuthAccount.OAuthProvider provider);
}
