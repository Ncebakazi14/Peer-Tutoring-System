package za.ac.cput.peertutoringsystem.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.peertutoringsystem.domain.TutorProfile;
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
    public TutorProfile create(@Valid @RequestBody TutorProfile tutorProfile) {
        return tutorProfileService.create(tutorProfile);
    }

    @GetMapping("/{id}")
    public TutorProfile read(@PathVariable Long id) {
        return tutorProfileService.read(id);
    }

    @PutMapping
    public TutorProfile update(@Valid @RequestBody TutorProfile tutorProfile) {
        return tutorProfileService.update(tutorProfile);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        tutorProfileService.delete(id);
    }

    @GetMapping
    public List<TutorProfile> getAll() {
        return tutorProfileService.getAll();
    }
}