package com.example.hms.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(
            IllegalStateException ex) {

        HttpStatus status = ex.getMessage() != null
                && ex.getMessage().toLowerCase().contains("not authenticated")
                        ? HttpStatus.UNAUTHORIZED
                        : HttpStatus.BAD_REQUEST;

        return ResponseEntity
                .status(status)
                .body(Map.of("message", ex.getMessage()));
    }
}
