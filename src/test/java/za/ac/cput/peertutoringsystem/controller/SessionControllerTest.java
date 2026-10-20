
package za.ac.cput.peertutoringsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import za.ac.cput.peertutoringsystem.domain.User;
import za.ac.cput.peertutoringsystem.dto.SessionRequestDTO;
import za.ac.cput.peertutoringsystem.dto.SessionResponseDTO;
import za.ac.cput.peertutoringsystem.repository.UserRepository;
import za.ac.cput.peertutoringsystem.service.SessionService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SessionService sessionService;

    @Mock
    private UserRepository userRepository;

    private final ObjectMapper objectMapper =
            new ObjectMapper().registerModule(new JavaTimeModule());

    @BeforeEach
    void setUp() {
        SessionController controller =
                new SessionController(sessionService, userRepository);

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        SecurityContextHolder.clearContext();
    }

    @Test
    void getAll_returnsList() throws Exception {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setSessionId(1L);
        dto.setTopic("Test");

        when(sessionService.findAll(null, null))
                .thenReturn(List.of(dto));

        mockMvc.perform(get("/api/sessions")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void create_returnsCreated() throws Exception {
        User user = new User();
        user.setId(5L);
        user.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "test@example.com", null, List.of()
                )
        );

        SessionRequestDTO req = new SessionRequestDTO();
        req.setTutorProfileId(2L);
        req.setStartTime(LocalDateTime.now().plusDays(1));
        req.setEndTime(LocalDateTime.now().plusDays(1).plusHours(1));
        req.setMaxStudents(3);
        req.setTopic("Topic");

        SessionResponseDTO resp = new SessionResponseDTO();
        resp.setSessionId(10L);
        resp.setTopic("Topic");

        when(sessionService.create(any(), anyLong()))
                .thenReturn(resp);

        mockMvc.perform(post("/api/sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }
}
