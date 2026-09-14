package za.ac.cput.peertutoringsystem.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import za.ac.cput.peertutoringsystem.domain.SessionStatus;
import za.ac.cput.peertutoringsystem.dto.SessionRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SessionResponseDTO;
import za.ac.cput.peertutoringsystem.service.SessionService;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public ResponseEntity<List<SessionResponseDTO>> getAll(
            @RequestParam(required = false) SessionStatus status,
            @RequestParam(required = false) String topic
    ) {
        return ResponseEntity.ok(sessionService.findAll(status, topic));
    }

    @PostMapping
    public ResponseEntity<SessionResponseDTO> create(
            @Valid @RequestBody SessionRequestDTO dto,
            @RequestHeader("X-User-Id") Long callerUserId
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sessionService.create(dto, callerUserId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody SessionRequestDTO dto,
            @RequestHeader("X-User-Id") Long callerUserId
    ) {
        return ResponseEntity.ok(sessionService.update(id, dto, callerUserId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long callerUserId
    ) {
        sessionService.delete(id, callerUserId);
        return ResponseEntity.noContent().build();
    }
}

