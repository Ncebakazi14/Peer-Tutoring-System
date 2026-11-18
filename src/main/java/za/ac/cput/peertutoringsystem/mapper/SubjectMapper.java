package za.ac.cput.peertutoringsystem.mapper;

import za.ac.cput.peertutoringsystem.domain.Subject;
import za.ac.cput.peertutoringsystem.dto.SubjectRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SubjectResponseDTO;

public class SubjectMapper {

    private SubjectMapper() {
    }

    public static Subject toEntity(SubjectRequestDTO dto) {
        return new Subject(
                null,
                dto.getCode(),
                dto.getName(),
                dto.getDescription()
        );
    }

    public static SubjectResponseDTO toResponseDTO(Subject subject) {
        return new SubjectResponseDTO(
                subject.getSubjectId(),
                subject.getCode(),
                subject.getName(),
                subject.getDescription()
        );
    }
}