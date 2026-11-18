import { MyBookingsView } from "./student/StudentDashboard";
import BookingRequestsView from "./tutor/BookingRequestsView";

export default function Bookings() {
    const isTutor = (() => {
        try {
            const token = localStorage.getItem("token");
            const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};
            const role = payload.role || payload.roles?.[0] || payload.authorities?.[0] || "";
            return String(role).replace(/^ROLE_/i, "").toUpperCase() === "TUTOR";
        } catch {
            return false;
        }
    })();

    return (
        <main className="bookings-route-page">
            {isTutor ? <BookingRequestsView /> : <MyBookingsView />}
        </main>
    );
}
