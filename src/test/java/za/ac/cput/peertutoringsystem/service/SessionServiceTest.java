package za.ac.cput.peertutoringsystem.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import za.ac.cput.peertutoringsystem.domain.PricingType;
import za.ac.cput.peertutoringsystem.domain.Session;
import za.ac.cput.peertutoringsystem.dto.SessionRequestDTO;
import za.ac.cput.peertutoringsystem.exception.ForbiddenOperationException;
import za.ac.cput.peertutoringsystem.exception.InvalidSessionTimeException;
import za.ac.cput.peertutoringsystem.exception.SessionHasBookingsException;
import za.ac.cput.peertutoringsystem.repository.BookingRepository;
import za.ac.cput.peertutoringsystem.repository.SessionRepository;
import za.ac.cput.peertutoringsystem.service.impl.SessionServiceImpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private SessionServiceImpl sessionService;

    private SessionRequestDTO validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new SessionRequestDTO();
        validRequest.setTutorProfileId(12L);
        validRequest.setStartTime(
                LocalDateTime.of(2026, 8, 10, 14, 0));
        validRequest.setEndTime(
                LocalDateTime.of(2026, 8, 10, 15, 0));
        validRequest.setLocation("Library Room 4");
        validRequest.setOnline(false);
        validRequest.setMaxStudents(3);
        validRequest.setTopic("Linked Lists");
        validRequest.setPricingType(PricingType.HOURLY);
        validRequest.setPrice(new BigDecimal("150.00"));
    }

    @Test
    void create_throwsWhenEndTimeIsBeforeStartTime() {
        validRequest.setEndTime(
                validRequest.getStartTime().minusMinutes(1));

        assertThrows(
                InvalidSessionTimeException.class,
                () -> sessionService.create(validRequest, 1L));
    }

    @Test
    void create_throwsWhenMaxStudentsIsZeroOrNegative() {
        validRequest.setMaxStudents(0);

        assertThrows(
                IllegalArgumentException.class,
                () -> sessionService.create(validRequest, 1L));
    }

    @Test
    void update_throwsWhenCallerIsNotOwner() {
        Session existing = new Session();
        existing.setSessionId(21L);
        existing.setOwnerUserId(99L);
        existing.setCurrentStudents(0);

        when(sessionRepository.findById(21L))
                .thenReturn(Optional.of(existing));

        assertThrows(
                ForbiddenOperationException.class,
                () -> sessionService.update(21L, validRequest, 1L));
    }

    @Test
    void delete_throwsWhenSessionHasConfirmedBookings() {
        Session existing = new Session();
        existing.setSessionId(21L);
        existing.setOwnerUserId(1L);
        existing.setCurrentStudents(1);
        existing.setMaxStudents(3);

        when(sessionRepository.findById(21L))
                .thenReturn(Optional.of(existing));

        when(bookingRepository
                .existsBySessionIdAndStatusIgnoreCase(21L, "Confirmed"))
                .thenReturn(true);

        assertThrows(
                SessionHasBookingsException.class,
                () -> sessionService.delete(21L, 1L));

        verify(sessionRepository, never()).delete(existing);
    }
}
