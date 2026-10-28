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

    @PostMapping
    public TutorProfile create(
            @Valid @RequestBody TutorProfile tutorProfile,
            @AuthenticationPrincipal String email) {
        return tutorProfileService.create(tutorProfile, email);
    }

    @GetMapping("/mine")
    public TutorProfile getMyProfile(@AuthenticationPrincipal String email) {
        return tutorProfileService.getMyProfile(email);
    }

    @GetMapping("/{id}")
    public TutorProfile read(@PathVariable Long id) {
        return tutorProfileService.read(id);
    }

    @PutMapping
    public TutorProfile update(
            @Valid @RequestBody TutorProfile tutorProfile,
            @AuthenticationPrincipal String email) {
        return tutorProfileService.update(tutorProfile, email);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        tutorProfileService.delete(id, email);
    }

    @GetMapping
    public List<TutorProfileResponseDTO> getAll() {
        return tutorProfileService.getAll();
    }
}