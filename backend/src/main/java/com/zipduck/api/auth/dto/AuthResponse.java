package com.zipduck.api.auth.dto;

import com.zipduck.domain.user.AuthProvider;
import com.zipduck.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 인증 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String tokenType;
    private Integer expiresIn;
    private UserInfo user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String email;
        private String username;
        private AuthProvider provider;
        private User.UserStatus status;
    }

    /**
     * Service AuthResponse를 API AuthResponse로 변환
     */
    public static AuthResponse from(com.zipduck.domain.auth.AuthenticationService.AuthResponse serviceResponse) {
        return AuthResponse.builder()
                .accessToken(serviceResponse.getAccessToken())
                .tokenType(serviceResponse.getTokenType())
                .expiresIn(serviceResponse.getExpiresIn())
                .user(UserInfo.builder()
                        .id(serviceResponse.getUserId())
                        .email(serviceResponse.getEmail())
                        .username(serviceResponse.getUsername())
                        .provider(serviceResponse.getProvider())
                        .status(serviceResponse.getStatus())
                        .build())
                .build();
    }
}
