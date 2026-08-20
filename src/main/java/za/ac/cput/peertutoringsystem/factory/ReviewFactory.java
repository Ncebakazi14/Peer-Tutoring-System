package za.ac.cput.peertutoringsystem.factory;

import za.ac.cput.peertutoringsystem.domain.Review;

import java.time.LocalDate;

public class ReviewFactory {

    public static Review CreateReview(Long reviewId , Integer rating,String comment, LocalDate reviewDate, boolean isAnonymous) {

        return new Review(reviewId,rating,comment,reviewDate,isAnonymous);

    }
}
