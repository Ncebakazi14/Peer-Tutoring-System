package za.ac.cput.peertutoringsystem.factory;

import za.ac.cput.peertutoringsystem.domain.Review;

import java.time.LocalDate;

public class ReviewFactory {

    public static Review createReview(int rating, String comment, boolean isAnonymous, Long sessionId, Long tutorProfileId) {
        if (rating < 1 || rating > 5) {
            return null;
        }

        return new Review(
                rating,
                comment,
                isAnonymous,
                sessionId,
                tutorProfileId
        );
    }
}