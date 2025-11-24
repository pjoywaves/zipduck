package com.zipduck.domain.pdf;

import com.zipduck.api.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for PdfDocument read operations
 * T059: PdfQueryService implementation
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PdfQueryService {

    private final PdfRepository pdfRepository;
    private final PdfAnalysisResultRepository pdfAnalysisResultRepository;

    /**
     * Get PDF document by ID
     */
    public PdfDocument getById(Long id) {
        return pdfRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PDF document not found with id: " + id));
    }

    /**
     * Get PDF document with analysis result
     * FR-022: Retrieve PDF status and analysis together
     */
    public PdfDocument getByIdWithAnalysis(Long id) {
        return pdfRepository.findByIdWithAnalysis(id)
                .orElseThrow(() -> new ResourceNotFoundException("PDF document not found with id: " + id));
    }

    /**
     * Get all PDF documents by user ID
     */
    public List<PdfDocument> getByUserId(Long userId) {
        return pdfRepository.findByUserId(userId);
    }

    /**
     * Get PDF document by cache key (duplicate detection)
     * FR-023: Check if PDF has been processed before
     */
    public PdfDocument findByCacheKey(String cacheKey) {
        return pdfRepository.findByCacheKey(cacheKey).orElse(null);
    }

    /**
     * Get analysis result by PDF document ID
     */
    public PdfAnalysisResult getAnalysisResultByPdfId(Long pdfDocumentId) {
        return pdfAnalysisResultRepository.findByPdfDocumentId(pdfDocumentId)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis result not found for PDF: " + pdfDocumentId));
    }

    /**
     * Check if analysis result exists
     */
    public boolean hasAnalysisResult(Long pdfDocumentId) {
        return pdfAnalysisResultRepository.existsByPdfDocumentId(pdfDocumentId);
    }

    /**
     * Count PDF documents by user
     */
    public Long countByUserId(Long userId) {
        return pdfRepository.countByUserId(userId);
    }

    /**
     * Get pending PDF documents (for processing queue)
     */
    public List<PdfDocument> getPendingDocuments() {
        return pdfRepository.findByStatus(PdfDocument.ProcessingStatus.PENDING);
    }
}