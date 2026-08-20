package za.ac.cput.peertutoringsystem.domain;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Objects;


@Entity
@Table(name="review" )
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "session_id", nullable = false)
//    private Session session;
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "tutor_profile_id", nullable = false)
//    private TutorProfile tutorProfile;
//    @Column(nullable = false)
    private int rating;
    private String comment;
    private LocalDate reviewDate;
    private boolean isAnonymous = false;

    public Review() {
    }

    public Review(Long reviewId, int rating, String comment, LocalDate reviewDate, boolean isAnonymous) {
        this.reviewId = reviewId;
        this.student = new Student();
        this.rating = rating;
        this.comment = comment;
        this.reviewDate = reviewDate;
        this.isAnonymous = isAnonymous;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public Student getStudent() {
        return student;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Review review = (Review) o;
        return Objects.equals(reviewId, review.reviewId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reviewId);
    }

}
