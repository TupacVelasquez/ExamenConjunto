package org.example.velasqueztupac_leecion1.exception;

import java.util.Map;

public record ErrorResponse(
        String timestamp,
        int status,
        String message,
        Map<String, String> errors
)
{}
