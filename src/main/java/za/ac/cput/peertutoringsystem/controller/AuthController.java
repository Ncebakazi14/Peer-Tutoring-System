package za.ac.cput.peertutoringsystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import za.ac.cput.peertutoringsystem.domain.User;
import za.ac.cput.peertutoringsystem.dto.AuthResponse;
import za.ac.cput.peertutoringsystem.dto.LoginRequest;
import za.ac.cput.peertutoringsystem.dto.RegisterRequest;
import za.ac.cput.peertutoringsystem.factory.UserFactory;
import za.ac.cput.peertutoringsystem.security.JwtUtil;
import za.ac.cput.peertutoringsystem.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService service;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(
            UserService service,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.service = service;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {

        User user = UserFactory.createUser(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        return service.save(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = service.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Incorrect password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(token);
    }
}