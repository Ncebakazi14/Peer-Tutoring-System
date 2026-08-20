package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.Review;
import java.util.List;
import java.util.Optional;

public interface ReviewService {
    Review save(Review user);

    Optional<Review> findById(Long id);

    Optional<Review> findByEmail(String email);

    List<Review> findAll();

    void delete(Long id);
}
