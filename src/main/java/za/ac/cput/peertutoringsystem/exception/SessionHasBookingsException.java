package za.ac.cput.peertutoringsystem.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class SessionHasBookingsException extends RuntimeException {
    public SessionHasBookingsException(String message) {
        super(message);
    }
}

