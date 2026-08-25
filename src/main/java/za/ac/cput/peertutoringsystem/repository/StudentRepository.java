package za.ac.cput.peertutoringsystem.repository;

import za.ac.cput.peertutoringsystem.domain.Student;

import java.util.HashSet;
import java.util.Set;

public class StudentRepository implements IStudentRepository {

    private static StudentRepository repository = null;
    private Set<Student> studentDB;

    private StudentRepository() {
        studentDB = new HashSet<>();
    }

    public static StudentRepository getRepository() {
        if (repository == null) {
            repository = new StudentRepository();
        }
        return repository;
    }

    @Override
    public Student create(Student student) {
        studentDB.add(student);
        return student;
    }

    @Override
    public Student read(String studentId) {
        for (Student student : studentDB) {
            if (student.getStudentId().equals(studentId)) {
                return student;
            }
        }
        return null;
    }

    @Override
    public Student update(Student student) {
        Student existingStudent = read(student.getStudentId());

        if (existingStudent != null) {
            studentDB.remove(existingStudent);
            studentDB.add(student);
            return student;
        }
        return null;
    }

    @Override
    public boolean delete(String studentId) {
        Student student = read(studentId);

        if (student != null) {
            studentDB.remove(student);
            return true;
        }
        return false;
    }
}