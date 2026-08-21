package za.ac.cput.peertutoringsystem.service;

import za.ac.cput.peertutoringsystem.dto.SessionRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SessionResponseDTO;
import za.ac.cput.peertutoringsystem.entity.SessionStatus;

import java.util.List;

public interface SessionService {
    List<SessionResponseDTO> findAll(SessionStatus status, String topic);

    SessionResponseDTO create(SessionRequestDTO dto, Long callerUserId);

    SessionResponseDTO update(Long id, SessionRequestDTO dto, Long callerUserId);

    void delete(Long id, Long callerUserId);

    void incrementCurrentStudents(Long sessionId);

    void decrementCurrentStudents(Long sessionId);
}

