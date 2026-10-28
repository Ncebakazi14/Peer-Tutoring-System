
package za.ac.cput.peertutoringsystem.dto;

public class TutorProfileResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String qualification;
    private String bio;
    private String availability;

    public TutorProfileResponseDTO() {
    }

    public TutorProfileResponseDTO(
            Long id,
            String firstName,
            String lastName,
            String qualification,
            String bio,
            String availability) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.qualification = qualification;
        this.bio = bio;
        this.availability = availability;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getQualification() {
        return qualification;
    }

    public String getBio() {
        return bio;
    }

    public String getAvailability() {
        return availability;
    }
}
