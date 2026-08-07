package za.ac.cput.peertutoringsystem.controller;

import org.springframework.web.bind.annotation.*;
import za.ac.cput.peertutoringsystem.domain.Student;
import za.ac.cput.peertutoringsystem.service.StudentService;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService service = StudentService.getService();

    @PostMapping("/create")
    public Student create(@RequestBody Student student) {
        return service.create(student);
    }

    @GetMapping("/read/{studentId}")
    public Student read(@PathVariable String studentId) {
        return service.read(studentId);
    }

    @PutMapping("/update")
    public Student update(@RequestBody Student student) {
        return service.update(student);
    }

    @DeleteMapping("/delete/{studentId}")
    public boolean delete(@PathVariable String studentId) {
        return service.delete(studentId);
    }
}