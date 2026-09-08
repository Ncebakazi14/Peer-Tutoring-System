package za.ac.cput.peertutoringsystem.domain;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;


@Entity
@Table(name="review" )
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;

    @Column(length = 1000)
    private String comment;

    private boolean anonymous;

    @Column(nullable = false)
    private Long sessionId;

    @Column(nullable = false)
    private Long tutorProfileId;

    private LocalDateTime createdAt;

    public Review() {
        this.createdAt = LocalDateTime.now();
    }

    public Review(int rating, String comment, boolean anonymous, Long sessionId, Long tutorProfileId) {
        this.rating = rating;
        this.comment = comment;
        this.anonymous = anonymous;
        this.sessionId = sessionId;
        this.tutorProfileId = tutorProfileId;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public boolean isAnonymous() { return anonymous; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Long getTutorProfileId() { return tutorProfileId; }
    public void setTutorProfileId(Long tutorProfileId) { this.tutorProfileId = tutorProfileId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }


    
}