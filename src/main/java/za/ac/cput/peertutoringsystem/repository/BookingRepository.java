
package za.ac.cput.peertutoringsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.peertutoringsystem.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    boolean existsBySessionIdAndStatusIgnoreCase(
            Long sessionId,
            String status
    );

    boolean existsBySessionIdAndStudentIdAndStatusIgnoreCase(
            Long sessionId,
            Long studentId,
            String status
    );
}
