package com.zipduck.user.application;

import com.zipduck.user.domain.OAuthAccount;
import com.zipduck.user.domain.User;
import com.zipduck.user.domain.repository.OAuthAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * OAuth2 Service
 * - Google, Kakao OAuth2 로그인 처리
 * - OAuth 계정 연동
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2Service extends DefaultOAuth2UserService {

    private final UserService userService;
    private final OAuthAccountRepository oAuthAccountRepository;

    /**
     * Load OAuth2 user and create/link account
     */
    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuthAccount.OAuthProvider provider = parseProvider(registrationId);

        // Extract user info based on provider
        OAuthUserInfo userInfo = extractUserInfo(provider, oAuth2User.getAttributes());

        // Find or create user
        User user = findOrCreateUser(provider, userInfo);

        log.info("OAuth2 user loaded: userId={}, provider={}, email={}",
            user.getId(), provider, user.getEmail());

        return oAuth2User;
    }

    /**
     * Find or create user from OAuth info
     */
    @Transactional
    public User findOrCreateUser(OAuthAccount.OAuthProvider provider, OAuthUserInfo userInfo) {
        // Check if OAuth account already exists
        return oAuthAccountRepository
            .findByProviderAndProviderId(provider, userInfo.providerId())
            .map(oAuthAccount -> userService.findById(oAuthAccount.getUserId()))
            .orElseGet(() -> {
                // Check if email already exists
                if (userService.existsByEmail(userInfo.email())) {
                    // Link existing user
                    User existingUser = userService.findByEmail(userInfo.email());
                    linkOAuthAccount(existingUser.getId(), provider, userInfo.providerId());
                    log.info("Linked OAuth account to existing user: userId={}, provider={}",
                        existingUser.getId(), provider);
                    return existingUser;
                } else {
                    // Create new user
                    User newUser = userService.createUser(
                        userInfo.email(),
                        null, // OAuth users don't have password
                        userInfo.name()
                    );

                    if (userInfo.profileImage() != null) {
                        newUser.setProfileImage(userInfo.profileImage());
                    }

                    // Link OAuth account
                    linkOAuthAccount(newUser.getId(), provider, userInfo.providerId());
                    log.info("Created new user from OAuth: userId={}, provider={}",
                        newUser.getId(), provider);
                    return newUser;
                }
            });
    }

    /**
     * Link OAuth account to user
     */
    @Transactional
    public void linkOAuthAccount(Long userId, OAuthAccount.OAuthProvider provider, String providerId) {
        OAuthAccount oAuthAccount = OAuthAccount.builder()
            .userId(userId)
            .provider(provider)
            .providerId(providerId)
            .build();

        oAuthAccountRepository.save(oAuthAccount);
        log.info("OAuth account linked: userId={}, provider={}, providerId={}",
            userId, provider, providerId);
    }

    /**
     * Unlink OAuth account
     */
    @Transactional
    public void unlinkOAuthAccount(Long userId, OAuthAccount.OAuthProvider provider) {
        oAuthAccountRepository.deleteByUserIdAndProvider(userId, provider);
        log.info("OAuth account unlinked: userId={}, provider={}", userId, provider);
    }

    /**
     * Extract user info from OAuth2 attributes
     */
    private OAuthUserInfo extractUserInfo(OAuthAccount.OAuthProvider provider, Map<String, Object> attributes) {
        return switch (provider) {
            case GOOGLE -> extractGoogleUserInfo(attributes);
            case KAKAO -> extractKakaoUserInfo(attributes);
        };
    }

    /**
     * Extract Google user info
     */
    private OAuthUserInfo extractGoogleUserInfo(Map<String, Object> attributes) {
        String providerId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String profileImage = (String) attributes.get("picture");

        return new OAuthUserInfo(providerId, email, name, profileImage);
    }

    /**
     * Extract Kakao user info
     */
    @SuppressWarnings("unchecked")
    private OAuthUserInfo extractKakaoUserInfo(Map<String, Object> attributes) {
        String providerId = String.valueOf(attributes.get("id"));

        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        String email = (String) kakaoAccount.get("email");

        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        String name = (String) profile.get("nickname");
        String profileImage = (String) profile.get("profile_image_url");

        return new OAuthUserInfo(providerId, email, name, profileImage);
    }

    /**
     * Parse OAuth provider from registration ID
     */
    private OAuthAccount.OAuthProvider parseProvider(String registrationId) {
        return switch (registrationId.toLowerCase()) {
            case "google" -> OAuthAccount.OAuthProvider.GOOGLE;
            case "kakao" -> OAuthAccount.OAuthProvider.KAKAO;
            default -> throw new IllegalArgumentException("Unsupported OAuth provider: " + registrationId);
        };
    }

    /**
     * OAuth User Info record
     */
    public record OAuthUserInfo(
        String providerId,
        String email,
        String name,
        String profileImage
    ) {}
}
