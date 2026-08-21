package za.ac.cput.peertutoringsystem.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import za.ac.cput.peertutoringsystem.entity.Session;
import za.ac.cput.peertutoringsystem.entity.SessionStatus;

import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:session_repo_test;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.driverClassName=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class SessionRepositoryTest {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @Transactional
    void findByStartTimeAfter_returnsOnlyFutureSessions() {
        LocalDateTime now = LocalDateTime.now();
        entityManager.persist(buildSession(1L, 1L, now.minusHours(2), now.minusHours(1), "Past Session"));
        entityManager.persist(buildSession(2L, 2L, now.plusHours(2), now.plusHours(3), "Future Session"));
        entityManager.flush();

        List<Session> result = sessionRepository.findByStartTimeAfter(now);
        assertEquals(1, result.size());
        assertEquals("Future Session", result.get(0).getTopic());
    }

    private Session buildSession(Long tutorProfileId, Long ownerUserId, LocalDateTime start, LocalDateTime end, String topic) {
        Session session = new Session();
        session.setTutorProfileId(tutorProfileId);
        session.setOwnerUserId(ownerUserId);
        session.setStartTime(start);
        session.setEndTime(end);
        session.setLocation("Room A");
        session.setOnline(false);
        session.setMeetingLink(null);
        session.setMaxStudents(3);
        session.setCurrentStudents(0);
        session.setStatus(SessionStatus.SCHEDULED);
        session.setTopic(topic);
        return session;
    }
}
