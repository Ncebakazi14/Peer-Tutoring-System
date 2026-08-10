package za.ac.cput.peertutoringsystem.mapper;

import za.ac.cput.peertutoringsystem.domain.Student;
import za.ac.cput.peertutoringsystem.dto.StudentResponseDTO;

public class StudentMapper {

        public static StudentResponseDTO toResponseDTO(Student student) {

            if (student == null) {
                return null;
            }

            return new StudentResponseDTO(
                    student.getStudentId(),
                    student.getFirstName(),
                    student.getLastName(),
                    student.getUser().getEmail(),
                    student.getPhoneNumber(),
                    student.getDateOfBirth(),
                    student.isActive()
            );
        }
    }

