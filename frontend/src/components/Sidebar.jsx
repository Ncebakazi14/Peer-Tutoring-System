import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="logo">
                <h2>Peer Tutoring</h2>
                <p>Learn. Share. Succeed.</p>
            </div>

            <nav className="nav-links">

                {/* Your main Student feature */}
                <NavLink to="/student/dashboard">
                    🏠 <span>Dashboard</span>
                </NavLink>
                <NavLink to="/student/profile">
                    👤 <span>My Profile</span>
                </NavLink>
                {/* Member 3 - Tutor / Subject */}
                <NavLink to="/tutors">
                    👨‍🏫 <span>Browse Tutors</span>
                </NavLink>

                {/* Member 4 - Sessions */}
                <NavLink to="/sessions">
                    📚 <span>My Sessions</span>
                </NavLink>

                {/* Member 5 - Bookings */}
                <NavLink to="/bookings">
                    📅 <span>My Bookings</span>
                </NavLink>

                {/* Member 6 - Reviews */}
                <NavLink to="/reviews">
                    ⭐ <span>My Reviews</span>
                </NavLink>

                {/* Future shared features */}
                <NavLink to="/messages">
                    💬 <span>Messages</span>
                </NavLink>

                <NavLink to="/notifications">
                    🔔 <span>Notifications</span>
                </NavLink>

                <NavLink to="/settings">
                    ⚙️ <span>Settings</span>
                </NavLink>

            </nav>

            <div className="sidebar-bottom">

                <button className="logout-btn">
                    🚪 Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;