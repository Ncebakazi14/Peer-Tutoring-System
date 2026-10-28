
package za.ac.cput.peertutoringsystem.controller;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

        return tutorProfileService.create(tutorProfile, email);
    }

    // Retrieve the authenticated user's own profile.
    @GetMapping("/mine")
    public TutorProfile getMyProfile(
            @AuthenticationPrincipal String email) {

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

        return tutorProfileService.update(tutorProfile, email);
    }

    // Delete only the authenticated user's own profile.
    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {

        tutorProfileService.delete(id, email);
    }

    // Return all profiles with tutor names for Browse Tutors.
    @GetMapping
    public List<TutorProfileResponseDTO> getAll() {
        return tutorProfileService.getAll();
    }
}
