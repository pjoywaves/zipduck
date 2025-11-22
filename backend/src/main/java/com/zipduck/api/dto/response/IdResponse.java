package com.zipduck.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * ID 응답 DTO
 * 생성된 엔티티의 ID만 반환할 때 사용합니다
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "ID 응답")
public class IdResponse {

    @Schema(description = "생성된 리소스 ID", example = "123")
    private Long id;

    public static IdResponse of(Long id) {
        return new IdResponse(id);
    }
}