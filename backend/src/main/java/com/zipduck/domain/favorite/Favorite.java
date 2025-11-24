package com.zipduck.domain.favorite;

import com.zipduck.domain.BaseEntity;
import com.zipduck.domain.subscription.Subscription;
import com.zipduck.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * Favorite entity representing user's saved/favorited subscriptions
 * T096: Favorite entity for favorites management
 * FR-009: Allow users to save subscriptions to favorites
 */
@Entity
@Table(
        name = "favorites",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "subscription_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Favorite extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id", nullable = false)
    private Subscription subscription;

    @Column(length = 500)
    private String note; // Optional note about why user favorited this subscription

    /**
     * Create a new favorite
     */
    public static Favorite of(User user, Subscription subscription) {
        return Favorite.builder()
                .user(user)
                .subscription(subscription)
                .build();
    }

    /**
     * Add a note to the favorite
     */
    public void updateNote(String note) {
        this.note = note;
    }
}
