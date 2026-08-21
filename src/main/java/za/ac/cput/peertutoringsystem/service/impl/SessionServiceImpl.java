package za.ac.cput.peertutoringsystem.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.peertutoringsystem.dto.SessionRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SessionResponseDTO;
import za.ac.cput.peertutoringsystem.entity.Session;
import za.ac.cput.peertutoringsystem.entity.SessionStatus;
import za.ac.cput.peertutoringsystem.exception.ForbiddenOperationException;
import za.ac.cput.peertutoringsystem.exception.InvalidSessionTimeException;
import za.ac.cput.peertutoringsystem.exception.ResourceNotFoundException;
import za.ac.cput.peertutoringsystem.exception.SessionHasBookingsException;
import za.ac.cput.peertutoringsystem.mapper.SessionMapper;
import za.ac.cput.peertutoringsystem.repository.SessionRepository;
import za.ac.cput.peertutoringsystem.service.SessionService;

import java.util.List;

@Service
@Transactional
public class SessionServiceImpl implements SessionService {

    private final SessionRepository sessionRepository;

    public SessionServiceImpl(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public List<SessionResponseDTO> findAll(SessionStatus status, String topic) {
        if (status != null) {
            String safeTopic = topic == null ? "" : topic;
            return sessionRepository.findByStatusAndTopicContainingIgnoreCase(status, safeTopic)
                    .stream()
                    .map(SessionMapper::toResponseDTO)
                    .toList();
        }
        return sessionRepository.findAll().stream().map(SessionMapper::toResponseDTO).toList();
    }

    @Override
    public SessionResponseDTO create(SessionRequestDTO dto, Long callerUserId) {
        validateSessionInput(dto);

        Session session = new Session();
        session.setTutorProfileId(dto.getTutorProfileId());
        session.setOwnerUserId(callerUserId);
        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setLocation(dto.getLocation());
        session.setOnline(dto.isOnline());
        session.setMeetingLink(dto.getMeetingLink());
        session.setMaxStudents(dto.getMaxStudents());
        session.setCurrentStudents(0);
        session.setStatus(SessionStatus.SCHEDULED);
        session.setTopic(dto.getTopic());

        return SessionMapper.toResponseDTO(sessionRepository.save(session));
    }

    @Override
    public SessionResponseDTO update(Long id, SessionRequestDTO dto, Long callerUserId) {
        validateSessionInput(dto);
        Session session = getSessionById(id);
        assertOwner(session, callerUserId);

        session.setTutorProfileId(dto.getTutorProfileId());
        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setLocation(dto.getLocation());
        session.setOnline(dto.isOnline());
        session.setMeetingLink(dto.getMeetingLink());
        session.setMaxStudents(dto.getMaxStudents());
        session.setTopic(dto.getTopic());

        return SessionMapper.toResponseDTO(sessionRepository.save(session));
    }

    @Override
    public void delete(Long id, Long callerUserId) {
        Session session = getSessionById(id);
        assertOwner(session, callerUserId);
        if (hasActiveBookings(session.getSessionId())) {
            throw new SessionHasBookingsException("Cannot delete session with active bookings.");
        }
        sessionRepository.delete(session);
    }

    @Override
    public void incrementCurrentStudents(Long sessionId) {
        Session session = getSessionById(sessionId);
        session.setCurrentStudents(session.getCurrentStudents() + 1);
        sessionRepository.save(session);
    }

    @Override
    public void decrementCurrentStudents(Long sessionId) {
        Session session = getSessionById(sessionId);
        int current = session.getCurrentStudents();
        session.setCurrentStudents(Math.max(0, current - 1));
        sessionRepository.save(session);
    }

    private Session getSessionById(Long id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found: " + id));
    }

    private void validateSessionInput(SessionRequestDTO dto) {
        if (dto.getEndTime() == null || dto.getStartTime() == null || !dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new InvalidSessionTimeException("endTime must be after startTime.");
        }
        if (dto.getMaxStudents() <= 0) {
            throw new InvalidSessionTimeException("maxStudents must be greater than zero.");
        }
    }

    private void assertOwner(Session session, Long callerUserId) {
        if (!session.getOwnerUserId().equals(callerUserId)) {
            throw new ForbiddenOperationException("Only the session owner can perform this action.");
        }
    }

    private boolean hasActiveBookings(Long sessionId) {
        return false;
    }
}

