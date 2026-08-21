package za.ac.cput.peertutoringsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidSessionTimeException extends RuntimeException {
    public InvalidSessionTimeException(String message) {
        super(message);
    }
}

