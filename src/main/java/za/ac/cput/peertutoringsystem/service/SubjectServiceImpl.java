package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.Subject;
import za.ac.cput.peertutoringsystem.dto.SubjectRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SubjectResponseDTO;
import za.ac.cput.peertutoringsystem.mapper.SubjectMapper;
import za.ac.cput.peertutoringsystem.repository.SubjectRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public SubjectResponseDTO create(SubjectRequestDTO dto) {

        if (subjectRepository.findByCode(dto.getCode()).isPresent()) {
            throw new IllegalArgumentException(
                    "Subject with code " + dto.getCode() + " already exists."
            );
        }

        Subject subject = SubjectMapper.toEntity(dto);

        Subject savedSubject = subjectRepository.save(subject);

        return SubjectMapper.toResponseDTO(savedSubject);
    }

    @Override
    public List<SubjectResponseDTO> findAll() {

        return subjectRepository.findAll()
                .stream()
                .map(SubjectMapper::toResponseDTO)
                .toList();
    }

    @Override
    public SubjectResponseDTO findById(Long id) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Subject with ID " + id + " not found."
                        )
                );

        return SubjectMapper.toResponseDTO(subject);
    }

    @Override
    public SubjectResponseDTO update(Long id, SubjectRequestDTO dto) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Subject with ID " + id + " not found."
                        )
                );

        subjectRepository.findByCode(dto.getCode())
                .ifPresent(existingSubject -> {
                    if (!existingSubject.getSubjectId().equals(id)) {
                        throw new IllegalArgumentException(
                                "Subject with code " + dto.getCode() + " already exists."
                        );
                    }
                });

        subject.setCode(dto.getCode());
        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());

        Subject updatedSubject = subjectRepository.save(subject);

        return SubjectMapper.toResponseDTO(updatedSubject);
    }

    @Override
    public void delete(Long id) {

        if (!subjectRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Subject with ID " + id + " not found."
            );
        }

        subjectRepository.deleteById(id);
    }
}