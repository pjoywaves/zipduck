package com.zipduck.domain.user;

import com.zipduck.domain.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * User entity representing a ZipDuck user
 * Simple authentication entity - detailed profile stored in UserProfile
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // BCrypt encoded

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private UserProfile profile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    public enum UserStatus {
        ACTIVE,
        INACTIVE,
        SUSPENDED
    }

    public void updateProfile(UserProfile profile) {
        this.profile = profile;
        profile.setUser(this);
    }
}
