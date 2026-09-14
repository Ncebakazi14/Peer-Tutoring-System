package za.ac.cput.peertutoringsystem.service;

import org.springframework.stereotype.Service;
import za.ac.cput.peertutoringsystem.domain.Student;
import za.ac.cput.peertutoringsystem.repository.StudentRepository;
import za.ac.cput.peertutoringsystem.dto.StudentUpdateDTO;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService implements IStudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    @Override
    public Optional<Student> findById(Long studentId) {
        return studentRepository.findById(studentId);
    }

    @Override
    public Student update(Long studentId, StudentUpdateDTO studentUpdateDTO) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found with ID: " + studentId));

        student.setPhoneNumber(studentUpdateDTO.getPhoneNumber());
        student.setDateOfBirth(studentUpdateDTO.getDateOfBirth());

        return studentRepository.save(student);
    }

    @Override
    public void softDelete(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found with ID: " + studentId));

        student.setActive(false);

        studentRepository.save(student);
    }
}