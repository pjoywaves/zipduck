package com.zipduck.infrastructure.cache;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zipduck.domain.pdf.PdfAnalysisResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

/**
 * Redis caching service for PDF analysis results
 * FR-024: Cache popular PDF analysis results
 * T061: Redis caching service implementation
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PdfCacheService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String CACHE_PREFIX = "pdf:analysis:";
    private static final Duration DEFAULT_TTL = Duration.ofDays(30); // FR-024: Cache for 30 days

    /**
     * Cache PDF analysis result by cache key (file hash)
     * FR-024: Store analysis results for frequently uploaded PDFs
     */
    public void cacheAnalysisResult(String cacheKey, PdfAnalysisResult analysisResult) {
        try {
            String key = CACHE_PREFIX + cacheKey;
            String value = objectMapper.writeValueAsString(analysisResult);
            redisTemplate.opsForValue().set(key, value, DEFAULT_TTL);
            log.info("Cached PDF analysis result: {}", cacheKey);
        } catch (JsonProcessingException e) {
            log.error("Failed to cache analysis result for key: {}", cacheKey, e);
        }
    }

    /**
     * Get cached analysis result by cache key
     * FR-023: Retrieve cached results for duplicate PDFs
     */
    public PdfAnalysisResult getCachedAnalysisResult(String cacheKey) {
        try {
            String key = CACHE_PREFIX + cacheKey;
            String value = redisTemplate.opsForValue().get(key);

            if (value == null) {
                log.debug("Cache miss for PDF: {}", cacheKey);
                return null;
            }

            log.info("Cache hit for PDF: {}", cacheKey);
            return objectMapper.readValue(value, PdfAnalysisResult.class);
        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize cached analysis result for key: {}", cacheKey, e);
            return null;
        }
    }

    /**
     * Check if analysis result is cached
     */
    public boolean isCached(String cacheKey) {
        String key = CACHE_PREFIX + cacheKey;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * Invalidate cache entry
     */
    public void invalidateCache(String cacheKey) {
        String key = CACHE_PREFIX + cacheKey;
        redisTemplate.delete(key);
        log.info("Invalidated cache for PDF: {}", cacheKey);
    }

    /**
     * Update cache TTL (extend expiration)
     * Useful when a cached PDF is accessed again
     */
    public void extendCacheTTL(String cacheKey) {
        String key = CACHE_PREFIX + cacheKey;
        redisTemplate.expire(key, DEFAULT_TTL);
        log.debug("Extended cache TTL for PDF: {}", cacheKey);
    }

    /**
     * Get cache statistics (for monitoring)
     */
    public long getCacheSize() {
        return redisTemplate.keys(CACHE_PREFIX + "*").size();
    }
}
