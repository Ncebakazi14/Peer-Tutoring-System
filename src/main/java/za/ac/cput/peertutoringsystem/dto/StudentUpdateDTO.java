package za.ac.cput.peertutoringsystem.dto;

import java.time.LocalDate;

public class StudentUpdateDTO {

    private String phoneNumber;
    private LocalDate dateOfBirth;

    public StudentUpdateDTO() {
    }

    public StudentUpdateDTO(String phoneNumber, LocalDate dateOfBirth) {
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

}
