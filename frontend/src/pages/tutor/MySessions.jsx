
import { useEffect, useState } from 'react';
import sessionService from '../../services/sessionService';

const emptyForm = {
    topic: '',
    startTime: '',
    endTime: '',
    isOnline: true,
    location: '',
    meetingLink: '',
    maxStudents: 1,
    pricingType: 'HOURLY',
    price: '',
};

function toLocalInput(value) {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const local = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    );

    return local.toISOString().slice(0, 16);
}

function displayDate(value) {
    if (!value) return 'Not specified';

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleString();
}

function getErrorMessage(error) {
    const data = error.response?.data;

    if (typeof data === 'string') return data;
    if (data?.message) return data.message;

    return 'The request failed. Please check your details and try again.';
}

export default function MySessions() {
    const [sessions, setSessions] = useState([]);
    const [tutorProfileId, setTutorProfileId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function loadData() {
        setLoading(true);
        setError('');

        try {
            const [mySessions, profile] = await Promise.all([
                sessionService.getMine(),
                sessionService.getMyTutorProfile(),
            ]);

            setSessions(Array.isArray(mySessions) ? mySessions : []);
            setTutorProfileId(profile?.id ?? null);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function updateField(event) {
        const { name, value, type, checked } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }

    function resetForm() {
        setForm(emptyForm);
        setEditingId(null);
    }

    function startEditing(session) {
        setEditingId(session.sessionId);

        setForm({
            topic: session.topic || '',
            startTime: toLocalInput(session.startTime),
            endTime: toLocalInput(session.endTime),
            isOnline: Boolean(session.isOnline),
            location: session.location || '',
            meetingLink: session.meetingLink || '',
            maxStudents: session.maxStudents ?? 1,
            pricingType: session.pricingType || 'HOURLY',
            price: session.price ?? '',
        });

        setMessage('');
        setError('');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!tutorProfileId) {
            setError(
                'Your tutor profile was not found. Please create your tutor profile before managing sessions.'
            );
            return;
        }

        if (
            new Date(form.endTime) <= new Date(form.startTime)
        ) {
            setError('The end time must be later than the start time.');
            return;
        }

        if (!form.isOnline && !form.location.trim()) {
            setError('Enter a location for an in-person session.');
            return;
        }

        if (form.isOnline && !form.meetingLink.trim()) {
            setError('Enter a meeting link for an online session.');
            return;
        }

        if (Number(form.maxStudents) < 1) {
            setError('Maximum students must be at least 1.');
            return;
        }

        if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0) {
            setError('Enter a price greater than zero.');
            return;
        }

        const payload = {
            tutorProfileId,
            topic: form.topic.trim(),
            startTime: form.startTime,
            endTime: form.endTime,
            isOnline: form.isOnline,
            location: form.isOnline ? '' : form.location.trim(),
            meetingLink: form.isOnline ? form.meetingLink.trim() : '',
            maxStudents: Number(form.maxStudents),
            pricingType: form.pricingType,
            price: Number(form.price).toFixed(2),
        };

        setSaving(true);

        try {
            if (editingId !== null) {
                await sessionService.update(editingId, payload);
                setMessage('Session updated successfully.');
            } else {
                await sessionService.create(payload);
                setMessage('Session created successfully.');
            }

            resetForm();
            await loadData();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(sessionId) {
        const confirmed = window.confirm(
            'Are you sure you want to delete this session?'
        );

        if (!confirmed) return;

        setError('');
        setMessage('');

        try {
            await sessionService.delete(sessionId);
            setSessions((previous) =>
                previous.filter(
                    (session) => session.sessionId !== sessionId
                )
            );
            setMessage('Session deleted successfully.');
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    return (
        <main className="sessions-page">
            <header className="sessions-header">
                <div>
                    <span className="dashboard-label">TUTOR PORTAL</span>
                    <h1>My Sessions</h1>
                    <p>Create and manage your tutoring sessions.</p>
                </div>
            </header>

            {message && (
                <p className="sessions-message" role="status">
                    {message}
                </p>
            )}

            {error && (
                <p className="sessions-message sessions-error" role="alert">
                    {error}
                </p>
            )}

            <section className="sessions-form">
                <h2>
                    {editingId !== null ? 'Edit session' : 'Create a session'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="sessions-form-grid">
                        <div className="form-group">
                            <label htmlFor="sessionTopic">Topic</label>
                            <input
                                id="sessionTopic"
                                name="topic"
                                value={form.topic}
                                onChange={updateField}
                                placeholder="e.g. Java programming"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sessionMaxStudents">
                                Maximum students
                            </label>
                            <input
                                id="sessionMaxStudents"
                                name="maxStudents"
                                type="number"
                                min="1"
                                step="1"
                                value={form.maxStudents}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sessionStart">Start time</label>
                            <input
                                id="sessionStart"
                                name="startTime"
                                type="datetime-local"
                                value={form.startTime}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sessionEnd">End time</label>
                            <input
                                id="sessionEnd"
                                name="endTime"
                                type="datetime-local"
                                value={form.endTime}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sessionPricing">Pricing type</label>
                            <select
                                id="sessionPricing"
                                name="pricingType"
                                value={form.pricingType}
                                onChange={updateField}
                                required
                            >
                                <option value="HOURLY">Hourly</option>
                                <option value="FIXED_SESSION">
                                    Fixed session
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="sessionPrice">Price (R)</label>
                            <input
                                id="sessionPrice"
                                name="price"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.price}
                                onChange={updateField}
                                placeholder="e.g. 150.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="isOnline"
                                checked={form.isOnline}
                                onChange={updateField}
                            />
                            {' '}This is an online session
                        </label>
                    </div>

                    {form.isOnline ? (
                        <div className="form-group">
                            <label htmlFor="sessionMeetingLink">
                                Meeting link
                            </label>
                            <input
                                id="sessionMeetingLink"
                                name="meetingLink"
                                type="url"
                                value={form.meetingLink}
                                onChange={updateField}
                                placeholder="https://..."
                                required
                            />
                        </div>
                    ) : (
                        <div className="form-group">
                            <label htmlFor="sessionLocation">Location</label>
                            <input
                                id="sessionLocation"
                                name="location"
                                value={form.location}
                                onChange={updateField}
                                placeholder="e.g. Library, Room 4"
                                required
                            />
                        </div>
                    )}

                    <div className="session-card-actions">
                        <button
                            className="sessions-primary-button"
                            type="submit"
                            disabled={saving}
                        >
                            {saving
                                ? 'Saving...'
                                : editingId !== null
                                    ? 'Save changes'
                                    : 'Create session'}
                        </button>

                        {editingId !== null && (
                            <button
                                className="sessions-secondary-button"
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel editing
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section>
                <h2>Your sessions</h2>

                {loading ? (
                    <p className="sessions-empty">Loading your sessions...</p>
                ) : sessions.length === 0 ? (
                    <div className="sessions-empty">
                        You have not created any sessions yet.
                    </div>
                ) : (
                    <div className="sessions-grid">
                        {sessions.map((session) => (
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
                                    {displayDate(session.startTime)}
                                </p>

                                <p>
                                    <strong>Ends:</strong>{' '}
                                    {displayDate(session.endTime)}
                                </p>

                                <p>
                                    <strong>Format:</strong>{' '}
                                    {session.isOnline ? 'Online' : 'In person'}
                                </p>

                                {session.isOnline && session.meetingLink && (
                                    <p>
                                        <a
                                            href={session.meetingLink}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Open meeting link
                                        </a>
                                    </p>
                                )}

                                {!session.isOnline && session.location && (
                                    <p>
                                        <strong>Location:</strong> {session.location}
                                    </p>
                                )}

                                <p>
                                    <strong>Capacity:</strong>{' '}
                                    {session.currentStudents ?? 0} / {session.maxStudents}
                                </p>

                                {session.pricingType && session.price != null && (
                                    <p>
                                        <strong>Price:</strong> R{session.price}{' '}
                                        {session.pricingType === 'HOURLY'
                                            ? 'per hour'
                                            : 'per session'}
                                    </p>
                                )}

                                <div className="session-card-actions">
                                    <button
                                        className="sessions-secondary-button"
                                        type="button"
                                        onClick={() => startEditing(session)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="sessions-danger-button"
                                        type="button"
                                        onClick={() => handleDelete(session.sessionId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
