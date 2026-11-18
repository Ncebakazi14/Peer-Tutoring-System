
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TutorApi from '../../api/TutorApi';
import sessionApi from '../../services/sessionApi';
import bookingApi from '../../services/bookingApi';
import './BrowseTutors.css';

function BrowseTutors() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    const [bookingMessage, setBookingMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadTutors() {
            try {
                setLoading(true);
                setError('');

                const data = await TutorApi.getAllTutorProfiles();

                if (isMounted) {
                    setTutors(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (isMounted) {
                    if (
                        err.response?.status === 401 ||
                        err.response?.status === 403
                    ) {
                        setError(
                            'You are not authorised to view tutor profiles. ' +
                            'Please sign in again if your session has expired.'
                        );
                    } else {
                        setError(
                            'Unable to load tutor profiles. ' +
                            'Please check that the backend is running and try again.'
                        );
                    }

                    console.error('Failed to load tutor profiles:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadTutors();

        return () => {
            isMounted = false;
        };
    }, []);

    async function openTutor(tutor) {
        setSelectedTutor(tutor);
        setSessions([]);
        setBookingMessage('');
        setSessionsLoading(true);

        try {
            const response = await sessionApi.getAll();
            const availableSessions = (Array.isArray(response.data) ? response.data : [])
                .filter((session) => String(session.tutorProfileId) === String(tutor.id))
                .filter((session) => !['COMPLETED', 'CANCELLED'].includes(session.status));
            setSessions(availableSessions);
        } catch (requestError) {
            setBookingMessage(
                requestError.response?.data?.message ||
                'Could not load this tutor’s sessions.'
            );
        } finally {
            setSessionsLoading(false);
        }
    }

    async function bookSession(session) {
        setBookingId(session.sessionId);
        setBookingMessage('');

        try {
            await bookingApi.create({ sessionId: session.sessionId });
            setBookingMessage('Session booked successfully. You can view it under My Bookings.');
        } catch (requestError) {
            setBookingMessage(
                requestError.response?.data?.message ||
                'Could not book this session.'
            );
        } finally {
            setBookingId(null);
        }
    }

    const formatDateTime = (value) => value
        ? new Date(value).toLocaleString('en-ZA', {
            dateStyle: 'medium',
            timeStyle: 'short',
        })
        : 'Time to be confirmed';

    return (
        <div className="browse-tutors-page">
            <header className="browse-tutors-header">
                <div>
                    <span className="browse-tutors-label">
                        STUDENT PORTAL
                    </span>

                    <h1>Browse Tutors</h1>

                    <p>
                        Find a tutor and explore their qualifications,
                        availability and background.
                    </p>
                </div>

                <Link
                    to="/student/dashboard"
                    className="browse-dashboard-link"
                >
                    Back to Dashboard
                </Link>
            </header>

            <section className="tutor-results-section">
                <div className="tutor-results-heading">
                    <div>
                        <h2>Available Tutor Profiles</h2>

                        <p>
                            Browse the tutor information currently
                            available in the system.
                        </p>
                    </div>

                    {!loading && !error && (
                        <span className="tutor-count">
                            {tutors.length}{' '}
                            {tutors.length === 1 ? 'profile' : 'profiles'}
                        </span>
                    )}
                </div>

                {loading && (
                    <div className="tutor-message" role="status">
                        Loading tutor profiles...
                    </div>
                )}

                {!loading && error && (
                    <div className="tutor-error" role="alert">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && tutors.length === 0 && (
                    <div className="tutor-message">
                        <h3>No tutor profiles yet</h3>

                        <p>
                            There are currently no tutor profiles to display.
                            Profiles will appear here once they have been
                            added to the system.
                        </p>
                    </div>
                )}

                {!loading && !error && tutors.length > 0 && (
                    <div className="tutor-grid">
                        {tutors.map((tutor) => {
                            const firstName = tutor.firstName?.trim() || '';
                            const lastName = tutor.lastName?.trim() || '';
                            const fullName =
                                `${firstName} ${lastName}`.trim() || 'Tutor';

                            const initials =
                                `${firstName.charAt(0)}${lastName.charAt(0)}`
                                    .trim()
                                    .toUpperCase() || 'T';

                            return (
                                <article
                                    className="tutor-card"
                                    key={tutor.id}
                                    onClick={() => openTutor(tutor)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            openTutor(tutor);
                                        }
                                    }}
                                >
                                    <div className="tutor-card-top">
                                        <div className="tutor-avatar">
                                            {initials}
                                        </div>

                                        <span className="tutor-id">
                                            {fullName}
                                        </span>
                                    </div>

                                    <div className="tutor-card-content">
                                        <h3>
                                            {tutor.qualification ||
                                                'Qualification not provided'}
                                        </h3>

                                        <div className="tutor-detail">
                                            <span className="tutor-detail-label">
                                                About
                                            </span>

                                            <p>
                                                {tutor.bio ||
                                                    'No biography provided.'}
                                            </p>
                                        </div>

                                        <div className="tutor-detail">
                                            <span className="tutor-detail-label">
                                                Availability
                                            </span>

                                            <p>
                                                {tutor.availability ||
                                                    'Availability not provided.'}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {selectedTutor && (
                <div className="tutor-detail-overlay" role="presentation" onClick={() => setSelectedTutor(null)}>
                    <section
                        className="tutor-detail-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="selected-tutor-name"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="tutor-detail-close"
                            onClick={() => setSelectedTutor(null)}
                            aria-label="Close tutor details"
                        >
                            ×
                        </button>
                        <div className="tutor-detail-modal-header">
                            <div className="tutor-avatar">
                                {(selectedTutor.firstName?.[0] || '') +
                                    (selectedTutor.lastName?.[0] || '') || 'T'}
                            </div>
                            <div>
                                <span className="browse-tutors-label">TUTOR PROFILE</span>
                                <h2 id="selected-tutor-name">
                                    {`${selectedTutor.firstName || ''} ${selectedTutor.lastName || ''}`.trim() || 'Tutor'}
                                </h2>
                                <p>{selectedTutor.qualification || 'Qualification not provided'}</p>
                            </div>
                        </div>

                        <div className="tutor-detail-modal-body">
                            <div className="tutor-detail-block">
                                <span>About</span>
                                <p>{selectedTutor.bio || 'No biography provided.'}</p>
                            </div>
                            <div className="tutor-detail-block">
                                <span>Availability</span>
                                <p>{selectedTutor.availability || 'Availability not provided.'}</p>
                            </div>

                            <h3>Available sessions</h3>
                            {bookingMessage && (
                                <p className="booking-message" role="status">{bookingMessage}</p>
                            )}
                            {sessionsLoading ? (
                                <p className="tutor-session-empty">Loading sessions...</p>
                            ) : sessions.length === 0 ? (
                                <p className="tutor-session-empty">
                                    This tutor has no available sessions at the moment.
                                </p>
                            ) : (
                                <div className="tutor-session-list">
                                    {sessions.map((session) => (
                                        <div className="tutor-session" key={session.sessionId}>
                                            <div>
                                                <strong>{session.topic || 'Tutoring session'}</strong>
                                                <span>{formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}</span>
                                                <span>
                                                    {session.isOnline ? 'Online' : session.location || 'Location to be confirmed'}
                                                    {' · '}
                                                    {session.currentStudents}/{session.maxStudents} booked
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => bookSession(session)}
                                                disabled={bookingId === session.sessionId || session.currentStudents >= session.maxStudents}
                                            >
                                                {bookingId === session.sessionId
                                                    ? 'Booking...'
                                                    : session.currentStudents >= session.maxStudents
                                                        ? 'Full'
                                                        : 'Book session'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default BrowseTutors;
