import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentApi from "../../api/StudentApi";
import { I, icons } from "../../components/icons";
import bookingApi from "../../services/bookingApi";
import "./StudentDashboard.css";

function StudentDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [loggedInUser] = useState(readLoggedInUser);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSnapshot, setProfileSnapshot] = useState(null);
    const [upcomingBookingCount, setUpcomingBookingCount] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function loadStudent() {
            try {
                const studentId = loggedInUser?.id || 1;
                const data = await StudentApi.getStudentById(studentId);

                if (!cancelled && data) {
                    setStudent(data);
                    persistStudentUser(data, loggedInUser, studentId);
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
    }, [loggedInUser]);

    useEffect(() => {
        let cancelled = false;

        async function loadBookingCount() {
            try {
                const response = await bookingApi.getMy();
                const bookings = Array.isArray(response.data) ? response.data : [];
                const activeStatuses = ["CONFIRMED", "PENDING", "Confirmed", "Pending"];

                if (!cancelled) {
                    setUpcomingBookingCount(
                        bookings.filter((booking) => activeStatuses.includes(booking.status)).length
                    );
                }
            } catch (error) {
                console.error(
                    "Unable to load booking summary:",
                    error.response?.status || error.message
                );
            }
        }

        loadBookingCount();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleProfileChange = (event) => {
        setStudent((currentStudent) => ({
            ...currentStudent,
            [event.target.name]: event.target.value
        }));
    };

    const handleProfileSave = async (event) => {
        event.preventDefault();
        setSavingProfile(true);

        try {
            const updatedStudent = await StudentApi.updateStudent(student);
            setStudent(updatedStudent);
            persistStudentUser(updatedStudent, loggedInUser, student.studentId);
            setEditingProfile(false);
            setProfileSnapshot(null);
        } catch (error) {
            console.error(
                "Unable to update student information:",
                error.response?.status || error.message
            );
            alert("Unable to save your profile changes.");
        } finally {
            setSavingProfile(false);
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

    const firstName =
        student?.firstName ||
        loggedInUser?.firstName ||
        "Student";
    const fullName = `${student?.firstName || loggedInUser?.firstName || ""} ${
        student?.lastName || loggedInUser?.lastName || ""
    }`.trim() || "Not available";
    const email = student?.email || loggedInUser?.email || "Not available";

    if (activeTab === "bookings") {
        return (
            <div className="dashboard-page">
                <div className="dashboard-header">
                    <div>
                        <span className="dashboard-label">STUDENT DASHBOARD</span>
                        <h1>Welcome back, {firstName}! </h1>
                        <p>Here's what's happening with your learning journey.</p>
                    </div>
                    <button
                        type="button"
                        className="profile-button"
                        onClick={() => setActiveTab("dashboard")}
                    >
                        <I size={16}>{icons.dashboard}</I>
                        Dashboard
                    </button>
                </div>
                <MyBookingsView />
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-label">
                        STUDENT DASHBOARD
                    </span>

                    <h1>Welcome back, {firstName}! </h1>

                    <p>
                        Here's what's happening with your learning journey.
                    </p>
                </div>

                <Link to="/student/profile" className="profile-button">
                    <I size={16}>{icons.profile}</I>
                    My Profile
                </Link>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div className="card-icon"><I size={24}>{icons.cap}</I></div>
                    <div>
                        <p>Student ID</p>
                        <h2>{student?.studentId || "—"}</h2>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon"><I size={24}>{icons.profile}</I></div>
                    <div>
                        <p>Account</p>
                        <h2 className="account-active">
                            <span className="status-dot" />
                            {student ? "Active" : "Pending"}
                        </h2>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon"><I size={24}>{icons.sessions}</I></div>
                    <div>
                        <p>Upcoming Sessions</p>
                        <h2>{upcomingBookingCount}</h2>
                        <small>
                            {upcomingBookingCount === 1
                                ? "1 upcoming booking"
                                : `${upcomingBookingCount} upcoming bookings`}
                        </small>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-icon"><I size={24}>{icons.reviews}</I></div>
                    <div>
                        <p>Reviews Given</p>
                        <h2>—</h2>
                        <small>Review summary unavailable</small>
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
                        {!editingProfile ? (
                            <button
                                type="button"
                                className="section-action"
                                onClick={() => {
                                    setProfileSnapshot(student);
                                    setEditingProfile(true);
                                }}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="section-action"
                                onClick={() => {
                                    setStudent(profileSnapshot);
                                    setProfileSnapshot(null);
                                    setEditingProfile(false);
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>

                    {editingProfile ? (
                        <form className="student-overview" onSubmit={handleProfileSave}>
                            <label className="overview-item editable-item">
                                <span>First Name</span>
                                <input
                                    name="firstName"
                                    value={student?.firstName || ""}
                                    onChange={handleProfileChange}
                                    required
                                />
                            </label>

                            <label className="overview-item editable-item">
                                <span>Last Name</span>
                                <input
                                    name="lastName"
                                    value={student?.lastName || ""}
                                    onChange={handleProfileChange}
                                    required
                                />
                            </label>

                            <label className="overview-item editable-item">
                                <span>Email Address</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={student?.email || ""}
                                    onChange={handleProfileChange}
                                    required
                                />
                            </label>

                            <label className="overview-item editable-item">
                                <span>Phone Number</span>
                                <input
                                    name="phoneNumber"
                                    value={student?.phoneNumber || ""}
                                    onChange={handleProfileChange}
                                    placeholder="Enter phone number"
                                />
                            </label>

                            <button
                                type="submit"
                                className="save-profile-button"
                                disabled={savingProfile}
                            >
                                {savingProfile ? "Saving..." : "Save Account Changes"}
                            </button>
                        </form>
                    ) : (
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
                                <strong>{student?.phoneNumber || "Not provided"}</strong>
                            </div>

                            <div className="overview-item">
                                <span>Account Status</span>
                                <strong className="active-text">
                                    {student
                                        ? "● Active Student Record"
                                        : "● Awaiting student record"}
                                </strong>
                            </div>
                        </div>
                    )}
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
                            <span><I size={19}>{icons.browse}</I></span>
                            <div>
                                <strong>Browse Tutors</strong>
                                <p>Find help for your subjects</p>
                            </div>
                        </Link>

                        <button
                            type="button"
                            className="quick-action"
                            onClick={() => setActiveTab("bookings")}
                        >
                            <span><I size={19}>{icons.bookings}</I></span>
                            <div>
                                <strong>My Bookings</strong>
                                <p>View your tutoring bookings</p>
                            </div>
                        </button>

                        <Link to="/sessions" className="quick-action">
                            <span><I size={19}>{icons.sessions}</I></span>
                            <div>
                                <strong>My Sessions</strong>
                                <p>View upcoming sessions</p>
                            </div>
                        </Link>

                        <Link to="/student/profile" className="quick-action">
                            <span><I size={19}>{icons.profile}</I></span>
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
                    <div className="empty-icon"><I size={26}>{icons.sessions}</I></div>
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
                    <div className="empty-icon"><I size={26}>{icons.dashboard}</I></div>
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

export function MyBookingsView() {
    const [filter, setFilter] = useState("upcoming");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadBookings() {
            try {
                const response = await bookingApi.getMy();
                if (!cancelled) {
                    setBookings(Array.isArray(response.data) ? response.data : []);
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(
                        requestError.response?.data?.message ||
                        "Could not load your bookings. Please try again."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadBookings();
        return () => {
            cancelled = true;
        };
    }, []);

    const filteredBookings = bookings.filter((booking) =>
        filter === "upcoming"
            ? !["COMPLETED", "Completed", "CANCELLED", "Cancelled"].includes(booking.status)
            : ["COMPLETED", "Completed"].includes(booking.status)
    );

    const cancelBooking = async (id) => {
        try {
            await bookingApi.remove(id);
            setBookings((current) => current.filter((booking) => booking.id !== id));
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Could not cancel this booking."
            );
        }
    };

    return (
        <div className="bookings-view">
            <div className="bookings-heading">
                <div>
                    <span className="dashboard-label">APPOINTMENTS</span>
                    <h1>My Bookings</h1>
                    <p>Manage and track your tutoring session appointments.</p>
                </div>
                <div className="bookings-heading-actions">
                    <Link to="/tutors" className="booking-add">
                        Add Booking
                    </Link>
                    <div className="booking-filters">
                        <button
                            type="button"
                            className={filter === "upcoming" ? "active" : ""}
                            onClick={() => setFilter("upcoming")}
                        >
                            Upcoming / Active
                        </button>
                        <button
                            type="button"
                            className={filter === "past" ? "active" : ""}
                            onClick={() => setFilter("past")}
                        >
                            Past Sessions
                        </button>
                    </div>
                </div>
            </div>

            <div className="booking-list">
                {loading ? (
                    <div className="booking-empty">
                        <h3>Loading your bookings...</h3>
                    </div>
                ) : error ? (
                    <div className="booking-empty booking-error">
                        <h3>Bookings unavailable</h3>
                        <p>{error}</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="booking-empty">
                        <div className="empty-icon"><I size={26}>{icons.bookings}</I></div>
                        <h3>No bookings found</h3>
                        <p>You have no {filter} tutoring sessions at the moment.</p>
                        <Link to="/tutors" className="booking-add booking-add-empty">
                            Find a tutor and add a booking
                        </Link>
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <article className="booking-card" key={booking.id}>
                            <div className="booking-info">
                                <img src={booking.avatar} alt="" className="booking-avatar" />
                                <div>
                                    <div className="booking-meta">
                                        <span className={`booking-status ${booking.status.toLowerCase().replaceAll(" ", "-")}`}>
                                            {booking.status}
                                        </span>
                                        <span>{booking.duration}</span>
                                    </div>
                                    <h2>{booking.subject || "Tutoring session"}</h2>
                                    <p>Tutor: <strong>{booking.tutorName}</strong></p>
                                    <p className="booking-time">
                                        <I size={14}>{icons.sessions}</I>
                                        {booking.bookingDate} at {booking.bookingTime}
                                    </p>
                                </div>
                            </div>

                            <div className="booking-actions">
                                <div className="booking-price">
                                    <span>Total Fee</span>
                                    <strong>R{booking.amount}</strong>
                                </div>
                                {["CONFIRMED", "Confirmed"].includes(booking.status) && (
                                    <button type="button" className="booking-primary">
                                        Join Session
                                    </button>
                                )}
                                {!["COMPLETED", "Completed", "CANCELLED", "Cancelled"].includes(booking.status) && (
                                    <button
                                        type="button"
                                        className="booking-cancel"
                                        onClick={() => cancelBooking(booking.id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                                {["COMPLETED", "Completed"].includes(booking.status) && (
                                    <button type="button" className="booking-review">
                                        Leave Review
                                    </button>
                                )}
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;

function readLoggedInUser() {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        return user && typeof user === "object" ? user : null;
    } catch {
        return null;
    }

    function persistStudentUser(student, currentUser, fallbackId) {
        try {
            localStorage.setItem("user", JSON.stringify({
                ...(currentUser || {}),
                id: student.studentId || fallbackId,
                firstName: student.firstName || currentUser?.firstName || "",
                lastName: student.lastName || currentUser?.lastName || "",
                email: student.email || currentUser?.email || "",
            }));
        } catch {
            // The dashboard continues to use the API response for this render.
        }
    }
}