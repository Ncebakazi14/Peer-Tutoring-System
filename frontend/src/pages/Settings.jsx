import { useEffect, useState } from "react";
import StudentApi from "../api/StudentApi";
import api from "../services/api";
import "./Settings.css";

const EMPTY_PROFILE = {
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    active: false,
};

export default function Settings() {
    const isTutor = getRole() === "TUTOR";
    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            try {
                const data = isTutor
                    ? await loadTutorSettings()
                    : await StudentApi.getStudentById(getLoggedInUserId());

                if (!cancelled) {
                    setProfile({
                        ...EMPTY_PROFILE,
                        ...data,
                    });
                }
            } catch (requestError) {
                if (!cancelled) {
                    setError(
                        requestError.response?.data?.message ||
                        "Could not load your account settings."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [isTutor]);

    function updateField(event) {
        const { name, value } = event.target;
        setProfile((current) => ({ ...current, [name]: value }));
        setError("");
        setNotice("");
    }

    async function saveProfile(event) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        try {
            const updated = isTutor
                ? await saveTutorSettings(profile)
                : await StudentApi.updateStudent(profile);
            const savedProfile = { ...profile, ...updated };
            setProfile(savedProfile);
            if (!isTutor) {
                persistStudentSettings(savedProfile);
            }
            setNotice("Profile updated successfully!");
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Could not update your profile."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="settings-page">
                <div className="settings-loading">Loading your settings...</div>
            </main>
        );
    }

    return (
        <main className="settings-page">
            <header className="settings-heading">
                <p className="settings-eyebrow">YOUR ACCOUNT</p>
                <h1>Settings</h1>
                <p>Manage your profile details and keep your account secure.</p>
            </header>

            {error && (
                <div className="settings-alert error" role="alert">
                    {error}
                </div>
            )}

            {notice && (
                <div className="settings-alert success" role="status">
                    {notice}
                </div>
            )}

            <section className="settings-card">
                <div className="settings-card-heading">
                    <div className="settings-icon" aria-hidden="true">◉</div>
                    <div>
                        <h2>Profile information</h2>
                        <p>Update the personal details linked to your account.</p>
                    </div>
                </div>

                <form onSubmit={saveProfile}>
                    <div className="settings-form-grid">
                        <div className="settings-field">
                            <label htmlFor="firstName">First name</label>
                            <input
                                id="firstName"
                                name="firstName"
                                value={profile.firstName}
                                onChange={updateField}
                                required
                            />
                        </div>

                        <div className="settings-field">
                            <label htmlFor="lastName">Last name</label>
                            <input
                                id="lastName"
                                name="lastName"
                                value={profile.lastName}
                                onChange={updateField}
                                required
                            />
                        </div>

                        {isTutor && (
                            <>
                                <div className="settings-field">
                                    <label htmlFor="qualification">Qualification</label>
                                    <input
                                        id="qualification"
                                        name="qualification"
                                        value={profile.qualification || ""}
                                        onChange={updateField}
                                        placeholder="Your qualification"
                                    />
                                </div>
                                <div className="settings-field">
                                    <label htmlFor="availability">Availability</label>
                                    <input
                                        id="availability"
                                        name="availability"
                                        value={profile.availability || ""}
                                        onChange={updateField}
                                        placeholder="Your availability"
                                    />
                                </div>
                                <div className="settings-field settings-full-width">
                                    <label htmlFor="bio">Professional biography</label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={profile.bio || ""}
                                        onChange={updateField}
                                        rows="4"
                                        placeholder="Tell students about your tutoring experience."
                                    />
                                </div>
                            </>
                        )}

                        <div className="settings-field settings-full-width">
                            <label htmlFor="email">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={updateField}
                                required
                            />
                            <small>
                                If you change your email, you may need to log in again.
                            </small>
                        </div>

                        <div className="settings-field settings-full-width">
                            <label htmlFor="phoneNumber">Phone number</label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={profile.phoneNumber || ""}
                                onChange={updateField}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="settings-field settings-full-width">
                            <label htmlFor="role">Account role</label>
                            <input id="role" value={isTutor ? "Tutor" : "Student"} readOnly />
                            <small>Your account role cannot be changed here.</small>
                        </div>
                    </div>

                    <div className="settings-actions">
                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save profile"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

function getRole() {
    try {
        const token = localStorage.getItem("token");
        const encodedPayload = token?.split(".")[1];
        const payload = encodedPayload
            ? JSON.parse(atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/").padEnd(
                Math.ceil(encodedPayload.length / 4) * 4,
                "="
            )))
            : {};
        const role = payload.role || payload.roles?.[0] || payload.authorities?.[0] || "STUDENT";
        return String(role).replace(/^ROLE_/i, "").toUpperCase();
    } catch {
        return "STUDENT";
    }
}

function getLoggedInUserId() {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        return user?.id || 1;
    } catch {
        return 1;
    }
}

function persistStudentSettings(profile) {
    try {
        const currentUser = JSON.parse(localStorage.getItem("user") || "null") || {};
        localStorage.setItem("user", JSON.stringify({
            ...currentUser,
            id: profile.studentId || currentUser.id,
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: profile.email || "",
        }));
    } catch {
        // The server remains the source of truth if local profile storage is unavailable.
    }
}

async function loadTutorSettings() {
    const storedUser = getStoredUser();
    const [profileResult, userResult] = await Promise.allSettled([
        api.get("/tutor-profiles/mine"),
        api.get("/auth/me"),
    ]);

    const profileData = profileResult.status === "fulfilled"
        ? profileResult.value.data || {}
        : {};
    const userData = userResult.status === "fulfilled"
        ? userResult.value.data || {}
        : storedUser;

    if (
        profileResult.status === "rejected" &&
        userResult.status === "rejected" &&
        !storedUser
    ) {
        throw profileResult.reason || userResult.reason;
    }

    return {
        ...userData,
        ...profileData,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
    };
}

async function saveTutorSettings(profile) {
    const profileData = {
        bio: profile.bio || "",
        qualification: profile.qualification || "",
        availability: profile.availability || "",
    };
    const response = profile.id
        ? await api.put("/tutor-profiles", { id: profile.id, ...profileData })
        : await api.post("/tutor-profiles", profileData);

    return {
        ...profile,
        ...response.data,
    };
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}
