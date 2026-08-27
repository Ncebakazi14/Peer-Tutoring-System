package za.ac.cput.peertutoringsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.peertutoringsystem.domain.Student;
import za.ac.cput.peertutoringsystem.dto.StudentResponseDTO;
import za.ac.cput.peertutoringsystem.dto.StudentUpdateDTO;
import za.ac.cput.peertutoringsystem.mapper.StudentMapper;
import za.ac.cput.peertutoringsystem.service.IStudentService;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.CrossOrigin;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/students")
public class StudentController {

    private final IStudentService studentService;

    public StudentController(IStudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDTO>> findAll() {

        List<StudentResponseDTO> students = studentService.findAll()
                .stream()
                .map(StudentMapper::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> findById(@PathVariable Long id) {

        return studentService.findById(id)
                .map(StudentMapper::toResponseDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponseDTO> update(
            @PathVariable Long id,
            @RequestBody StudentUpdateDTO studentUpdateDTO) {

        Student updatedStudent = studentService.update(id, studentUpdateDTO);

        return ResponseEntity.ok(
                StudentMapper.toResponseDTO(updatedStudent)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDelete(@PathVariable Long id) {

        studentService.softDelete(id);

        return ResponseEntity.noContent().build();
    }
}