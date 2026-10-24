
package za.ac.cput.peertutoringsystem.service.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import za.ac.cput.peertutoringsystem.domain.Review;
import za.ac.cput.peertutoringsystem.dto.ReviewRequestDTO;
import za.ac.cput.peertutoringsystem.dto.ReviewResponseDTO;
import za.ac.cput.peertutoringsystem.factory.ReviewFactory;
import za.ac.cput.peertutoringsystem.mapper.ReviewMapper;
import za.ac.cput.peertutoringsystem.repository.ReviewRepository;
import za.ac.cput.peertutoringsystem.service.IReviewService;

import java.util.List;

@Service
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
    }

    @Override
    public ReviewResponseDTO createReview(ReviewRequestDTO dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You must be logged in to create a review.");
        }

        Review review = ReviewFactory.createReview(
                dto.getRating(),
                dto.getComment(),
                dto.isAnonymous(),
                dto.getSessionId(),
                dto.getTutorProfileId()
        );

        Review savedReview = reviewRepository.save(review);

        return reviewMapper.toDTO(savedReview);
    }

    @Override
    public List<ReviewResponseDTO> findByTutorProfile(Long tutorProfileId) {
        return reviewRepository.findByTutorProfileId(tutorProfileId)
                .stream()
                .map(reviewMapper::toDTO)
                .toList();
    }
}
