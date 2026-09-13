package za.ac.cput.peertutoringsystem.factory;

import za.ac.cput.peertutoringsystem.domain.Student;

public class StudentFactory {

    public static Student createStudent(String studentId,
                                        String firstName,
                                        String lastName,
                                        String email) {

        return new Student(studentId, firstName, lastName, email);
    }
}