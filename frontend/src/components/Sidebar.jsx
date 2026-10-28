
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const getUserRole = () => {
        const token = localStorage.getItem("token");

        if (!token) return "STUDENT";

        try {
            const payloadPart = token.split(".")[1];

            if (!payloadPart) return "STUDENT";

            const base64 = payloadPart
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const paddedBase64 = base64.padEnd(
                Math.ceil(base64.length / 4) * 4,
                "="
            );

            const payload = JSON.parse(atob(paddedBase64));
            const rawRole =
                payload.role ??
                payload.roles ??
                payload.authorities ??
                payload.authority;

            const roleValue = Array.isArray(rawRole)
                ? rawRole.join(" ")
                : rawRole;

            return String(roleValue ?? "STUDENT")
                .replace(/ROLE_/gi, "")
                .toUpperCase();
        } catch (error) {
            console.error("Could not read user role:", error);
            return "STUDENT";
        }
    };

    const role = getUserRole();
    const isTutor = role.includes("TUTOR");

    const studentNavItems = [
        {
            to: "/student/dashboard",
            icon: "🏠",
            label: "Dashboard",
        },
        {
            to: "/student/profile",
            icon: "👤",
            label: "My Profile",
        },
        {
            to: "/tutors",
            icon: "🎓",
            label: "Browse Tutors",
        },
        {
            to: "/sessions",
            icon: "📚",
            label: "My Sessions",
        },
        {
            to: "/bookings",
            icon: "📅",
            label: "My Bookings",
        },
        {
            to: "/reviews",
            icon: "⭐",
            label: "My Reviews",
        },
        {
            to: "/messages",
            icon: "💬",
            label: "Messages",
        },
        {
            to: "/settings",
            icon: "⚙️",
            label: "Settings",
        },
    ];

    const tutorNavItems = [
        {
            to: "/tutor/dashboard",
            icon: "🏠",
            label: "Dashboard",
        },
        {
            to: "/tutor/profile",
            icon: "👤",
            label: "My Tutor Profile",
        },
        {
            to: "/sessions",
            icon: "📚",
            label: "My Sessions",
        },
        {
            to: "/bookings",
            icon: "📅",
            label: "Booking Requests",
        },
        {
            to: "/subjects",
            icon: "🎓",
            label: "My Subjects",
        },
        {
            to: "/messages",
            icon: "💬",
            label: "Messages",
        },
        {
            to: "/settings",
            icon: "⚙️",
            label: "Settings",
        },
    ];

    const navItems = isTutor ? tutorNavItems : studentNavItems;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    };

    return (
        <aside className="sidebar">
            <div className="logo">
                <h2>Peer Tutoring</h2>
                <p>Learn. Share. Succeed.</p>
                <span>
                    {isTutor ? "TUTOR PORTAL" : "STUDENT PORTAL"}
                </span>
            </div>

            <nav className="nav-links">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        <span className="nav-icon" aria-hidden="true">
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <span className="nav-icon" aria-hidden="true">
                        🚪
                    </span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
