/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { I, icons } from '../../components/icons';
import sessionService from '../../services/sessionService';
import subjectService from '../../services/subjectService';
import './TutorDashboard.css';

function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user') || 'null') || {};
    } catch {
        return {};
    }
}

function formatSessionDate(value) {
    if (!value) return 'Date not set';

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString('en-ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
}

function getErrorMessage(error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
        return 'Your login session has expired. Please sign in again.';
    }

    return error.response?.data?.message ||
        'Some dashboard information could not be loaded. Please try again.';
}

function DashboardStat({ icon, label, value, tone = 'blue' }) {
    return (
        <div className="tutor-dashboard-stat">
            <div className={`tutor-dashboard-stat-icon ${tone}`}>
                <I size={20}>{icons[icon]}</I>
            </div>
            <div>
                <strong>{value}</strong>
                <span>{label}</span>
            </div>
        </div>
    );
}

function DashboardCard({ icon, title, description, action, to, badge }) {
    return (
        <article className="tutor-dashboard-card">
            <div className="tutor-dashboard-card-icon">
                <I size={24}>{icons[icon]}</I>
                {badge > 0 && <span className="tutor-dashboard-card-badge">{badge}</span>}
            </div>
            <div className="tutor-dashboard-card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <Link to={to} className="tutor-dashboard-card-link">
                {action}
                <I size={16}>{icons.arrow}</I>
            </Link>
        </article>
    );
}

