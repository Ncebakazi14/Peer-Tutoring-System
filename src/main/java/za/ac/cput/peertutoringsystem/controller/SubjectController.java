package za.ac.cput.peertutoringsystem.controller;

import za.ac.cput.peertutoringsystem.dto.SubjectRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SubjectResponseDTO;
import za.ac.cput.peertutoringsystem.service.SubjectService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public ResponseEntity<SubjectResponseDTO> create(
            @RequestBody SubjectRequestDTO dto) {

        SubjectResponseDTO createdSubject = subjectService.create(dto);

        return new ResponseEntity<>(
                createdSubject,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<SubjectResponseDTO>> findAll() {

        return ResponseEntity.ok(
                subjectService.findAll()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> findById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                subjectService.findById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> update(
            @PathVariable Long id,
            @RequestBody SubjectRequestDTO dto) {

        return ResponseEntity.ok(
                subjectService.update(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        subjectService.delete(id);

        return ResponseEntity.noContent().build();
    }
}