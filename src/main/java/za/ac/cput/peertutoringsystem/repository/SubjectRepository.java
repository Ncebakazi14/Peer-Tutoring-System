package za.ac.cput.peertutoringsystem.repository;

import za.ac.cput.peertutoringsystem.domain.Subject;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findByCode(String code);

    List<Subject> findByUserEmail(String email);
}