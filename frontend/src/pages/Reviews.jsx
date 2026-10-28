
import { useEffect, useState } from 'react';
import './Reviews.css';

const API_URL = 'http://localhost:8080/api/reviews';
const PROFILE_URL = 'http://localhost:8080/api/tutor-profiles/mine';

function getHeaders() {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function getUserRole() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return '';

        const payload = JSON.parse(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        );

        const roles =
            payload.role ||
            payload.roles ||
            payload.authorities ||
            '';

        return (
            Array.isArray(roles) ? roles.join(' ') : String(roles)
        ).toUpperCase();
    } catch {
        return '';
    }
}

function ReviewCard({ review }) {
    const rating = Math.min(5, Math.max(0, Number(review.rating) || 0));

    const date = review.reviewDate
        ? new Date(review.reviewDate).toLocaleDateString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
          })
        : 'Date unavailable';

    return (
        <article className="review-card">
            <div className="review-card-header">
                <div className="review-avatar" aria-hidden="true">
                    {review.isAnonymous ? 'A' : 'S'}
                </div>

                <div className="review-author">
                    <h3>
                        {review.isAnonymous
                            ? 'Anonymous Student'
                            : 'Student Reviewer'}
                    </h3>
                    <p>{date}</p>
                </div>

                <span className="review-badge">Student feedback</span>
            </div>

            <div className="review-rating">
                <span
                    className="review-stars"
                    aria-label={`${rating} out of 5 stars`}
                >
                    {'★'.repeat(rating)}
                    {'☆'.repeat(5 - rating)}
                </span>

                <span className="review-rating-number">
                    {rating} / 5
                </span>
            </div>

            <h4 className="review-title">
                {rating >= 4
                    ? 'Great tutoring experience'
                    : rating === 3
                      ? 'Good tutoring experience'
                      : 'Tutoring feedback'}
            </h4>

            <p className="review-comment">
                {review.comment || 'No written comment was provided.'}
            </p>
        </article>
    );
}

