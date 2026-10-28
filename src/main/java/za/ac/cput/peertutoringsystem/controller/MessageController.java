
package za.ac.cput.peertutoringsystem.controller;

import za.ac.cput.peertutoringsystem.domain.Message;
import za.ac.cput.peertutoringsystem.repository.MessageRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping("/conversations")
    public List<ConversationSummary> getConversations(
            Authentication authentication) {

        String currentEmail = getCurrentEmail(authentication);

        List<Message> allMessages =
                messageRepository
                        .findBySenderEmailIgnoreCaseOrRecipientEmailIgnoreCaseOrderBySentAtDesc(
                                currentEmail,
                                currentEmail
                        );

        Map<String, ConversationSummary> conversations =
                new LinkedHashMap<>();

        for (Message message : allMessages) {
            String otherEmail;

            if (message.getSenderEmail().equalsIgnoreCase(currentEmail)) {
                otherEmail = message.getRecipientEmail();
            } else {
                otherEmail = message.getSenderEmail();
            }

            String key = otherEmail.toLowerCase(Locale.ROOT);

            // Messages are ordered newest first, so the first one
            // encountered for each person is their latest message.
            conversations.putIfAbsent(
                    key,
                    new ConversationSummary(
                            otherEmail,
                            message.getContent(),
                            message.getSentAt()
                    )
            );
        }

        return new ArrayList<>(conversations.values());
    }

    @GetMapping("/{otherEmail}")
    public List<Message> getConversation(
            @PathVariable String otherEmail,
            Authentication authentication) {

        String currentEmail = getCurrentEmail(authentication);

        return messageRepository
                .findBySenderEmailAndRecipientEmailOrRecipientEmailAndSenderEmailOrderBySentAtAsc(
                        currentEmail,
                        otherEmail,
                        currentEmail,
                        otherEmail
                );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Message sendMessage(
            @RequestBody SendMessageRequest request,
            Authentication authentication) {

        String currentEmail = getCurrentEmail(authentication);

        if (request == null
                || request.recipientEmail == null
                || request.recipientEmail.isBlank()
                || request.content == null
                || request.content.isBlank()
                || request.content.trim().length() > 3000) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Enter a recipient and a message of 1–3000 characters."
            );
        }

        String recipientEmail = request.recipientEmail.trim();
        String content = request.content.trim();

        if (currentEmail.equalsIgnoreCase(recipientEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot message yourself."
            );
        }

        Message message = new Message();
        message.setSenderEmail(currentEmail);
        message.setRecipientEmail(recipientEmail);
        message.setContent(content);

        return messageRepository.save(message);
    }

    private String getCurrentEmail(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null
                || authentication.getName().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please log in again."
            );
        }

        return authentication.getName();
    }

    public static class ConversationSummary {
        private final String email;
        private final String latestMessage;
        private final java.time.LocalDateTime sentAt;

        public ConversationSummary(
                String email,
                String latestMessage,
                java.time.LocalDateTime sentAt) {
            this.email = email;
            this.latestMessage = latestMessage;
            this.sentAt = sentAt;
        }

        public String getEmail() {
            return email;
        }

        public String getLatestMessage() {
            return latestMessage;
        }

        public java.time.LocalDateTime getSentAt() {
            return sentAt;
        }
    }

    public static class SendMessageRequest {
        public String recipientEmail;
        public String content;
    }
}
