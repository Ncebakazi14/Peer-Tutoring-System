package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.dto.ReviewRequestDTO;
import za.ac.cput.peertutoringsystem.dto.ReviewResponseDTO;

import java.util.List;

public interface IReviewService {
    ReviewResponseDTO createReview(ReviewRequestDTO dto, Long callerUserId);
    List<ReviewResponseDTO> findByTutorProfile(Long tutorProfileId);
}