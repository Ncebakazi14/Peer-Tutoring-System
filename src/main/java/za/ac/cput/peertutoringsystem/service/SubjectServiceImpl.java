package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.domain.Subject;
import za.ac.cput.peertutoringsystem.domain.User;
import za.ac.cput.peertutoringsystem.domain.Role;
import za.ac.cput.peertutoringsystem.dto.SubjectRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SubjectResponseDTO;
import za.ac.cput.peertutoringsystem.mapper.SubjectMapper;
import za.ac.cput.peertutoringsystem.repository.SubjectRepository;
import za.ac.cput.peertutoringsystem.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public SubjectServiceImpl(
            SubjectRepository subjectRepository,
            UserRepository userRepository) {
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public SubjectResponseDTO create(SubjectRequestDTO dto, String email) {

        if (subjectRepository.findByCode(dto.getCode()).isPresent()) {
            throw new IllegalArgumentException(
                    "Subject with code " + dto.getCode() + " already exists."
            );
        }

        Subject subject = SubjectMapper.toEntity(dto);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() != Role.TUTOR) {
            throw new IllegalArgumentException("Only tutor accounts can manage subjects.");
        }
        subject.setUser(user);

        Subject savedSubject = subjectRepository.save(subject);

        return SubjectMapper.toResponseDTO(savedSubject);
    }

    @Override
    public List<SubjectResponseDTO> findMine(String email) {
        return subjectRepository.findByUserEmail(email).stream()
                .map(SubjectMapper::toResponseDTO)
                .toList();
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
    public SubjectResponseDTO update(Long id, SubjectRequestDTO dto, String email) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Subject with ID " + id + " not found."
                        )
                );
        if (subject.getUser() == null || !subject.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("You can only update your own subjects.");
        }

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
    public void delete(Long id, String email) {

        if (!subjectRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Subject with ID " + id + " not found."
            );
        }

        Subject subject = subjectRepository.findById(id).orElseThrow();
        if (subject.getUser() == null || !subject.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("You can only delete your own subjects.");
        }

        subjectRepository.deleteById(id);
    }
}