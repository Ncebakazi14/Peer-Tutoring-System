package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.Student;
import za.ac.cput.peertutoringsystem.dto.StudentUpdateDTO;
import java.util.List;
import java.util.Optional;

public interface IStudentService {

    List<Student> findAll();

    Optional<Student> findById(Long studentId);

    Student update(Long studentId, StudentUpdateDTO studentUpdateDTO);

    void softDelete(Long studentId);
}
