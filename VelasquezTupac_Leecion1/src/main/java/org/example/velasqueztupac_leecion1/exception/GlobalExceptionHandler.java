package org.example.velasqueztupac_leecion1.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import jakarta.validation.ConstraintViolationException; // IMPORTANTE: Para validar query params (@DecimalMin)

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Errores de validación del cuerpo de la petición (POST @Valid, @NotNull, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("error", "Validation Error");
        errors.put("status", HttpStatus.BAD_REQUEST.value());

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        errors.put("details", fieldErrors);

        return ResponseEntity.badRequest().body(errors);
    }

    // 2. Errores de validación de Query Parameters (@Validated, @DecimalMin, etc.)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, Object> errors = new HashMap<>();
        errors.put("error", "Validation Error on Query Parameters");
        errors.put("status", HttpStatus.BAD_REQUEST.value());

        // Mapea los errores de validación a un formato legible
        Map<String, String> violationErrors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        // Obtiene el nombre del parámetro que falló
                        violation -> violation.getPropertyPath().toString(),
                        // Obtiene el mensaje de error
                        violation -> violation.getMessage()
                ));
        errors.put("details", violationErrors);

        return ResponseEntity.badRequest().body(errors);
    }

    // 3. Errores de Tipo (Ej: Enviar 'MONEDA_FALSA' o texto en un campo numérico)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Invalid Type");
        response.put("message", String.format("El valor '%s' no es válido para el campo '%s'. Tipo esperado: %s.",
                ex.getValue(), ex.getName(), ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "Unknown"));
        response.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(response);
    }

    // 4. Errores de Lógica de Negocio (Ej: from > to)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessLogic(IllegalArgumentException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Business Logic Error");
        response.put("message", ex.getMessage());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(response);
    }
}