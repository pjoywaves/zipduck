package com.zipduck.api.dto.response;

import com.zipduck.domain.pdf.PdfDocument;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for PDF upload
 * T071: PdfUploadResponse
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "PDF upload response")
public class PdfUploadResponse {

    @Schema(description = "PDF document ID", example = "1")
    private Long pdfId;

    @Schema(description = "Original file name", example = "청약공고.pdf")
    private String fileName;

    @Schema(description = "Processing status", example = "PENDING")
    private String status;

    @Schema(description = "File size in bytes", example = "1024000")
    private Long fileSize;

    @Schema(description = "Cache key (for duplicate detection)", example = "a1b2c3...")
    private String cacheKey;

    public static PdfUploadResponse from(PdfDocument pdfDocument) {
        return PdfUploadResponse.builder()
                .pdfId(pdfDocument.getId())
                .fileName(pdfDocument.getFileName())
                .status(pdfDocument.getStatus().name())
                .fileSize(pdfDocument.getFileSize())
                .cacheKey(pdfDocument.getCacheKey())
                .build();
    }
}