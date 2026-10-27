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

import TutorProfile from './pages/tutor/TutorProfile';
import TutorDashboard from './pages/tutor/TutorDashboard';

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

                    {/* Other application sections */}
                    <Route
                        path="/sessions"
                        element={
                            <FeaturePage
                                title="My Sessions"
                                description="View your tutoring sessions."
                            />
                        }
                    />

                    <Route
                        path="/bookings"
                        element={
                            <FeaturePage
                                title="My Bookings"
                                description="View and manage your bookings."
                            />
                        }
                    />

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