package za.ac.cput.peertutoringsystem.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;

@Entity
@Table(name = "tutor_profiles")
public class TutorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Bio is required")
    @Column(nullable = false)
    private String bio;

    @NotBlank(message = "Qualification is required")
    @Column(nullable = false)
    private String qualification;

    @NotBlank(message = "Availability is required")
    @Column(nullable = false)
    private String availability;

    public TutorProfile() {
    }

    public TutorProfile(String bio, String qualification, String availability) {
        this.bio = bio;
        this.qualification = qualification;
        this.availability = availability;
    }

    public Long getId() {
        return id;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    @Override
    public String toString() {
        return "TutorProfile{" +
                "id=" + id +
                ", bio='" + bio + '\'' +
                ", qualification='" + qualification + '\'' +
                ", availability='" + availability + '\'' +
                '}';
    }
}