package com.zipduck.infrastructure.external;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Google Gemini API Client
 * Handles communication with Google Gemini 2.5 Flash for PDF content analysis
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";
    private static final int TIMEOUT_SECONDS = 30;

    @Value("${app.google.gemini.api-key}")
    private String apiKey;

    @Value("${app.google.gemini.model}")
    private String model;

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    /**
     * Generate content using Gemini API
     *
     * @param prompt The prompt to send to Gemini
     * @param temperature Sampling temperature (0.0 to 1.0)
     * @param maxTokens Maximum number of tokens to generate
     * @return Generated text content
     */
    @CircuitBreaker(name = "gemini", fallbackMethod = "generateContentFallback")
    @Retry(name = "gemini")
    public String generateContent(String prompt, double temperature, int maxTokens) {
        log.info("Calling Gemini API with model: {}", model);

        WebClient webClient = webClientBuilder
            .baseUrl(GEMINI_API_URL)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();

        // Build request body according to Gemini API specification
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of(
                    "parts", List.of(
                        Map.of("text", prompt)
                    )
                )
            ),
            "generationConfig", Map.of(
                "temperature", temperature,
                "maxOutputTokens", maxTokens,
                "topP", 0.95,
                "topK", 40
            )
        );

        try {
            String response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                    .path("")
                    .queryParam("key", apiKey)
                    .build(model))
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(TIMEOUT_SECONDS))
                .block();

            return extractTextFromResponse(response);
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            throw new GeminiApiException("Failed to generate content from Gemini API", e);
        }
    }

    /**
     * Extract text content from Gemini API response
     */
    private String extractTextFromResponse(String response) {
        try {
            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode candidates = rootNode.path("candidates");

            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode content = firstCandidate.path("content");
                JsonNode parts = content.path("parts");

                if (parts.isArray() && !parts.isEmpty()) {
                    return parts.get(0).path("text").asText();
                }
            }

            log.warn("Unexpected Gemini API response format: {}", response);
            throw new GeminiApiException("Could not extract text from Gemini API response");
        } catch (Exception e) {
            log.error("Error parsing Gemini API response: {}", e.getMessage(), e);
            throw new GeminiApiException("Failed to parse Gemini API response", e);
        }
    }

    /**
     * Fallback method when Gemini API is unavailable
     */
    private String generateContentFallback(String prompt, double temperature, int maxTokens, Exception e) {
        log.error("Gemini API circuit breaker activated. Fallback triggered: {}", e.getMessage());
        throw new GeminiApiException("Gemini API is currently unavailable. Please try again later.", e);
    }

    /**
     * Custom exception for Gemini API errors
     */
    public static class GeminiApiException extends RuntimeException {
        public GeminiApiException(String message) {
            super(message);
        }

        public GeminiApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}