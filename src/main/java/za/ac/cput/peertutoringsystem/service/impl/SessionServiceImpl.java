
package za.ac.cput.peertutoringsystem.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.peertutoringsystem.domain.Session;
import za.ac.cput.peertutoringsystem.domain.SessionStatus;
import za.ac.cput.peertutoringsystem.dto.SessionRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SessionResponseDTO;
import za.ac.cput.peertutoringsystem.exception.ForbiddenOperationException;
import za.ac.cput.peertutoringsystem.exception.InvalidSessionTimeException;
import za.ac.cput.peertutoringsystem.exception.ResourceNotFoundException;
import za.ac.cput.peertutoringsystem.exception.SessionHasBookingsException;
import za.ac.cput.peertutoringsystem.mapper.SessionMapper;
import za.ac.cput.peertutoringsystem.repository.SessionRepository;
import za.ac.cput.peertutoringsystem.service.SessionService;

import java.util.List;
import java.util.Locale;

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
        return sessionRepository.findAll().stream()
                .filter(session ->
                        status == null || session.getStatus() == status)
                .filter(session ->
                        topic == null
                                || topic.isBlank()
                                || (session.getTopic() != null
                                && session.getTopic().toLowerCase(Locale.ROOT)
                                .contains(topic.trim().toLowerCase(Locale.ROOT))))
                .map(SessionMapper::toResponseDTO)
                .toList();
    }

    @Override
    public SessionResponseDTO create(SessionRequestDTO dto, Long callerUserId) {
        validateCaller(callerUserId);
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
        session.setTopic(dto.getTopic().trim());

        return SessionMapper.toResponseDTO(sessionRepository.save(session));
    }

    @Override
    public SessionResponseDTO update(
            Long id, SessionRequestDTO dto, Long callerUserId) {

        validateCaller(callerUserId);
        validateSessionInput(dto);

        Session session = getSessionById(id);
        assertOwner(session, callerUserId);

        if (dto.getMaxStudents() < session.getCurrentStudents()) {
            throw new IllegalArgumentException(
                    "maxStudents cannot be less than currentStudents.");
        }

        session.setTutorProfileId(dto.getTutorProfileId());
        session.setStartTime(dto.getStartTime());
        session.setEndTime(dto.getEndTime());
        session.setLocation(dto.getLocation());
        session.setOnline(dto.isOnline());
        session.setMeetingLink(dto.getMeetingLink());
        session.setMaxStudents(dto.getMaxStudents());
        session.setTopic(dto.getTopic().trim());

        return SessionMapper.toResponseDTO(sessionRepository.save(session));
    }

    @Override
    public void delete(Long id, Long callerUserId) {
        validateCaller(callerUserId);

        Session session = getSessionById(id);
        assertOwner(session, callerUserId);

        if (hasActiveBookings(session.getSessionId())) {
            throw new SessionHasBookingsException(
                    "Cannot delete session with active bookings.");
        }

        sessionRepository.delete(session);
    }

    @Override
    public void incrementCurrentStudents(Long sessionId) {
        Session session = getSessionById(sessionId);

        if (session.getCurrentStudents() >= session.getMaxStudents()) {
            throw new IllegalStateException(
                    "The session has reached its maximum student capacity.");
        }

        session.setCurrentStudents(session.getCurrentStudents() + 1);
        sessionRepository.save(session);
    }

    @Override
    public void decrementCurrentStudents(Long sessionId) {
        Session session = getSessionById(sessionId);

        if (session.getCurrentStudents() > 0) {
            session.setCurrentStudents(session.getCurrentStudents() - 1);
            sessionRepository.save(session);
        }
    }

    private Session getSessionById(Long id) {
        if (id == null) {
            throw new ResourceNotFoundException("Session ID cannot be null.");
        }

        return sessionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Session not found: " + id));
    }

    private void validateCaller(Long callerUserId) {
        if (callerUserId == null) {
            throw new ForbiddenOperationException(
                    "An authenticated user is required.");
        }
    }

    private void validateSessionInput(SessionRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException(
                    "Session request cannot be null.");
        }

        if (dto.getTutorProfileId() == null) {
            throw new IllegalArgumentException(
                    "Tutor profile ID is required.");
        }

        if (dto.getStartTime() == null
                || dto.getEndTime() == null
                || !dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new InvalidSessionTimeException(
                    "endTime must be after startTime.");
        }

        if (dto.getMaxStudents() <= 0) {
            throw new InvalidSessionTimeException(
                    "maxStudents must be greater than zero.");
        }

        if (dto.getTopic() == null || dto.getTopic().isBlank()) {
            throw new IllegalArgumentException(
                    "Session topic is required.");
        }

        if (dto.isOnline()) {
            if (dto.getMeetingLink() == null
                    || dto.getMeetingLink().isBlank()) {
                throw new IllegalArgumentException(
                        "An online session requires a meeting link.");
            }
        } else {
            if (dto.getLocation() == null || dto.getLocation().isBlank()) {
                throw new IllegalArgumentException(
                        "An in-person session requires a location.");
            }
        }
    }

    private void assertOwner(Session session, Long callerUserId) {
        if (callerUserId == null
                || session.getOwnerUserId() == null
                || !session.getOwnerUserId().equals(callerUserId)) {
            throw new ForbiddenOperationException(
                    "Only the session owner can perform this action.");
        }
    }

    private boolean hasActiveBookings(Long sessionId) {
        // TODO: Connect to the booking repository when available.
        return false;
    }
}
