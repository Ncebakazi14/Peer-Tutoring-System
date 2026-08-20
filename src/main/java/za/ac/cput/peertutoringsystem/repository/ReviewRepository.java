package za.ac.cput.peertutoringsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.peertutoringsystem.domain.Review;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review ,Long> {
        Optional<Review> findById(long id);
}
