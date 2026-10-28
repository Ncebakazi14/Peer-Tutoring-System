-- Create Database
CREATE DATABASE IF NOT EXISTS peer_tutoring_system;
USE peer_tutoring_system;

-- 1. Roles Table (Matches Role.java domain)
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Students / Users Table (Matches StudentController / AuthController)
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student-Roles Junction Table (Many-to-Many relationship)
CREATE TABLE student_roles (
    student_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (student_id, role_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. Tutoring Sessions Table (Matches Session aggregate / SessionController)
CREATE TABLE sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    tutor_id BIGINT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    status VARCHAR(30) DEFAULT 'SCHEDULED', -- e.g., SCHEDULED, COMPLETED, CANCELLED
    FOREIGN KEY (tutor_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 5. Bookings Table (Matches BookingController)
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'CONFIRMED', -- e.g., CONFIRMED, CANCELLED
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);