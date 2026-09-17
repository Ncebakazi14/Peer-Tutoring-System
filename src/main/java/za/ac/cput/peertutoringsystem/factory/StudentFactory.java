package za.ac.cput.peertutoringsystem.factory;

import za.ac.cput.peertutoringsystem.domain.Student;
import za.ac.cput.peertutoringsystem.domain.User;

import java.time.LocalDate;

public class StudentFactory {

    public static Student createStudent(
            Long studentId,
            User user,
            String firstName,
            String lastName,
            String phoneNumber,
            LocalDate dateOfBirth,
            boolean isActive) {

        return new Student(
                studentId,
                user,
                firstName,
                lastName,
                phoneNumber,
                dateOfBirth,
                isActive
        );
    }
}