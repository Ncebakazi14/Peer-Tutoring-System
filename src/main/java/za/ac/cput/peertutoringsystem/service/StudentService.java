package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.Student;
import za.ac.cput.peertutoringsystem.repository.StudentRepository;

public class StudentService implements IStudentService {

    private static StudentService service = null;
    private StudentRepository repository;

    private StudentService() {
        repository = StudentRepository.getRepository();
    }

    public static StudentService getService() {
        if (service == null) {
            service = new StudentService();
        }
        return service;
    }

    @Override
    public Student create(Student student) {
        return repository.create(student);
    }

    @Override
    public Student read(String studentId) {
        return repository.read(studentId);
    }

    @Override
    public Student update(Student student) {
        return repository.update(student);
    }

    @Override
    public boolean delete(String studentId) {
        return repository.delete(studentId);
    }
}