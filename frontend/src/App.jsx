
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import AppLayout from './components/AppLayout';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import BrowseTutors from './pages/student/BrowseTutors';
import StudentMySessions from './pages/student/MySessions';

import TutorProfile from './pages/tutor/TutorProfile';
import TutorDashboard from './pages/tutor/TutorDashboard';
import TutorMySessions from './pages/tutor/MySessions';

import Subjects from './pages/subjects/Subjects';
import Bookings from './pages/Bookings';
import Reviews from './pages/Reviews';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

import './App.css';

function LoginPage() {
    const navigate = useNavigate();

    return (
        <Login onRegister={() => navigate('/register')} />
    );
}

function RegisterPage() {
    const navigate = useNavigate();

    return (
        <Register onLogin={() => navigate('/login')} />
    );
}

// Select the correct Sessions page based on the logged-in user's JWT.
function SessionsRoute() {
    let role = 'STUDENT';

    try {
        const token = localStorage.getItem('token');

        if (token) {
            const payload = JSON.parse(
                atob(
                    token
                        .split('.')[1]
                        .replace(/-/g, '+')
                        .replace(/_/g, '/')
                )
            );

            const rawRole =
                payload.role ||
                payload.roles?.[0] ||
                payload.authorities?.[0] ||
                payload.authority ||
                'STUDENT';

            role = String(rawRole)
                .replace(/^ROLE_/, '')
                .toUpperCase();
        }
    } catch {
        role = 'STUDENT';
    }

    return role === 'TUTOR'
        ? <TutorMySessions />
        : <StudentMySessions />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default and authentication routes */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                {/* Portal routes */}
                <Route element={<AppLayout />}>

                    {/* Tutor routes */}
                    <Route
                        path="/tutor/dashboard"
                        element={<TutorDashboard />}
                    />

                    <Route
                        path="/tutor/profile"
                        element={<TutorProfile />}
                    />

                    {/* Student routes */}
                    <Route
                        path="/student/dashboard"
                        element={<StudentDashboard />}
                    />

                    <Route
                        path="/student/profile"
                        element={<StudentProfile />}
                    />

                    <Route
                        path="/tutors"
                        element={<BrowseTutors />}
                    />

                    {/* Subjects */}
                    <Route
                        path="/subjects"
                        element={<Subjects />}
                    />

                    {/* Sessions */}
                    <Route
                        path="/sessions"
                        element={<SessionsRoute />}
                    />

                    {/* Bookings */}
                    <Route
                        path="/bookings"
                        element={<Bookings />}
                    />

                    {/* Reviews */}
                    <Route
                        path="/reviews"
                        element={<Reviews />}
                    />

                    {/* Actual Messages page */}
                    <Route
                        path="/messages"
                        element={<Messages />}
                    />

                    {/* Actual Settings page */}
                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>

                {/* Handle unknown routes */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/student/dashboard"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
