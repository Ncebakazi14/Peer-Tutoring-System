
package za.ac.cput.peertutoringsystem.repository;

import za.ac.cput.peertutoringsystem.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findBySenderEmailAndRecipientEmailOrRecipientEmailAndSenderEmailOrderBySentAtAsc(
            String sender1,
            String recipient1,
            String recipient2,
            String sender2
    );

    List<Message> findBySenderEmailIgnoreCaseOrRecipientEmailIgnoreCaseOrderBySentAtDesc(
            String senderEmail,
            String recipientEmail
    );
}
