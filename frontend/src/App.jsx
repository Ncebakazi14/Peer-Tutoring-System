
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
    Link,
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

function FeaturePage({ title, description }) {
    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-label">
                        STUDENT PORTAL
                    </span>

                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>

            <section className="dashboard-section">
                <h2>{title}</h2>

                <p>
                    This section is ready for its functionality to be
                    connected.
                </p>

                <p>
                    <Link to="/student/dashboard">
                        Back to Dashboard
                    </Link>
                </p>
            </section>
        </div>
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

                    {/* Bookings - unchanged */}
                    <Route
                        path="/bookings"
                        element={<Bookings />}
                    />

                    {/* Other application sections */}
                    <Route
                        path="/reviews"
                        element={
                            <FeaturePage
                                title="My Reviews"
                                description="View your tutoring reviews."
                            />
                        }
                    />

                    <Route
                        path="/messages"
                        element={
                            <FeaturePage
                                title="Messages"
                                description="Your tutoring conversations."
                            />
                        }
                    />

                    <Route
                        path="/notifications"
                        element={
                            <FeaturePage
                                title="Notifications"
                                description="View your latest notifications."
                            />
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <FeaturePage
                                title="Settings"
                                description="Manage your account preferences."
                            />
                        }
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
