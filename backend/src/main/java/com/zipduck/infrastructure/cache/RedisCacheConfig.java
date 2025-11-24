package com.zipduck.infrastructure.cache;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

/**
 * Redis Cache Configuration
 * T108: Enhanced with multiple TTL settings for different cache types
 * - Configures Redis as a cache provider
 * - Sets up JSON serialization for cached objects
 * - Configures TTL for cache entries with type-specific durations
 */
@Configuration
@EnableCaching
public class RedisCacheConfig {

    @Value("${app.cache.ttl:3600}")
    private long cacheTtlSeconds;

    @Value("${app.cache.pdf-analysis-ttl:2592000}")
    private long pdfAnalysisTtlSeconds;

    @Value("${app.cache.user-profile-ttl:86400}")
    private long userProfileTtlSeconds;

    @Value("${app.cache.subscription-list-ttl:1800}")
    private long subscriptionListTtlSeconds;

    @Value("${app.cache.eligibility-ttl:3600}")
    private long eligibilityTtlSeconds;

    /**
     * Configure Redis cache manager with JSON serialization
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // Configure Jackson ObjectMapper for Redis serialization
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        objectMapper.activateDefaultTyping(
            objectMapper.getPolymorphicTypeValidator(),
            ObjectMapper.DefaultTyping.NON_FINAL
        );

        GenericJackson2JsonRedisSerializer serializer =
            new GenericJackson2JsonRedisSerializer(objectMapper);

        // Configure cache defaults
        RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofSeconds(cacheTtlSeconds))
            .serializeKeysWith(
                RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer())
            )
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(serializer)
            )
            .disableCachingNullValues();

        // T108: Configure specific TTLs for different cache names
        RedisCacheConfiguration pdfConfig = cacheConfig
                .entryTtl(Duration.ofSeconds(pdfAnalysisTtlSeconds));

        RedisCacheConfiguration userProfileConfig = cacheConfig
                .entryTtl(Duration.ofSeconds(userProfileTtlSeconds));

        RedisCacheConfiguration subscriptionConfig = cacheConfig
                .entryTtl(Duration.ofSeconds(subscriptionListTtlSeconds));

        RedisCacheConfiguration eligibilityConfig = cacheConfig
                .entryTtl(Duration.ofSeconds(eligibilityTtlSeconds));

        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(cacheConfig)
            .withCacheConfiguration("pdf-analysis", pdfConfig)
            .withCacheConfiguration("user-profiles", userProfileConfig)
            .withCacheConfiguration("subscriptions", subscriptionConfig)
            .withCacheConfiguration("eligibility", eligibilityConfig)
            .transactionAware()
            .build();
    }

    /**
     * Configure RedisTemplate for manual cache operations
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        // Configure serializers
        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        GenericJackson2JsonRedisSerializer jsonSerializer =
            new GenericJackson2JsonRedisSerializer(objectMapper);

        // Set serializers
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);
        template.setValueSerializer(jsonSerializer);
        template.setHashValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}