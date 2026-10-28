
package za.ac.cput.peertutoringsystem.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import za.ac.cput.peertutoringsystem.domain.SessionStatus;
import za.ac.cput.peertutoringsystem.domain.User;
import za.ac.cput.peertutoringsystem.dto.SessionRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SessionResponseDTO;
import za.ac.cput.peertutoringsystem.repository.UserRepository;
import za.ac.cput.peertutoringsystem.service.SessionService;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    private final SessionService sessionService;
    private final UserRepository userRepository;

    public SessionController(
            SessionService sessionService,
            UserRepository userRepository) {
        this.sessionService = sessionService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<SessionResponseDTO>> getAll(
            @RequestParam(required = false) SessionStatus status,
            @RequestParam(required = false) String topic) {

        return ResponseEntity.ok(
                sessionService.findAll(status, topic));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SessionResponseDTO>> getMySessions() {
        Long callerUserId = getAuthenticatedUserId();

        return ResponseEntity.ok(
                sessionService.findMySessions(callerUserId));
    }

    @PostMapping
    public ResponseEntity<SessionResponseDTO> create(
            @Valid @RequestBody SessionRequestDTO dto) {

        Long callerUserId = getAuthenticatedUserId();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sessionService.create(dto, callerUserId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody SessionRequestDTO dto) {

        Long callerUserId = getAuthenticatedUserId();

        return ResponseEntity.ok(
                sessionService.update(id, dto, callerUserId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long callerUserId = getAuthenticatedUserId();

        sessionService.delete(id, callerUserId);

        return ResponseEntity.noContent().build();
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You must be logged in to manage sessions.");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new org.springframework.security.access.AccessDeniedException(
                                "Authenticated user was not found."));

        return user.getId();
    }
}
