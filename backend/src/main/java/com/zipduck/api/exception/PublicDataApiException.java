package com.zipduck.api.exception;

/**
 * 공공데이터 API 예외
 */
public class PublicDataApiException extends RuntimeException {
    public PublicDataApiException(String message) {
        super(message);
    }

    public PublicDataApiException(String message, Throwable cause) {
        super(message, cause);
    }
}