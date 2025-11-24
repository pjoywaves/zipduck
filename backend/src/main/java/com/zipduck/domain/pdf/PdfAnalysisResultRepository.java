package com.zipduck.domain.pdf;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for PdfAnalysisResult entity
 */
@Repository
public interface PdfAnalysisResultRepository extends JpaRepository<PdfAnalysisResult, Long> {

    /**
     * Find analysis result by PDF document ID
     */
    Optional<PdfAnalysisResult> findByPdfDocumentId(Long pdfDocumentId);

    /**
     * Check if analysis result exists for PDF document
     */
    boolean existsByPdfDocumentId(Long pdfDocumentId);
}