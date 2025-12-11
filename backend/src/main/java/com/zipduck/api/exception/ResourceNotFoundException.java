package com.zipduck.api.exception;

/**
 * Exception thrown when a requested resource is not found
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
    }

    /**
     * 공공데이터 API 예외
     */
    public static class PublicDataApiException extends RuntimeException {
        public PublicDataApiException(String message) {
            super(message);
        }

        public PublicDataApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}