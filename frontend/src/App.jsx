import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/AppLayout";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Redirect homepage to Student Dashboard */}
                <Route
                    path="/"
                    element={<Navigate to="/student/dashboard" replace />}
                />

                {/* Main application layout */}
                <Route element={<AppLayout />}>

                    {/* Student */}
                    <Route
                        path="/student/dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/student/profile"
                        element={<StudentProfile />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;