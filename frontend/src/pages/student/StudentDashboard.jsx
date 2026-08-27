import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentApi from "../../api/StudentApi";
import "./StudentDashboard.css";

function StudentDashboard() {

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudent();
    }, []);

    const loadStudent = async () => {
        try {
            const data = await StudentApi.getStudentById(1);
            setStudent(data);
        } catch (error) {
            console.error("Error loading student:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="loading-message">
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="dashboard-page">
                <div className="error-message">
                    Unable to load student information.
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* HEADER */}
            <div className="dashboard-header">

                <div>
                    <span className="dashboard-label">
                        STUDENT DASHBOARD
                    </span>

                    <h1>
                        Welcome back, {student.firstName}! 👋
                    </h1>

                    <p>
                        Here's what's happening with your learning journey.
                    </p>
                </div>

                <Link
                    to="/student/profile"
                    className="profile-button"
                >
                    👤 My Profile
                </Link>

            </div>


            {/* STUDENT INFORMATION CARDS */}
            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <div className="card-icon">
                        🎓
                    </div>

                    <div>
                        <p>Student ID</p>

                        <h2>
                            #{student.studentId}
                        </h2>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="card-icon">
                        👤
                    </div>

                    <div>
                        <p>Account</p>

                        <h2>
                            {student.active ? "Active" : "Inactive"}
                        </h2>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="card-icon">
                        📚
                    </div>

                    <div>
                        <p>Upcoming Sessions</p>

                        <h2>
                            —
                        </h2>

                        <small>
                            Sessions API pending
                        </small>
                    </div>

                </div>


                <div className="dashboard-card">

                    <div className="card-icon">
                        ⭐
                    </div>

                    <div>
                        <p>Reviews Given</p>

                        <h2>
                            —
                        </h2>

                        <small>
                            Reviews API pending
                        </small>
                    </div>

                </div>

            </div>


            {/* MAIN DASHBOARD */}
            <div className="dashboard-grid">

                {/* LEARNING OVERVIEW */}
                <section className="dashboard-section">

                    <div className="section-header">

                        <div>
                            <h2>Learning Overview</h2>

                            <p>
                                Your student account information
                            </p>
                        </div>

                        <Link to="/student/profile">
                            View Profile
                        </Link>

                    </div>


                    <div className="student-overview">

                        <div className="overview-item">
                            <span>Full Name</span>

                            <strong>
                                {student.firstName} {student.lastName}
                            </strong>
                        </div>


                        <div className="overview-item">
                            <span>Email Address</span>

                            <strong>
                                {student.email}
                            </strong>
                        </div>


                        <div className="overview-item">
                            <span>Phone Number</span>

                            <strong>
                                {student.phoneNumber || "Not provided"}
                            </strong>
                        </div>


                        <div className="overview-item">
                            <span>Account Status</span>

                            <strong className="active-text">
                                ● {student.active ? "Active" : "Inactive"}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* QUICK ACTIONS */}
                <section className="dashboard-section">

                    <div className="section-header">

                        <div>
                            <h2>Quick Actions</h2>

                            <p>
                                Start learning
                            </p>
                        </div>

                    </div>


                    <div className="quick-actions">

                        <Link
                            to="/tutors"
                            className="quick-action"
                        >
                            <span>🔍</span>

                            <div>
                                <strong>Browse Tutors</strong>

                                <p>
                                    Find help for your subjects
                                </p>
                            </div>
                        </Link>


                        <Link
                            to="/bookings"
                            className="quick-action"
                        >
                            <span>📅</span>

                            <div>
                                <strong>My Bookings</strong>

                                <p>
                                    View your tutoring bookings
                                </p>
                            </div>
                        </Link>


                        <Link
                            to="/sessions"
                            className="quick-action"
                        >
                            <span>📚</span>

                            <div>
                                <strong>My Sessions</strong>

                                <p>
                                    View upcoming sessions
                                </p>
                            </div>
                        </Link>


                        <Link
                            to="/student/profile"
                            className="quick-action"
                        >
                            <span>👤</span>

                            <div>
                                <strong>My Profile</strong>

                                <p>
                                    Update your personal information
                                </p>
                            </div>
                        </Link>

                    </div>

                </section>

            </div>


            {/* UPCOMING SESSIONS */}
            <section className="dashboard-section learning-section">

                <div className="section-header">

                    <div>
                        <h2>Upcoming Sessions</h2>

                        <p>
                            Your scheduled tutoring sessions
                        </p>
                    </div>

                    <Link to="/sessions">
                        View All
                    </Link>

                </div>


                <div className="empty-state">

                    <div className="empty-icon">
                        📚
                    </div>

                    <h3>
                        No sessions available yet
                    </h3>

                    <p>
                        Once you book a tutoring session,
                        your upcoming sessions will appear here.
                    </p>

                    <Link
                        to="/tutors"
                        className="primary-button"
                    >
                        Find a Tutor
                    </Link>

                </div>

            </section>


            {/* RECENT ACTIVITY */}
            <section className="dashboard-section learning-section">

                <div className="section-header">

                    <div>
                        <h2>Recent Activity</h2>

                        <p>
                            Keep track of your tutoring activity
                        </p>
                    </div>

                </div>


                <div className="activity-empty">

                    <div className="empty-icon">
                        📈
                    </div>

                    <h3>
                        Your learning journey starts here
                    </h3>

                    <p>
                        Book your first tutoring session to start
                        building your learning activity.
                    </p>

                </div>

            </section>

        </div>
    );
}

export default StudentDashboard;