export default function Reviews() {
    const [role, setRole] = useState(getUserRole);
    const isTutor = role.includes('TUTOR');

    const [tutorProfileId, setTutorProfileId] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [rating, setRating] = useState('5');
    const [comment, setComment] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Refresh the role when the page becomes active.
    useEffect(() => {
        setRole(getUserRole());
    }, []);

    // Tutors automatically load feedback for their own profile.
    useEffect(() => {
        if (!isTutor) return;

        let cancelled = false;

        async function loadTutorFeedback() {
            setLoading(true);
            setMessage('');

            try {
                const profileResponse = await fetch(PROFILE_URL, {
                    headers: getHeaders(),
                });

                if (!profileResponse.ok) {
                    throw new Error(
                        `Could not load your tutor profile (${profileResponse.status}).`
                    );
                }

                const profile = await profileResponse.json();

                const profileId =
                    profile.tutorProfileId ??
                    profile.id ??
                    profile.profileId;

                if (!profileId) {
                    throw new Error('Your tutor profile ID was not found.');
                }

                if (cancelled) return;

                setTutorProfileId(String(profileId));

                const reviewsResponse = await fetch(
                    `${API_URL}/tutor/${profileId}`,
                    { headers: getHeaders() }
                );

                if (!reviewsResponse.ok) {
                    throw new Error(
                        `Could not load student feedback (${reviewsResponse.status}).`
                    );
                }

                const data = await reviewsResponse.json();

                if (cancelled) return;

                setReviews(Array.isArray(data) ? data : []);
                setMessage('');
            } catch (error) {
                if (!cancelled) {
                    setMessage(
                        error.message || 'Could not load student feedback.'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadTutorFeedback();

        return () => {
            cancelled = true;
        };
    }, [isTutor]);

    async function submitReview(event) {
        event.preventDefault();
        setMessage('');

        if (isTutor) {
            setMessage('Tutors can view feedback but cannot submit reviews.');
            return;
        }

        if (!localStorage.getItem('token')) {
            setMessage('Please log in before submitting a review.');
            return;
        }

        if (
            !tutorProfileId ||
            !sessionId ||
            Number(tutorProfileId) <= 0 ||
            Number(sessionId) <= 0
        ) {
            setMessage('Enter valid tutor profile and session IDs.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    rating: Number(rating),
                    comment: comment.trim(),
                    anonymous,
                    sessionId: Number(sessionId),
                    tutorProfileId: Number(tutorProfileId),
                }),
            });

            if (!response.ok) {
                const details = await response.text();

                throw new Error(
                    details || `Review submission failed (${response.status}).`
                );
            }

            setMessage('Your review has been submitted successfully!');
            setComment('');
            setRating('5');
            setAnonymous(false);
        } catch (error) {
            setMessage(error.message || 'Could not submit your review.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="dashboard-page reviews-page">
            <header className="dashboard-header reviews-header">
                <span className="dashboard-label">
                    {isTutor ? 'TUTOR PORTAL' : 'STUDENT PORTAL'}
                </span>

                <h1>
                    {isTutor ? 'Student Feedback' : 'Reviews & Feedback'}
                </h1>

                <p>
                    {isTutor
                        ? 'Read feedback students have shared about your tutoring.'
                        : 'Share your experience and help improve peer tutoring.'}
                </p>
            </header>

            {/* Students see the submission form only. */}
            {!isTutor && (
                <section className="dashboard-section review-form-section">
                    <div className="review-section-heading">
                        <div>
                            <span className="review-eyebrow">
                                YOUR EXPERIENCE MATTERS
                            </span>

                            <h2>Write a Review</h2>
                            <p>Tell us how your tutoring session went.</p>
                        </div>

                        <div className="review-heading-icon" aria-hidden="true">
                            ★
                        </div>
                    </div>

                    <form className="review-form" onSubmit={submitReview}>
                        <div className="review-form-grid">
                            <div className="review-field">
                                <label htmlFor="tutorProfileId">
                                    Tutor Profile ID
                                </label>

                                <input
                                    id="tutorProfileId"
                                    type="number"
                                    min="1"
                                    value={tutorProfileId}
                                    onChange={(event) =>
                                        setTutorProfileId(event.target.value)
                                    }
                                    placeholder="Enter tutor profile ID"
                                    required
                                />
                            </div>

                            <div className="review-field">
                                <label htmlFor="sessionId">Session ID</label>

                                <input
                                    id="sessionId"
                                    type="number"
                                    min="1"
                                    value={sessionId}
                                    onChange={(event) =>
                                        setSessionId(event.target.value)
                                    }
                                    placeholder="Enter session ID"
                                    required
                                />
                            </div>
                        </div>

                        <div className="review-field">
                            <label htmlFor="rating">
                                How would you rate the tutor?
                            </label>

                            <select
                                id="rating"
                                value={rating}
                                onChange={(event) =>
                                    setRating(event.target.value)
                                }
                                required
                            >
                                <option value="5">★★★★★ — Excellent</option>
                                <option value="4">★★★★☆ — Very good</option>
                                <option value="3">★★★☆☆ — Good</option>
                                <option value="2">★★☆☆☆ — Fair</option>
                                <option value="1">★☆☆☆☆ — Needs improvement</option>
                            </select>
                        </div>

                        <div className="review-field">
                            <label htmlFor="comment">Your feedback</label>

                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(event) =>
                                    setComment(event.target.value)
                                }
                                placeholder="What went well? Was the tutor clear, helpful and prepared?"
                                rows="5"
                                maxLength={1000}
                            />

                            <span className="review-character-count">
                                {comment.length}/1000 characters
                            </span>
                        </div>

                        <label className="review-anonymous-option">
                            <input
                                type="checkbox"
                                checked={anonymous}
                                onChange={(event) =>
                                    setAnonymous(event.target.checked)
                                }
                            />

                            <span>
                                <strong>Submit anonymously</strong>
                                <small>
                                    Your name will not be displayed with this
                                    review.
                                </small>
                            </span>
                        </label>

                        <button
                            className="review-submit-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : 'Submit My Review'}
                        </button>
                    </form>

                    {message && (
                        <p className="review-status-message" role="status">
                            {message}
                        </p>
                    )}
                </section>
            )}

            {/* Tutors see feedback only; students never see this section. */}
            {isTutor && (
                <section className="dashboard-section review-list-section">
                    <div className="review-section-heading">
                        <div>
                            <span className="review-eyebrow">
                                YOUR TUTORING FEEDBACK
                            </span>

                            <h2>Reviews from Your Students</h2>
                            <p>
                                See what students have said about their learning
                                experience.
                            </p>
                        </div>

                        <span className="review-count">{reviews.length}</span>
                    </div>

                    {message && (
                        <p className="review-status-message" role="status">
                            {message}
                        </p>
                    )}

                    {loading && <p>Loading student feedback...</p>}

                    {!loading && reviews.length > 0 && (
                        <div className="review-list">
                            {reviews.map((review) => (
                                <ReviewCard
                                    key={review.reviewId}
                                    review={review}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && reviews.length === 0 && !message && (
                        <div className="review-empty-state">
                            <div
                                className="review-empty-icon"
                                aria-hidden="true"
                            >
                                ☆
                            </div>

                            <h3>No feedback yet</h3>
                            <p>
                                When students submit reviews about your
                                tutoring, they will appear here.
                            </p>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
