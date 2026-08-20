package za.ac.cput.peertutoringsystem.mapper;

import za.ac.cput.peertutoringsystem.domain.Review;
import za.ac.cput.peertutoringsystem.dto.ReviewResponseDTO;

public class ReviewMapper {
    public ReviewResponseDTO toDTO(Review review) {
        if (review == null) return null;
        return new ReviewResponseDTO(
                review.getReviewId(),
                review.getRating(),
                review.getComment(),
                review.getReviewDate(),
                review.isAnonymous()
        );
    }
}
