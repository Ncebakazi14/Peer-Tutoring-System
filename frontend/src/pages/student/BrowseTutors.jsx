
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TutorApi from '../../api/TutorApi';
import './BrowseTutors.css';

function BrowseTutors() {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        </div>
    );
}

export default BrowseTutors;
