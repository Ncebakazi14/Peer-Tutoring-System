
import { useEffect, useState } from 'react';
import sessionService from '../../services/sessionService';

function formatDateTime(value) {
    if (!value) return 'Not specified';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString();
}

export default function MySessions() {
    const [sessions, setSessions] = useState([]);
    const [topic, setTopic] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        async function loadSessions() {
            setLoading(true);
            setError('');

            try {
                const data = await sessionService.getAll();

                if (active) {
                    setSessions(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        'Unable to load sessions. Please check that you are logged in and the backend is running.'
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadSessions();

        return () => {
            active = false;
        };
    }, []);

    const filteredSessions = sessions.filter((session) => {
        const matchesTopic = (session.topic || '')
            .toLowerCase()
            .includes(topic.trim().toLowerCase());

        const matchesStatus =
            !status || session.status === status;

        return matchesTopic && matchesStatus;
    });

    return (
        <main className="sessions-page">
            <header className="sessions-header">
                <div>
                    <span className="dashboard-label">
                        STUDENT PORTAL
                    </span>
                    <h1>My Sessions</h1>
                    <p>
                        Explore tutoring sessions and find one that suits you.
                    </p>
                </div>
            </header>

            {error && (
                <p className="sessions-message sessions-error" role="alert">
                    {error}
                </p>
            )}

            <div className="sessions-filters">
                <input
                    type="search"
                    aria-label="Search by topic"
                    placeholder="Search topics..."
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                />

                <select
                    aria-label="Filter by status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                >
                    <option value="">All statuses</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>

            {loading ? (
                <p className="sessions-empty">Loading sessions...</p>
            ) : filteredSessions.length === 0 ? (
                <div className="sessions-empty">
                    {sessions.length === 0
                        ? 'No sessions are available yet.'
                        : 'No sessions match your search.'}
                </div>
            ) : (
                <div className="sessions-grid">
                    {filteredSessions.map((session) => (
                        <article
                            className="session-card"
                            key={session.sessionId}
                        >
                            <span className="session-status">
                                {(session.status || 'UNKNOWN').replaceAll('_', ' ')}
                            </span>

                            <h2>{session.topic}</h2>

                            <p>
                                <strong>Starts:</strong>{' '}
                                {formatDateTime(session.startTime)}
                            </p>

                            <p>
                                <strong>Ends:</strong>{' '}
                                {formatDateTime(session.endTime)}
                            </p>

                            <p>
                                <strong>Format:</strong>{' '}
                                {session.isOnline ? 'Online' : 'In person'}
                            </p>

                            {session.isOnline && session.meetingLink && (
                                <p>
                                    <strong>Meeting link:</strong>{' '}
                                    <a
                                        href={session.meetingLink}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Join meeting
                                    </a>
                                </p>
                            )}

                            {!session.isOnline && session.location && (
                                <p>
                                    <strong>Location:</strong> {session.location}
                                </p>
                            )}

                            <p>
                                <strong>Places:</strong>{' '}
                                {session.currentStudents ?? 0} / {session.maxStudents}
                            </p>

                            {session.pricingType && session.price != null && (
                                <p>
                                    <strong>Price:</strong> R{session.price}{' '}
                                    ({session.pricingType === 'HOURLY'
                                        ? 'per hour'
                                        : 'per session'})
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}
