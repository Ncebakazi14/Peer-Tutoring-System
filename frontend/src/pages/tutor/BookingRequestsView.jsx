import { useEffect, useState } from "react";
import bookingApi from "../../services/bookingApi";
import "./BookingRequestsView.css";

export default function BookingRequestsView() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadRequests() {
            try {
                const response = await bookingApi.getRequests();
                if (!cancelled) setRequests(Array.isArray(response.data) ? response.data : []);
            } catch (requestError) {
                if (!cancelled) {
                    const status = requestError.response?.status;
                    setError(
                        status === 401 || status === 403
                            ? "Your tutor login session has expired. Please sign in again."
                            : requestError.response?.data?.message ||
                              "Could not load booking requests. Please restart the backend if it was recently updated."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadRequests();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="booking-requests-view">
            <header className="booking-requests-heading">
                <div>
                    <span className="dashboard-label">TUTOR PORTAL</span>
                    <h1>Booking Requests</h1>
                    <p>Review students who booked your tutoring sessions.</p>
                </div>
                <span className="booking-request-count">
                    {requests.length} {requests.length === 1 ? "request" : "requests"}
                </span>
            </header>

            {loading && <div className="booking-request-state">Loading booking requests...</div>}
            {!loading && error && (
                <div className="booking-request-state booking-request-error" role="alert">
                    {error}
                </div>
            )}
            {!loading && !error && requests.length === 0 && (
                <div className="booking-request-state">
                    <h2>No booking requests yet</h2>
                    <p>New student bookings for your sessions will appear here.</p>
                </div>
            )}

            {!loading && !error && requests.length > 0 && (
                <div className="booking-request-list">
                    {requests.map((request) => (
                        <article className="booking-request-card" key={request.id}>
                            <div>
                                <span className="booking-request-status">
                                    {request.status || "Pending"}
                                </span>
                                <h2>{request.subject || "Tutoring session"}</h2>
                                <p className="booking-request-student">
                                    Student ID: {request.studentId || "Unavailable"}
                                </p>
                                <p>
                                    {request.bookingDate} at {request.bookingTime}
                                    {" · "}
                                    {request.sessionType || "Session"}
                                </p>
                            </div>
                            <div className="booking-request-details">
                                <span>Session ID</span>
                                <strong>#{request.sessionId}</strong>
                                <span>Booking fee</span>
                                <strong>R{request.amount ?? "0.00"}</strong>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
