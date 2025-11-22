package com.zipduck.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standard error response DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "에러 응답")
public class ErrorResponse {

    @Schema(description = "에러 코드", example = "INVALID_INPUT")
    private String code;

    @Schema(description = "에러 메시지", example = "나이는 19세 이상이어야 합니다.")
    private String message;

    @Schema(description = "타임스탬프", example = "2025-11-21T15:30:00")
    private LocalDateTime timestamp;

    @Schema(description = "상세 정보", example = "{\"age\": \"must be greater than or equal to 19\"}")
    private Map<String, String> details;
}