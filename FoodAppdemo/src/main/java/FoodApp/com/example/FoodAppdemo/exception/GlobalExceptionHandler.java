package FoodApp.com.example.FoodAppdemo.exception;

import FoodApp.com.example.FoodAppdemo.dto.ApiResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ⭐ CustomException handler
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponseDTO<String>> handleCustomException(CustomException ex) {

        ApiResponseDTO<String> response = new ApiResponseDTO<>(
                false,
                ex.getMessage(),
                null
        );

        return ResponseEntity
                .status(ex.getStatus())
                .body(response);
    }


    // ⭐ Handle 404 - URL NOT FOUND
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponseDTO<String>> handleNotFound(NoHandlerFoundException ex) {

        ApiResponseDTO<String> response = new ApiResponseDTO<>(
                false,
                "URL not found: " + ex.getRequestURL(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }


    // ⭐ Handle 405 - Method Not Allowed
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponseDTO<String>> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex) {

        ApiResponseDTO<String> response = new ApiResponseDTO<>(
                false,
                "HTTP Method Not Allowed: " + ex.getMethod(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(response);
    }


    // ⭐ Handle Validation errors (DTO constraints)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponseDTO<String>> handleValidationErrors(MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        ApiResponseDTO<String> response = new ApiResponseDTO<>(
                false,
                message,
                null
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // ⭐ Handle Security / Authentication errors
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ApiResponseDTO<String>> handleAuthError(Exception ex) {

        ApiResponseDTO<String> response = new ApiResponseDTO<>(
                false,
                "Authentication failed: " + ex.getMessage(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }


    // ⭐ Global fallback for ANY error
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseDTO<String>> handleGeneralException(Exception ex,
                                                                         HttpServletRequest req) {

        ApiResponseDTO<String> response = new ApiResponseDTO<>(
                false,
                "Internal Server Error: " + ex.getMessage(),
                null
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}


