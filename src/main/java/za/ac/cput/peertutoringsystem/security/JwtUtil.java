package za.ac.cput.peertutoringsystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    /*
     * This secret key is used to sign and verify JWT tokens.
     *
     * IMPORTANT:
     * In a real production application, this should be stored
     * securely in environment variables or application.properties,
     * not directly in source code.
     */
    private static final String SECRET_KEY =
            "PeerTutoringSystemSecretKeyForJWTAuthentication2026Secure";

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60; // 1 hour

    private final SecretKey key;

    public JwtUtil() {
        this.key = Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    /**
     * Generate a JWT token for an authenticated user.
     */
    public String generateToken(String email, String role) {

        Date now = new Date();

        Date expiration = new Date(
                now.getTime() + EXPIRATION_TIME
        );

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    /**
     * Extract the email/subject from the JWT.
     */
    public String extractEmail(String token) {

        return getClaims(token)
                .getSubject();
    }

    /**
     * Extract the user's role from the JWT.
     */
    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }

    /**
     * Check whether the JWT is still valid.
     */
    public boolean isTokenValid(String token) {

        try {
            getClaims(token);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Parse and verify the JWT.
     */
    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}