export default function TutorDashboard() {
    const [profile, setProfile] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const user = useMemo(getUser, []);

    useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                const [profileData, sessionData, subjectData] = await Promise.all([
                    sessionService.getMyTutorProfile(),
                    sessionService.getMine(),
                    subjectService.getAll(),
                ]);

                if (!active) return;

                setProfile(profileData?.id ? profileData : null);
                setSessions(Array.isArray(sessionData) ? sessionData : []);
                setSubjects(Array.isArray(subjectData) ? subjectData : []);
            } catch (requestError) {
                if (active) setError(getErrorMessage(requestError));
            } finally {
                if (active) setLoading(false);
            }
        }

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const firstName = user.firstName || 'Tutor';
    const profileComplete = profile &&
        profile.bio?.trim() &&
        profile.qualification?.trim() &&
        profile.availability?.trim();
    const upcomingSessions = sessions
        .filter((session) => session.startTime && new Date(session.startTime) >= new Date())
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const activeSessions = sessions.filter((session) =>
        ['SCHEDULED', 'IN_PROGRESS'].includes(session.status)
    );

    if (loading) {
        return (
            <div className="tutor-dashboard-page">
                <div className="tutor-dashboard-loading" role="status">
                    Loading your dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="tutor-dashboard-page">
            <header className="tutor-dashboard-header">
                <div>
                    <span className="tutor-dashboard-eyebrow">TUTOR PORTAL</span>
                    <h1>Welcome back, {firstName}</h1>
                    <p>Manage your profile, teaching sessions and subjects from one place.</p>
                </div>
                <Link to="/sessions/new" className="tutor-dashboard-primary-action">
                    <I size={17}>{icons.plus}</I>
                    Create session
                </Link>
            </header>

            {error && (
                <div className="tutor-dashboard-error" role="alert">
                    <I size={18}>{icons.notifications}</I>
                    <span>{error}</span>
                    <button type="button" onClick={() => window.location.reload()}>Retry</button>
                </div>
            )}

            <section className="tutor-dashboard-hero">
                <div className="tutor-dashboard-hero-glow" />
                <div className="tutor-dashboard-hero-copy">
                    <span>YOUR TEACHING WORKSPACE</span>
                    <h2>Make every session count.</h2>
                    <p>
                        Keep your tutor profile up to date and give students a clear,
                        trustworthy view of what you teach.
                    </p>
                    <Link to={profileComplete ? '/tutor/profile' : '/tutor/profile'} className="tutor-dashboard-hero-link">
                        {profileComplete ? 'Review my profile' : 'Complete my profile'}
                        <I size={16}>{icons.arrow}</I>
                    </Link>
                </div>
                <div className="tutor-dashboard-profile-status">
                    <div className={`tutor-dashboard-status-icon ${profileComplete ? 'complete' : ''}`}>
                        <I size={25}>{profileComplete ? icons.check : icons.profile}</I>
                    </div>
                    <span>{profileComplete ? 'Profile ready' : 'Profile needs attention'}</span>
                    <strong>{profileComplete ? 'Visible to students' : 'Add your details to get started'}</strong>
                </div>
            </section>

            <section className="tutor-dashboard-stats">
                <DashboardStat icon="sessions" label="Total sessions" value={sessions.length} />
                <DashboardStat icon="notifications" label="Upcoming sessions" value={upcomingSessions.length} tone="amber" />
                <DashboardStat icon="subjects" label="Subjects offered" value={subjects.length} tone="green" />
                <DashboardStat icon="profile" label="Profile status" value={profileComplete ? 'Ready' : 'Incomplete'} tone="purple" />
            </section>

            <section className="tutor-dashboard-section">
                <div className="tutor-dashboard-section-heading">
                    <div>
                        <span className="tutor-dashboard-section-label">QUICK ACTIONS</span>
                        <h2>Your tutoring overview</h2>
                    </div>
                    <span className="tutor-dashboard-section-note">Everything in one place</span>
                </div>

                <div className="tutor-dashboard-card-grid">
                    <DashboardCard
                        icon="profile"
                        title="My Tutor Profile"
                        description="Show students your qualifications, teaching approach and availability."
                        action={profileComplete ? 'Manage profile' : 'Create profile'}
                        to="/tutor/profile"
                    />
                    <DashboardCard
                        icon="sessions"
                        title="My Sessions"
                        description="Create session slots and keep track of your scheduled tutoring activities."
                        action={`View sessions (${activeSessions.length} active)`}
                        to="/sessions"
                    />
                    <DashboardCard
                        icon="subjects"
                        title="My Subjects"
                        description="Manage the subjects and topics you are ready to teach."
                        action={`Manage subjects (${subjects.length})`}
                        to="/subjects"
                    />
                    <DashboardCard
                        icon="bookings"
                        title="Booking Requests"
                        description="Review the booking area and keep your tutoring commitments organised."
                        action="Open bookings"
                        to="/bookings"
                    />
                </div>
            </section>

            <section className="tutor-dashboard-section tutor-dashboard-sessions">
                <div className="tutor-dashboard-section-heading">
                    <div>
                        <span className="tutor-dashboard-section-label">SCHEDULE</span>
                        <h2>Upcoming sessions</h2>
                    </div>
                    <Link to="/sessions" className="tutor-dashboard-view-all">View all <I size={15}>{icons.arrow}</I></Link>
                </div>

                {upcomingSessions.length === 0 ? (
                    <div className="tutor-dashboard-empty">
                        <div><I size={22}>{icons.sessions}</I></div>
                        <h3>No upcoming sessions yet</h3>
                        <p>Create a session slot so students can find and book your availability.</p>
                        <Link to="/sessions/new">Create your first session</Link>
                    </div>
                ) : (
                    <div className="tutor-dashboard-session-list">
                        {upcomingSessions.slice(0, 4).map((session) => (
                            <Link to="/sessions" className="tutor-dashboard-session" key={session.sessionId}>
                                <div className="tutor-dashboard-session-date">
                                    <I size={18}>{icons.sessions}</I>
                                </div>
                                <div className="tutor-dashboard-session-info">
                                    <strong>{session.topic || 'Tutoring session'}</strong>
                                    <span>{formatSessionDate(session.startTime)}</span>
                                </div>
                                <span className={`tutor-dashboard-session-status ${String(session.status || '').toLowerCase()}`}>
                                    {session.status || 'Scheduled'}
                                </span>
                                <I size={16}>{icons.arrow}</I>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
