
package za.ac.cput.peertutoringsystem.service;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import za.ac.cput.peertutoringsystem.domain.PricingType;
import za.ac.cput.peertutoringsystem.domain.Session;
import za.ac.cput.peertutoringsystem.domain.SessionStatus;
import za.ac.cput.peertutoringsystem.domain.User;
import za.ac.cput.peertutoringsystem.model.Booking;
import za.ac.cput.peertutoringsystem.repository.BookingRepository;
import za.ac.cput.peertutoringsystem.repository.SessionRepository;
import za.ac.cput.peertutoringsystem.repository.UserRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class BookingService {

    private static final String CONFIRMED = "Confirmed";

    private final BookingRepository bookingRepository;
    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            SessionRepository sessionRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        Long studentId = getAuthenticatedUserId();

        return bookingRepository.findAll()
                .stream()
                .filter(booking ->
                        studentId.equals(booking.getStudentId()))
                .toList();
    }

    public Booking createBooking(Booking booking) {
        Long studentId = getAuthenticatedUserId();

        if (booking == null || booking.getSessionId() == null) {
            throw new IllegalArgumentException(
                    "Booking details and session ID are required.");
        }

        Session session = sessionRepository.findById(booking.getSessionId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Session not found: " + booking.getSessionId()));

        if (session.getStatus() != SessionStatus.SCHEDULED) {
            throw new IllegalStateException(
                    "Only scheduled sessions can be booked.");
        }

        if (session.getStartTime() == null
                || session.getEndTime() == null
                || !session.getEndTime().isAfter(session.getStartTime())) {
            throw new IllegalStateException(
                    "The session has an invalid start or end time.");
        }

        if (session.getMaxStudents() <= 0
                || session.getCurrentStudents() >= session.getMaxStudents()) {
            throw new IllegalStateException(
                    "The session has reached its maximum student capacity.");
        }

        if (studentId.equals(session.getOwnerUserId())) {
            throw new IllegalStateException(
                    "You cannot book your own session.");
        }

        if (bookingRepository
                .existsBySessionIdAndStudentIdAndStatusIgnoreCase(
                        session.getSessionId(), studentId, CONFIRMED)) {
            throw new IllegalStateException(
                    "You already have a confirmed booking for this session.");
        }

        if (session.getPricingType() == null
                || session.getPrice() == null
                || session.getPrice().signum() <= 0) {
            throw new IllegalStateException(
                    "The session must have a valid price and pricing type.");
        }

        BigDecimal amount = calculateAmount(session);

        // Resolve the session owner from the database rather than trusting
        // tutor details sent by the client.
        User tutor = userRepository.findById(session.getOwnerUserId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Session owner not found: " + session.getOwnerUserId()));

        if (tutor.getRole() == null
                || !"TUTOR".equalsIgnoreCase(tutor.getRole().name())) {
            throw new IllegalStateException(
                    "The session owner must have the TUTOR role.");
        }

        // Derive booking details from trusted backend data.
        booking.setStudentId(studentId);
        booking.setTutorId(tutor.getId().toString());
        booking.setTutorName(
                (tutor.getFirstName() == null ? "" : tutor.getFirstName())
                        + (tutor.getLastName() == null
                        || tutor.getLastName().isBlank()
                        ? ""
                        : " " + tutor.getLastName()));

        booking.setSubject(session.getTopic());
        booking.setAmount(amount);
        booking.setBookingDate(session.getStartTime()
                .toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE));
        booking.setBookingTime(session.getStartTime()
                .toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")));
        booking.setSessionType(session.isOnline() ? "Online" : "In-person");
        booking.setStatus(CONFIRMED);

        Booking savedBooking = bookingRepository.save(booking);

        session.setCurrentStudents(session.getCurrentStudents() + 1);
        sessionRepository.save(session);

        return savedBooking;
    }

    private BigDecimal calculateAmount(Session session) {
        BigDecimal price = session.getPrice();

        return switch (session.getPricingType()) {
            case FIXED_SESSION -> price.setScale(2, RoundingMode.HALF_UP);

            case HOURLY -> {
                long minutes = Duration.between(
                        session.getStartTime(),
                        session.getEndTime()).toMinutes();

                if (minutes <= 0) {
                    throw new IllegalStateException(
                            "The session duration must be positive.");
                }

                BigDecimal hours = BigDecimal.valueOf(minutes)
                        .divide(BigDecimal.valueOf(60), 8,
                                RoundingMode.HALF_UP);

                yield price.multiply(hours)
                        .setScale(2, RoundingMode.HALF_UP);
            }
        };
    }

    public void deleteBooking(Long id) {
        Long studentId = getAuthenticatedUserId();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Booking not found: " + id));

        if (!studentId.equals(booking.getStudentId())) {
            throw new AccessDeniedException(
                    "You can only delete your own bookings.");
        }

        if (CONFIRMED.equalsIgnoreCase(booking.getStatus())) {
            Session session = sessionRepository
                    .findById(booking.getSessionId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Session not found: " + booking.getSessionId()));

            if (session.getCurrentStudents() > 0) {
                session.setCurrentStudents(
                        session.getCurrentStudents() - 1);
                sessionRepository.save(session);
            }
        }

        bookingRepository.delete(booking);
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getPrincipal() == null
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AccessDeniedException(
                    "You must be logged in to manage bookings.");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException(
                        "Authenticated user was not found."));

        return user.getId();
    }
}
