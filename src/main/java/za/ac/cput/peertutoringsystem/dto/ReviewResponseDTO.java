package za.ac.cput.peertutoringsystem.dto;

import java.time.LocalDate;

public class ReviewResponseDTO {
    private Long reviewId;
    private int rating;
    private String comment;
    private LocalDate reviewDate;
    private boolean isAnonymous;

    public ReviewResponseDTO() {}

    public ReviewResponseDTO(Long reviewId, int rating, String comment, LocalDate reviewDate, boolean isAnonymous) {
        this.reviewId = reviewId;
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
        this.isAnonymous = isAnonymous;
    }

    public Long getReviewId() { return reviewId; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public LocalDate getReviewDate() { return reviewDate; }
    public boolean isAnonymous() { return isAnonymous; }

    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }
    public void setRating(int rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }
    public void setAnonymous(boolean anonymous) { isAnonymous = anonymous; }
}
