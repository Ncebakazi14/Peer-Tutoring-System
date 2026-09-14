package za.ac.cput.peertutoringsystem.dto;

import java.time.LocalDate;
public class StudentResponseDTO {

        private Long studentId;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private LocalDate dateOfBirth;
        private boolean isActive;

        public StudentResponseDTO() {
        }

        public StudentResponseDTO(Long studentId,
                                  String firstName,
                                  String lastName,
                                  String email,
                                  String phoneNumber,
                                  LocalDate dateOfBirth,
                                  boolean isActive) {
            this.studentId = studentId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.dateOfBirth = dateOfBirth;
            this.isActive = isActive;
        }

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
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

        public boolean isActive() {
            return isActive;
        }

        public void setActive(boolean active) {
            isActive = active;
        }
    }

