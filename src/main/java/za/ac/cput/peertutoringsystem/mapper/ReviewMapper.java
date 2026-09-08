package za.ac.cput.peertutoringsystem.mapper;

import org.springframework.stereotype.Component;
import za.ac.cput.peertutoringsystem.domain.Review;
import za.ac.cput.peertutoringsystem.dto.ReviewResponseDTO;

@Component
public class ReviewMapper {
    public ReviewResponseDTO toDTO(Review review) {
        if (review == null) return null;
        return new ReviewResponseDTO(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt() != null ? review.getCreatedAt().toLocalDate() : null,
                review.isAnonymous()

        );
    }
}
