import { Link } from 'react-router-dom';

function TutorDashboard() {
    return (
        <div className="dashboard-page tutor-dashboard">
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-label">
                        TUTOR PORTAL
                    </span>

                    <h1>Welcome to Your Tutor Dashboard</h1>

                    <p>
                        Manage your tutoring profile, organise your
                        sessions, and help students succeed.
                    </p>
                </div>
            </div>

            <section className="dashboard-section">
                <h2>Your Tutoring Overview</h2>

                <div className="tutor-dashboard-grid">
                    <div className="tutor-dashboard-card">
                        <span className="tutor-card-icon">👤</span>
                        <h3>My Tutor Profile</h3>
                        <p>
                            Tell students about your qualifications,
                            experience, and availability.
                        </p>
                        <Link to="/tutor/profile">
                            Create or manage profile →
                        </Link>
                    </div>

                    <div className="tutor-dashboard-card">
                        <span className="tutor-card-icon">📅</span>
                        <h3>Booking Requests</h3>
                        <p>
                            View and manage requests from students who
                            want tutoring assistance.
                        </p>
                        <Link to="/bookings">
                            View bookings →
                        </Link>
                    </div>

                    <div className="tutor-dashboard-card">
                        <span className="tutor-card-icon">📚</span>
                        <h3>My Sessions</h3>
                        <p>
                            Keep track of your tutoring sessions and
                            upcoming learning activities.
                        </p>
                        <Link to="/sessions">
                            View sessions →
                        </Link>
                    </div>

                    <div className="tutor-dashboard-card">
                        <span className="tutor-card-icon">🎓</span>
                        <h3>My Subjects</h3>
                        <p>
                            Review the subjects you can help students
                            understand.
                        </p>
                        <Link to="/subjects">
                            Manage subjects →
                        </Link>
                    </div>

                    <div className="tutor-dashboard-card">
                        <span className="tutor-card-icon">💬</span>
                        <h3>Messages</h3>
                        <p>
                            Communicate with students about their
                            tutoring needs.
                        </p>
                        <Link to="/messages">
                            Open messages →
                        </Link>
                    </div>

                    <div className="tutor-dashboard-card">
                        <span className="tutor-card-icon">⭐</span>
                        <h3>Student Feedback</h3>
                        <p>
                            Check your reviews and identify ways to
                            improve your tutoring.
                        </p>
                        <Link to="/reviews">
                            View reviews →
                        </Link>
                    </div>
                </div>
            </section>

            <section className="dashboard-section tutor-welcome-section">
                <h2>Get Started</h2>

                <p>
                    New to tutoring on the platform? Start by creating
                    your tutor profile so students can learn about you.
                </p>

                <Link
                    to="/tutor/profile"
                    className="tutor-primary-action"
                >
                    Set Up My Tutor Profile
                </Link>
            </section>
        </div>
    );
}

export default TutorDashboard;