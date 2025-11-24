package com.zipduck.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for list of favorites
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteListResponse {

    private List<FavoriteDto> favorites;
    private Integer totalCount;

    public static FavoriteListResponse of(List<FavoriteDto> favorites) {
        return FavoriteListResponse.builder()
                .favorites(favorites)
                .totalCount(favorites.size())
                .build();
    }
}
