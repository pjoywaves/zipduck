package com.zipduck.common.exception;

/**
 * Unauthorized Exception
 * - 401 Unauthorized
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
