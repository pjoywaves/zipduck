package com.zipduck.user.dto;

import com.zipduck.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * User Profile DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {

    private Long id;
    private String email;
    private String name;
    private String profileImage;
    private String accountStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Convert User entity to DTO
     */
    public static UserProfileDto from(User user) {
        return UserProfileDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .name(user.getName())
            .profileImage(user.getProfileImage())
            .accountStatus(user.getAccountStatus().name())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}
