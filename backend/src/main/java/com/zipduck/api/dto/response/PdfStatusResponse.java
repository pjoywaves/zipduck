package com.zipduck.api.dto.response;

import com.zipduck.domain.pdf.PdfDocument;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for PDF processing status
 * T072: PdfStatusResponse
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "PDF processing status")
public class PdfStatusResponse {

    @Schema(description = "PDF document ID", example = "1")
    private Long pdfId;

    @Schema(description = "File name", example = "청약공고.pdf")
    private String fileName;

    @Schema(description = "Processing status", example = "PROCESSING")
    private String status;

    @Schema(description = "Error message if failed")
    private String errorMessage;

    @Schema(description = "Upload timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Last updated timestamp")
    private LocalDateTime updatedAt;

    public static PdfStatusResponse from(PdfDocument pdfDocument) {
        return PdfStatusResponse.builder()
                .pdfId(pdfDocument.getId())
                .fileName(pdfDocument.getFileName())
                .status(pdfDocument.getStatus().name())
                .errorMessage(pdfDocument.getErrorMessage())
                .createdAt(pdfDocument.getCreatedAt())
                .updatedAt(pdfDocument.getUpdatedAt())
                .build();
    }
}