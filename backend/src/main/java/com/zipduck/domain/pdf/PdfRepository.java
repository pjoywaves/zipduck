package com.zipduck.domain.pdf;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for PdfDocument entity
 * T058: PdfRepository interface
 */
@Repository
public interface PdfRepository extends JpaRepository<PdfDocument, Long> {

    /**
     * Find PDF document by cache key (for duplicate detection)
     * FR-023: Check if PDF has been processed before
     */
    Optional<PdfDocument> findByCacheKey(String cacheKey);

    /**
     * Find all PDF documents by user ID
     */
    @Query("SELECT p FROM PdfDocument p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<PdfDocument> findByUserId(@Param("userId") Long userId);

    /**
     * Find PDF documents by status
     */
    List<PdfDocument> findByStatus(PdfDocument.ProcessingStatus status);

    /**
     * Find PDF document with analysis result
     * FR-022: Get PDF status and analysis together
     */
    @Query("SELECT p FROM PdfDocument p LEFT JOIN FETCH p.analysisResult WHERE p.id = :id")
    Optional<PdfDocument> findByIdWithAnalysis(@Param("id") Long id);

    /**
     * Count documents by user ID
     */
    @Query("SELECT COUNT(p) FROM PdfDocument p WHERE p.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
}