package za.ac.cput.peertutoringsystem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.peertutoringsystem.domain.Review;
import za.ac.cput.peertutoringsystem.repository.ReviewRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository repository;

    @Autowired
    public ReviewServiceImpl(ReviewRepository repository) {
        this.repository = repository;
    }

    @Override
    public Review save(Review user) {
        return null;
    }

    @Override
    public Optional<Review> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Optional<Review> findByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public List<Review> findAll() {
        return List.of();
    }

    @Override
    public void delete(Long id) {
        return;
    }
}
