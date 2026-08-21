package za.ac.cput.peertutoringsystem.mapper;

import za.ac.cput.peertutoringsystem.dto.SessionResponseDTO;
import za.ac.cput.peertutoringsystem.entity.Session;

public final class SessionMapper {

    private SessionMapper() {
    }

    public static SessionResponseDTO toResponseDTO(Session session) {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setSessionId(session.getSessionId());
        dto.setTutorProfileId(session.getTutorProfileId());
        dto.setOwnerUserId(session.getOwnerUserId());
        dto.setStartTime(session.getStartTime());
        dto.setEndTime(session.getEndTime());
        dto.setLocation(session.getLocation());
        dto.setOnline(session.isOnline());
        dto.setMeetingLink(session.getMeetingLink());
        dto.setMaxStudents(session.getMaxStudents());
        dto.setCurrentStudents(session.getCurrentStudents());
        dto.setStatus(session.getStatus());
        dto.setTopic(session.getTopic());
        return dto;
    }
}

