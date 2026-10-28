import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentApi from "../../api/StudentApi";
import "./StudentDashboard.css";

function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadStudent() {
            try {
                const data = await StudentApi.getStudentById(1);

                if (!cancelled && data) {
                    setStudent(data);
                }
            } catch (error) {
                console.error(
                    "Unable to load student information:",
                    error.response?.status || error.message
                );
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadStudent();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="loading-message">
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    const firstName = student?.firstName || "Student";
    const fullName = student
        ? `${student.firstName || ""} ${student.lastName || ""}`.trim()
        : "Not available";
    const email = student?.email || "Not available";

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-label">
                        STUDENT DASHBOARD
                    </span>

                    <h1>Welcome back, {firstName}! 👋</h1>

                    <p>
                        Here's what's happening with your learning journey.
                    </p>
                </div>

                <Link to="/student/profile" className="profile-button">
                    👤 My Profile
                </Link>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div className="card-icon">🎓</div>
                    <div>
                        <p>Student ID</p>
                        <h2>{student?.studentId || "—"}</h2>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">👤</div>
                    <div>
                        <p>Account</p>
                        <h2>{student ? "Available" : "Pending"}</h2>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">📚</div>
                    <div>
                        <p>Upcoming Sessions</p>
                        <h2>—</h2>
                        <small>Session information not connected yet</small>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon">⭐</div>
                    <div>
                        <p>Reviews Given</p>
                        <h2>—</h2>
                        <small>Review information not connected yet</small>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2>Learning Overview</h2>
                            <p>Your student account information</p>
                        </div>
                        <Link to="/student/profile">View Profile</Link>
                    </div>

                    <div className="student-overview">
                        <div className="overview-item">
                            <span>Full Name</span>
                            <strong>{fullName}</strong>
                        </div>

                        <div className="overview-item">
                            <span>Email Address</span>
                            <strong>{email}</strong>
                        </div>

                        <div className="overview-item">
                            <span>Phone Number</span>
                            <strong>Not provided</strong>
                        </div>

                        <div className="overview-item">
                            <span>Account Status</span>
                            <strong className="active-text">
                                {student
                                    ? "● Student record available"
                                    : "● Awaiting student record"}
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2>Quick Actions</h2>
                            <p>Start learning</p>
                        </div>
                    </div>

                    <div className="quick-actions">
                        <Link to="/tutors" className="quick-action">
                            <span>🔍</span>
                            <div>
                                <strong>Browse Tutors</strong>
                                <p>Find help for your subjects</p>
                            </div>
                        </Link>

                        <Link to="/bookings" className="quick-action">
                            <span>📅</span>
                            <div>
                                <strong>My Bookings</strong>
                                <p>View your tutoring bookings</p>
                            </div>
                        </Link>

                        <Link to="/sessions" className="quick-action">
                            <span>📚</span>
                            <div>
                                <strong>My Sessions</strong>
                                <p>View upcoming sessions</p>
                            </div>
                        </Link>

                        <Link to="/student/profile" className="quick-action">
                            <span>👤</span>
                            <div>
                                <strong>My Profile</strong>
                                <p>Update your personal information</p>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>

            <section className="dashboard-section learning-section">
                <div className="section-header">
                    <div>
                        <h2>Upcoming Sessions</h2>
                        <p>Your scheduled tutoring sessions</p>
                    </div>
                    <Link to="/sessions">View All</Link>
                </div>

                <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h3>No sessions available yet</h3>
                    <p>
                        Once you book a tutoring session, your upcoming
                        sessions will appear here.
                    </p>
                    <Link to="/tutors" className="primary-button">
                        Find a Tutor
                    </Link>
                </div>
            </section>

            <section className="dashboard-section learning-section">
                <div className="section-header">
                    <div>
                        <h2>Recent Activity</h2>
                        <p>Keep track of your tutoring activity</p>
                    </div>
                </div>

                <div className="activity-empty">
                    <div className="empty-icon">📊</div>
                    <h3>Your learning journey starts here</h3>
                    <p>
                        Book your first tutoring session to start building
                        your learning activity.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default StudentDashboard;