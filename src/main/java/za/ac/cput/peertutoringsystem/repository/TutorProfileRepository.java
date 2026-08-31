package za.ac.cput.peertutoringsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.peertutoringsystem.domain.TutorProfile;

public interface TutorProfileRepository extends JpaRepository<TutorProfile, Long> {
}