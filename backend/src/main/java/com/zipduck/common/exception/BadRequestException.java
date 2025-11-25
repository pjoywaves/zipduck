package com.zipduck.common.exception;

/**
 * Bad Request Exception
 * - 400 Bad Request
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
