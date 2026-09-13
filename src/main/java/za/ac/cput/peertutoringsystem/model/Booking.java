package za.ac.cput.peertutoringsystem.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "bookings")
public class Booking implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tutorId;

    @Column(nullable = false)
    private String tutorName;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private String bookingDate;

    @Column(nullable = false)
    private String bookingTime;

    @Column(nullable = false)
    private String sessionType;

    @Column(nullable = false)
    private String status = "Confirmed";

    public Booking() {
    }

    public Booking(String tutorId, String tutorName, String subject, double amount,
                   String bookingDate, String bookingTime, String sessionType, String status) {
        this.tutorId = tutorId;
        this.tutorName = tutorName;
        this.subject = subject;
        this.amount = amount;
        this.bookingDate = bookingDate;
        this.bookingTime = bookingTime;
        this.sessionType = sessionType;
        this.status = status != null ? status : "Confirmed";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTutorId() {
        return tutorId;
    }

    public void setTutorId(String tutorId) {
        this.tutorId = tutorId;
    }

    public String getTutorName() {
        return tutorName;
    }

    public void setTutorName(String tutorName) {
        this.tutorName = tutorName;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(String bookingTime) {
        this.bookingTime = bookingTime;
    }

    public String getSessionType() {
        return sessionType;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
