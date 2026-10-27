import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

function TutorProfile() {
    const [profile, setProfile] = useState({
        bio: '',
        qualification: '',
        availability: '',
    });

    const [profileId, setProfileId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const api = axios.create({ baseURL: '/api' });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    useEffect(() => {
        async function loadProfiles() {
            try {
                const response = await api.get('/tutor-profiles');
                const profiles = response.data;

                // The current backend does not link profiles to individual users.
                // Until that relationship exists, use the first available profile.
                if (profiles.length > 0) {
                    const existingProfile = profiles[0];

                    setProfileId(existingProfile.id);
                    setProfile({
                        bio: existingProfile.bio || '',
                        qualification: existingProfile.qualification || '',
                        availability: existingProfile.availability || '',
                    });
                }
            } catch (err) {
                setError(
                    'Could not load tutor profiles. Please check that the backend is running and try again.'
                );
            } finally {
                setLoading(false);
            }
        }

        loadProfiles();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');
        setError('');
        setSaving(true);

        try {
            let response;

            if (profileId !== null) {
                response = await api.put('/tutor-profiles', {
                    id: profileId,
                    ...profile,
                });
            } else {
                response = await api.post('/tutor-profiles', profile);
            }

            setProfileId(response.data.id);
            setProfile({
                bio: response.data.bio || '',
                qualification: response.data.qualification || '',
                availability: response.data.availability || '',
            });

            setMessage('Your tutor profile has been saved successfully.');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Could not save your profile. Please check your details and try again.'
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="dashboard-page">
                <p>Loading tutor profile...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page tutor-dashboard">
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-label">TUTOR PORTAL</span>
                    <h1>My Tutor Profile</h1>
                    <p>
                        Introduce yourself to students and tell them about
                        your qualifications and availability.
                    </p>
                </div>
            </div>

            <section className="dashboard-section">
                <h2>{profileId !== null ? 'Update Your Profile' : 'Create Your Profile'}</h2>

                <p>
                    Complete all three fields so students can learn more about you.
                </p>

                {message && (
                    <p role="status" className="profile-success">
                        {message}
                    </p>
                )}

                {error && (
                    <p role="alert" className="profile-error">
                        {error}
                    </p>
                )}

                <form className="tutor-profile-form" onSubmit={handleSubmit}>
                    <div className="profile-form-group">
                        <label htmlFor="qualification">Qualifications</label>
                        <input
                            id="qualification"
                            name="qualification"
                            type="text"
                            value={profile.qualification}
                            onChange={handleChange}
                            placeholder="e.g. Diploma in Information Technology"
                            required
                        />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="bio">Biography</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            placeholder="Tell students about yourself and how you can help them."
                            rows="5"
                            required
                        />
                    </div>

                    <div className="profile-form-group">
                        <label htmlFor="availability">Availability</label>
                        <textarea
                            id="availability"
                            name="availability"
                            value={profile.availability}
                            onChange={handleChange}
                            placeholder="e.g. Monday to Friday, 16:00–18:00"
                            rows="3"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="tutor-primary-action"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Tutor Profile'}
                    </button>
                </form>

                <p className="profile-back-link">
                    <Link to="/tutor/dashboard">← Back to Tutor Dashboard</Link>
                </p>
            </section>
        </div>
    );
}

export default TutorProfile;