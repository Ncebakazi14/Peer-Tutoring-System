package za.ac.cput.peertutoringsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.peertutoringsystem.domain.Review;

import java.util.List;

@Repository

public interface ReviewRepository extends JpaRepository<Review ,Long> {
        List<Review> findByTutorProfileId(Long tutorProfileId);
}
