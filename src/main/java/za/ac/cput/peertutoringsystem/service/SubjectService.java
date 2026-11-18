package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.dto.SubjectRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SubjectResponseDTO;

import java.util.List;

public interface SubjectService {

    SubjectResponseDTO create(SubjectRequestDTO dto);

    List<SubjectResponseDTO> findAll();

    SubjectResponseDTO findById(Long id);

    SubjectResponseDTO update(Long id, SubjectRequestDTO dto);

    void delete(Long id);
}