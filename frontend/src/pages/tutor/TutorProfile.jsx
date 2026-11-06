import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { I, icons } from '../../components/icons';
import './TutorProfile.css';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const EMPTY_PROFILE = {
    bio: '',
    qualification: '',
    availability: '',
};

function getApiErrorMessage(error, fallback) {
    const data = error.response?.data;

    if (error.response?.status === 401 || error.response?.status === 403) {
        return 'Your login session has expired or you are not authorised. Please sign in again.';
    }

    if (typeof data === 'string' && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.detail) return data.detail;
    if (data?.error) return data.error;

    if (data?.errors && typeof data.errors === 'object') {
        return Object.values(data.errors).flat().join(' ');
    }

    return fallback;
}

export default function TutorProfile() {
    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [profileId, setProfileId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch {
            return null;
        }
    });

    useEffect(() => {
        let active = true;

        async function loadMyProfile() {
            try {
                const [response, userResponse] = await Promise.all([
                    api.get('/tutor-profiles/mine'),
                    api.get('/auth/me'),
                ]);

                if (!active) return;

                const existingProfile = response.data;
                const currentUser = userResponse.data;

                setUser(currentUser);
                localStorage.setItem('user', JSON.stringify({
                    id: currentUser.userId,
                    firstName: currentUser.firstName || '',
                    lastName: currentUser.lastName || '',
                    email: currentUser.email || '',
                    role: currentUser.role || 'TUTOR',
                }));

                if (existingProfile?.id != null) {
                    setProfileId(existingProfile.id);
                    setProfile({
                        bio: existingProfile.bio || '',
                        qualification: existingProfile.qualification || '',
                        availability: existingProfile.availability || '',
                    });
                }
            } catch (err) {
                if (!active) return;

                setError(getApiErrorMessage(
                    err,
                    'Could not load your tutor profile. Please check that the backend is running and try again.'
                ));
            } finally {
                if (active) setLoading(false);
            }
        }

        loadMyProfile();

        return () => {
            active = false;
        };
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
        setMessage('');
        setError('');
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');
        setError('');
        setSaving(true);

        try {
            const profileToSave = {
                bio: profile.bio.trim(),
                qualification: profile.qualification.trim(),
                availability: profile.availability.trim(),
            };

            if (Object.values(profileToSave).some((value) => !value)) {
                setError('Please complete your qualification, biography and availability before saving.');
                setSaving(false);
                return;
            }

            const response = profileId !== null
                ? await api.put('/tutor-profiles', { id: profileId, ...profileToSave })
                : await api.post('/tutor-profiles', profileToSave);

            setProfileId(response.data.id);
            setProfile({
                bio: response.data.bio || '',
                qualification: response.data.qualification || '',
                availability: response.data.availability || '',
            });
            setMessage('Your professional tutor profile has been saved successfully.');
        } catch (err) {
            setError(getApiErrorMessage(
                err,
                'Could not save your profile. Please check your details and try again.'
            ));
        } finally {
            setSaving(false);
        }
    }

    const completedFields = Object.values(profile).filter((value) => value.trim()).length;
    const profileProgress = Math.round((completedFields / 3) * 100);
    const tutorName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Your Professional Profile';
    const initials = tutorName === 'Your Professional Profile'
        ? 'T'
        : tutorName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    if (loading) {
        return (
            <div className="tutor-profile-page">
                <div className="tutor-profile-loading" role="status">
                    Loading your professional profile...
                </div>
            </div>
        );
    }

    return (
        <div className="tutor-profile-page">
            <header className="tutor-profile-header">
                <div>
                    <span className="tutor-profile-eyebrow">TUTOR PORTAL</span>
                    <h1>Build your professional profile</h1>
                    <p>
                        Help students understand your expertise, teaching style and
                        availability before they connect with you.
                    </p>
                </div>
                <Link to="/tutor/dashboard" className="tutor-profile-back-link">
                    Back to Dashboard
                </Link>
            </header>

            <div className="tutor-profile-layout">
                <section className="tutor-profile-editor">
                    <div className="tutor-profile-section-heading">
                        <div>
                            <span className="tutor-profile-section-label">PROFILE DETAILS</span>
                            <h2>{profileId !== null ? 'Update your profile' : 'Create your profile'}</h2>
                            <p>These details will be visible to students browsing tutors.</p>
                        </div>
                        <div className="tutor-profile-progress">
                            <strong>{profileProgress}%</strong>
                            <span>complete</span>
                        </div>
                    </div>

                    {message && <div className="tutor-profile-success" role="status">{message}</div>}
                    {error && <div className="tutor-profile-error" role="alert">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="tutor-profile-form-group">
                            <label htmlFor="qualification">
                                <span className="tutor-profile-label-icon"><I size={16}>{icons.cap}</I></span>
                                Qualification or area of expertise
                            </label>
                            <input
                                id="qualification"
                                name="qualification"
                                type="text"
                                value={profile.qualification}
                                onChange={handleChange}
                                placeholder="e.g. BSc Computer Science, Python & Web Development"
                                required
                            />
                            <small>Include your qualification, subjects or specialist skills.</small>
                        </div>

                        <div className="tutor-profile-form-group">
                            <label htmlFor="bio">
                                <span className="tutor-profile-label-icon"><I size={16}>{icons.profile}</I></span>
                                Professional biography
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Introduce yourself, your teaching approach and how you help students succeed."
                                rows="7"
                                required
                            />
                            <small>{profile.bio.length} characters · A clear, friendly introduction builds trust.</small>
                        </div>

                        <div className="tutor-profile-form-group">
                            <label htmlFor="availability">
                                <span className="tutor-profile-label-icon"><I size={16}>{icons.sessions}</I></span>
                                Availability
                            </label>
                            <textarea
                                id="availability"
                                name="availability"
                                value={profile.availability}
                                onChange={handleChange}
                                placeholder="e.g. Monday to Friday, 16:00–18:00. Online and in-person sessions available."
                                rows="4"
                                required
                            />
                            <small>Tell students when and how they can schedule sessions with you.</small>
                        </div>

                        <div className="tutor-profile-form-actions">
                            <Link to="/tutor/dashboard" className="tutor-profile-cancel">Cancel</Link>
                            <button type="submit" className="tutor-profile-save" disabled={saving}>
                                <I size={16}>{icons.check}</I>
                                {saving ? 'Saving profile...' : 'Save professional profile'}
                            </button>
                        </div>
                    </form>
                </section>

                <aside className="tutor-profile-preview" aria-label="Profile preview">
                    <div className="tutor-profile-preview-top">
                        <span className="tutor-profile-section-label">LIVE PREVIEW</span>
                        <span className={`tutor-profile-preview-status ${profileId !== null ? 'is-published' : ''}`}>
                            <span></span> {profileId !== null ? 'Published' : 'Draft'}
                        </span>
                    </div>

                    <div className="tutor-profile-identity">
                        <div className="tutor-profile-avatar">{initials || 'T'}</div>
                        <div>
                            <h2>{tutorName}</h2>
                            <p><I size={14}>{icons.cap}</I> {profile.qualification || 'Your qualification will appear here'}</p>
                        </div>
                    </div>

                    <div className="tutor-profile-preview-divider" />

                    <div className="tutor-profile-preview-block">
                        <span className="tutor-profile-preview-label">About me</span>
                        <p>{profile.bio || 'Your professional biography will appear here as you write it.'}</p>
                    </div>

                    <div className="tutor-profile-preview-block">
                        <span className="tutor-profile-preview-label">Availability</span>
                        <p><I size={15}>{icons.sessions}</I> {profile.availability || 'Your availability will appear here.'}</p>
                    </div>

                    <div className="tutor-profile-preview-footer">
                        <div><I size={16}>{icons.settings}</I><span>Profile quality</span></div>
                        <strong>{completedFields === 3 ? 'Ready to share' : 'Complete all fields'}</strong>
                    </div>
                </aside>
            </div>
        </div>
    );
}
