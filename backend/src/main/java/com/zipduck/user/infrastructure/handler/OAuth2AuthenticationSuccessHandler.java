package com.zipduck.user.infrastructure.handler;

import com.zipduck.user.application.OAuth2Service;
import com.zipduck.user.application.TokenService;
import com.zipduck.user.domain.OAuthAccount;
import com.zipduck.user.domain.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

/**
 * OAuth2 Authentication Success Handler
 * - OAuth2 로그인 성공 시 처리
 * - JWT 토큰 생성 후 프론트엔드로 리다이렉트
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2Service oAuth2Service;
    private final TokenService tokenService;

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/auth/callback}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException {

        OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = oauth2Token.getPrincipal();

        String registrationId = oauth2Token.getAuthorizedClientRegistrationId();
        OAuthAccount.OAuthProvider provider = parseProvider(registrationId);

        // Extract user info
        OAuth2Service.OAuthUserInfo userInfo = extractUserInfo(provider, oauth2User.getAttributes());

        // Find or create user
        User user = oAuth2Service.findOrCreateUser(provider, userInfo);

        // Generate JWT tokens
        String accessToken = tokenService.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = tokenService.generateRefreshToken(user.getId());

        log.info("OAuth2 authentication success: userId={}, provider={}", user.getId(), provider);

        // Redirect to frontend with tokens
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
            .queryParam("accessToken", accessToken)
            .queryParam("refreshToken", refreshToken)
            .build()
            .toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    /**
     * Extract user info from OAuth2 attributes
     */
    private OAuth2Service.OAuthUserInfo extractUserInfo(
        OAuthAccount.OAuthProvider provider,
        Map<String, Object> attributes
    ) {
        return switch (provider) {
            case GOOGLE -> extractGoogleUserInfo(attributes);
            case KAKAO -> extractKakaoUserInfo(attributes);
        };
    }

    /**
     * Extract Google user info
     */
    private OAuth2Service.OAuthUserInfo extractGoogleUserInfo(Map<String, Object> attributes) {
        String providerId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String profileImage = (String) attributes.get("picture");

        return new OAuth2Service.OAuthUserInfo(providerId, email, name, profileImage);
    }

    /**
     * Extract Kakao user info
     */
    @SuppressWarnings("unchecked")
    private OAuth2Service.OAuthUserInfo extractKakaoUserInfo(Map<String, Object> attributes) {
        String providerId = String.valueOf(attributes.get("id"));

        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        String email = (String) kakaoAccount.get("email");

        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        String name = (String) profile.get("nickname");
        String profileImage = (String) profile.get("profile_image_url");

        return new OAuth2Service.OAuthUserInfo(providerId, email, name, profileImage);
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
}
