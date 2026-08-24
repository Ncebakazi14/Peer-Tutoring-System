package za.ac.cput.peertutoringsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.cput.peertutoringsystem.domain.Session;
import za.ac.cput.peertutoringsystem.domain.SessionStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByStatusAndTopicContainingIgnoreCase(SessionStatus status, String topic);

    List<Session> findByStartTimeAfter(LocalDateTime now);
}

