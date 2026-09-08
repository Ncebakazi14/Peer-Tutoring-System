package za.ac.cput.peertutoringsystem.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.peertutoringsystem.dto.ReviewRequestDTO;
import za.ac.cput.peertutoringsystem.dto.ReviewResponseDTO;
import za.ac.cput.peertutoringsystem.service.IReviewService;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final IReviewService reviewService;

    public ReviewController(IReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> createReview(
            @RequestBody ReviewRequestDTO dto,
            @RequestParam Long callerUserId) {
        ReviewResponseDTO response = reviewService.createReview(dto, callerUserId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/tutor/{tutorProfileId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByTutor(@PathVariable Long tutorProfileId) {
        List<ReviewResponseDTO> reviews = reviewService.findByTutorProfile(tutorProfileId);
        return ResponseEntity.ok(reviews);
    }
}