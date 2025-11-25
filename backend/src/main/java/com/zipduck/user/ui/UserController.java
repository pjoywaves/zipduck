package com.zipduck.user.ui;

import com.zipduck.user.application.UserService;
import com.zipduck.user.domain.User;
import com.zipduck.user.dto.UserProfileDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * User Controller
 * - GET /api/v1/users/me - 내 프로필 조회
 * - PATCH /api/v1/users/me - 내 프로필 수정
 * - DELETE /api/v1/users/me - 계정 비활성화
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Get my profile
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Get profile request: userId={}", userId);

        User user = userService.findById(userId);
        UserProfileDto profile = UserProfileDto.from(user);

        return ResponseEntity.ok(profile);
    }

    /**
     * Update my profile
     */
    @PatchMapping("/me")
    public ResponseEntity<UserProfileDto> updateMyProfile(
        Authentication authentication,
        @Valid @RequestBody UpdateProfileRequest request
    ) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Update profile request: userId={}", userId);

        User user = userService.updateProfile(userId, request.name(), request.profileImage());
        UserProfileDto profile = UserProfileDto.from(user);

        return ResponseEntity.ok(profile);
    }

    /**
     * Deactivate my account
     */
    @DeleteMapping("/me")
    public ResponseEntity<Void> deactivateMyAccount(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        log.info("Deactivate account request: userId={}", userId);

        userService.deactivateAccount(userId);

        return ResponseEntity.noContent().build();
    }

    /**
     * Update Profile Request DTO
     */
    public record UpdateProfileRequest(
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @Size(max = 500, message = "Profile image URL must not exceed 500 characters")
        String profileImage
    ) {}
}
