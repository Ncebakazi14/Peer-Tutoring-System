package za.ac.cput.peertutoringsystem.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
    }

    @Override
    public ReviewResponseDTO createReview(ReviewRequestDTO dto, Long callerUserId) {
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