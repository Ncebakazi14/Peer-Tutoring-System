package za.ac.cput.peertutoringsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {
    private int rating;
    private String comment;
    private boolean anonymous;
    private Long sessionId;
    private Long tutorProfileId;

}
