package com.zipduck.api.controller;

import com.zipduck.api.dto.request.AddFavoriteRequest;
import com.zipduck.api.dto.response.ApiResponse;
import com.zipduck.api.dto.response.FavoriteDto;
import com.zipduck.api.dto.response.FavoriteListResponse;
import com.zipduck.domain.favorite.Favorite;
import com.zipduck.domain.favorite.FavoriteCommandService;
import com.zipduck.domain.favorite.FavoriteQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for favorites management
 * T099: FavoriteController implementation
 * FR-009: Allow users to save subscriptions to favorites
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "Favorites management APIs")
public class FavoriteController {

    private final FavoriteCommandService favoriteCommandService;
    private final FavoriteQueryService favoriteQueryService;

    /**
     * Add subscription to favorites
     * FR-009: Save subscription to favorites
     */
    @PostMapping
    @Operation(
            summary = "Add subscription to favorites",
            description = "Add a housing subscription to user's favorites list"
    )
    public ResponseEntity<ApiResponse<FavoriteDto>> addFavorite(
            @Valid @RequestBody AddFavoriteRequest request) {

        log.info("Add favorite request - User: {}, Subscription: {}",
                request.getUserId(), request.getSubscriptionId());

        Favorite favorite = favoriteCommandService.addFavorite(
                request.getUserId(),
                request.getSubscriptionId(),
                request.getNote()
        );

        FavoriteDto dto = FavoriteDto.from(favorite);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(dto));
    }

    /**
     * Get all favorites for a user
     * FR-009: Retrieve user's favorites
     */
    @GetMapping
    @Operation(
            summary = "Get user's favorites",
            description = "Retrieve all favorited subscriptions for a user"
    )
    public ResponseEntity<ApiResponse<FavoriteListResponse>> getFavorites(
            @Parameter(description = "User ID", required = true)
            @RequestParam Long userId) {

        log.debug("Get favorites request for user: {}", userId);

        List<Favorite> favorites = favoriteQueryService.getFavoritesByUserId(userId);
        List<FavoriteDto> dtos = favorites.stream()
                .map(FavoriteDto::from)
                .collect(Collectors.toList());

        FavoriteListResponse response = FavoriteListResponse.of(dtos);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Remove subscription from favorites
     * FR-009: Remove from favorites
     */
    @DeleteMapping
    @Operation(
            summary = "Remove subscription from favorites",
            description = "Remove a subscription from user's favorites list"
    )
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @Parameter(description = "User ID", required = true)
            @RequestParam Long userId,
            @Parameter(description = "Subscription ID", required = true)
            @RequestParam Long subscriptionId) {

        log.info("Remove favorite request - User: {}, Subscription: {}", userId, subscriptionId);

        favoriteCommandService.removeFavorite(userId, subscriptionId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    /**
     * Check if subscription is favorited
     */
    @GetMapping("/check")
    @Operation(
            summary = "Check if subscription is favorited",
            description = "Check if a subscription is in user's favorites"
    )
    public ResponseEntity<ApiResponse<Boolean>> isFavorited(
            @RequestParam Long userId,
            @RequestParam Long subscriptionId) {

        log.debug("Check favorite - User: {}, Subscription: {}", userId, subscriptionId);

        boolean isFavorited = favoriteQueryService.isFavorited(userId, subscriptionId);
        return ResponseEntity.ok(ApiResponse.success(isFavorited));
    }

    /**
     * Update favorite note
     */
    @PatchMapping("/note")
    @Operation(
            summary = "Update favorite note",
            description = "Update the note for a favorited subscription"
    )
    public ResponseEntity<ApiResponse<FavoriteDto>> updateNote(
            @RequestParam Long userId,
            @RequestParam Long subscriptionId,
            @RequestParam String note) {

        log.debug("Update favorite note - User: {}, Subscription: {}", userId, subscriptionId);

        Favorite favorite = favoriteCommandService.updateNote(userId, subscriptionId, note);
        FavoriteDto dto = FavoriteDto.from(favorite);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /**
     * Get favorites count for a user
     */
    @GetMapping("/count")
    @Operation(
            summary = "Get favorites count",
            description = "Get the total number of favorites for a user"
    )
    public ResponseEntity<ApiResponse<Long>> getFavoritesCount(
            @RequestParam Long userId) {

        log.debug("Get favorites count for user: {}", userId);

        long count = favoriteQueryService.countByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(count));
    }
}
