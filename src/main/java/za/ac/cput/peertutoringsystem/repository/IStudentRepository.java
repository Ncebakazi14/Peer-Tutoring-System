package za.ac.cput.peertutoringsystem.repository;

import za.ac.cput.peertutoringsystem.domain.Student;

public interface IStudentRepository {

    Student create(Student student);

    Student read(String studentId);

    Student update(Student student);

    boolean delete(String studentId);
}