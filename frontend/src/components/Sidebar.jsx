
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { I, icons } from "./icons";

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
            icon: "dashboard",
            label: "Dashboard",
        },
        {
            to: "/student/profile",
            icon: "profile",
            label: "My Profile",
        },
        {
            to: "/tutors",
            icon: "browse",
            label: "Browse Tutors",
        },
        {
            to: "/sessions",
            icon: "sessions",
            label: "My Sessions",
        },
        {
            to: "/bookings",
            icon: "bookings",
            label: "My Bookings",
        },
        {
            to: "/reviews",
            icon: "reviews",
            label: "My Reviews",
        },
        {
            to: "/messages",
            icon: "messages",
            label: "Messages",
        },
        {
            to: "/settings",
            icon: "settings",
            label: "Settings",
        },
    ];

    const tutorNavItems = [
        {
            to: "/tutor/dashboard",
            icon: "dashboard",
            label: "Dashboard",
        },
        {
            to: "/tutor/profile",
            icon: "profile",
            label: "My Tutor Profile",
        },
        {
            to: "/sessions",
            icon: "sessions",
            label: "My Sessions",
        },
        {
            to: "/bookings",
            icon: "bookings",
            label: "Booking Requests",
        },
        {
            to: "/subjects",
            icon: "subjects",
            label: "My Subjects",
        },
        {
            to: "/messages",
            icon: "messages",
            label: "Messages",
        },
        {
            to: "/settings",
            icon: "settings",
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
                            <I size={18}>{icons[item.icon]}</I>
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
                        <I size={18}>{icons.logout}</I>
                    </span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
