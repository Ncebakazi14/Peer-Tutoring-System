
package za.ac.cput.peertutoringsystem.controller;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import za.ac.cput.peertutoringsystem.domain.TutorProfile;
import za.ac.cput.peertutoringsystem.dto.TutorProfileResponseDTO;
import za.ac.cput.peertutoringsystem.service.TutorProfileService;

import java.util.List;

@RestController
@RequestMapping("/api/tutor-profiles")
public class TutorProfileController {

    private final TutorProfileService tutorProfileService;

    public TutorProfileController(TutorProfileService tutorProfileService) {
        this.tutorProfileService = tutorProfileService;
    }

    // Create a profile for the authenticated user.
    @PostMapping
    public TutorProfile create(
            @Valid @RequestBody TutorProfile tutorProfile,
            @AuthenticationPrincipal String email) {

        requireAuthenticatedUser(email);
        return tutorProfileService.create(tutorProfile, email);
    }

    // Retrieve the authenticated user's own profile.
    @GetMapping("/mine")
    public TutorProfile getMyProfile(
            @AuthenticationPrincipal String email) {

        requireAuthenticatedUser(email);
        return tutorProfileService.getMyProfile(email);
    }

    // Retrieve a profile by ID.
    @GetMapping("/{id}")
    public TutorProfile read(@PathVariable Long id) {
        return tutorProfileService.read(id);
    }

    // Update the authenticated user's own profile.
    @PutMapping
    public TutorProfile update(
            @Valid @RequestBody TutorProfile tutorProfile,
            @AuthenticationPrincipal String email) {

        requireAuthenticatedUser(email);
        return tutorProfileService.update(tutorProfile, email);
    }

    // Delete only the authenticated user's own profile.
    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {

        requireAuthenticatedUser(email);
        tutorProfileService.delete(id, email);
    }

    private void requireAuthenticatedUser(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "A valid login session is required"
            );
        }
    }

    // Return all profiles with tutor names for Browse Tutors.
    @GetMapping
    public List<TutorProfileResponseDTO> getAll() {
        return tutorProfileService.getAll();
    }
}
