
package za.ac.cput.peertutoringsystem.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import za.ac.cput.peertutoringsystem.dto.SubjectRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SubjectResponseDTO;
import za.ac.cput.peertutoringsystem.service.SubjectService;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // Create a subject.
    @PostMapping
    public ResponseEntity<SubjectResponseDTO> create(
            @Valid @RequestBody SubjectRequestDTO dto) {

        SubjectResponseDTO createdSubject = subjectService.create(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdSubject);
    }

    // Retrieve all subjects.
    @GetMapping
    public ResponseEntity<List<SubjectResponseDTO>> findAll() {

        List<SubjectResponseDTO> subjects = subjectService.findAll();

        return ResponseEntity.ok(subjects);
    }

    // Retrieve one subject by ID.
    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(subjectService.findById(id));
    }

    // Update a subject.
    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequestDTO dto) {

        return ResponseEntity.ok(subjectService.update(id, dto));
    }

    // Delete a subject.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        subjectService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
