package com.zipduck.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Global Exception Handler
 * - RFC 7807 Problem Details for HTTP APIs
 * - Centralized error handling
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationException(MethodArgumentNotValidException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            "Validation failed"
        );

        problemDetail.setType(URI.create("https://zipduck.com/errors/validation-failed"));
        problemDetail.setTitle("Validation Failed");

        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        problemDetail.setProperty("errors", errors);

        log.warn("Validation failed: {}", errors);
        return problemDetail;
    }

    /**
     * Handle ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFoundException(ResourceNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND,
            ex.getMessage()
        );

        problemDetail.setType(URI.create("https://zipduck.com/errors/not-found"));
        problemDetail.setTitle("Resource Not Found");

        log.warn("Resource not found: {}", ex.getMessage());
        return problemDetail;
    }

    /**
     * Handle UnauthorizedException
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ProblemDetail handleUnauthorizedException(UnauthorizedException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.UNAUTHORIZED,
            ex.getMessage()
        );

        problemDetail.setType(URI.create("https://zipduck.com/errors/unauthorized"));
        problemDetail.setTitle("Unauthorized");

        log.warn("Unauthorized access: {}", ex.getMessage());
        return problemDetail;
    }

    /**
     * Handle BadRequestException
     */
    @ExceptionHandler(BadRequestException.class)
    public ProblemDetail handleBadRequestException(BadRequestException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            ex.getMessage()
        );

        problemDetail.setType(URI.create("https://zipduck.com/errors/bad-request"));
        problemDetail.setTitle("Bad Request");

        log.warn("Bad request: {}", ex.getMessage());
        return problemDetail;
    }

    /**
     * Handle RuntimeException
     */
    @ExceptionHandler(RuntimeException.class)
    public ProblemDetail handleRuntimeException(RuntimeException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            ex.getMessage()
        );

        problemDetail.setType(URI.create("https://zipduck.com/errors/internal-error"));
        problemDetail.setTitle("Internal Server Error");

        log.error("Runtime exception: {}", ex.getMessage(), ex);
        return problemDetail;
    }

    /**
     * Handle IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ProblemDetail handleIllegalArgumentException(IllegalArgumentException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.BAD_REQUEST,
            ex.getMessage()
        );

        problemDetail.setType(URI.create("https://zipduck.com/errors/bad-request"));
        problemDetail.setTitle("Bad Request");

        log.warn("Illegal argument: {}", ex.getMessage());
        return problemDetail;
    }

    /**
     * Handle generic Exception
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "An unexpected error occurred"
        );

        problemDetail.setType(URI.create("https://zipduck.com/errors/internal-error"));
        problemDetail.setTitle("Internal Server Error");

        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return problemDetail;
    }
}
