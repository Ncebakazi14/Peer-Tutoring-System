
package za.ac.cput.peertutoringsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.peertutoringsystem.domain.TutorProfile;

import java.util.Optional;

public interface TutorProfileRepository
        extends JpaRepository<TutorProfile, Long> {

    Optional<TutorProfile> findByUserEmail(String email);
}
