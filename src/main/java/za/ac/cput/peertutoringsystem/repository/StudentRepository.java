package za.ac.cput.peertutoringsystem.repository;

import za.ac.cput.peertutoringsystem.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUserId(Long userId);

    List<Student> findByIsActiveTrue();
}
