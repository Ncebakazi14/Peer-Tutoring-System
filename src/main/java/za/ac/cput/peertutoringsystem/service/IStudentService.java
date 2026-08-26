package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.Student;

public interface IStudentService {

    Student create(Student student);

    Student read(String studentId);

    Student update(Student student);

    boolean delete(String studentId);
}