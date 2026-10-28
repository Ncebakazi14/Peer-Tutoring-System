
import { useEffect, useState } from "react";
import "./Settings.css";

const API_URL = "http://localhost:8080/api/settings";

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadSettings() {
      if (!token) {
        setError("Please log in to access your settings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Your session has expired. Please log in again."
              : "Could not load your account settings."
          );
        }

        setProfile(await response.json());
      } catch (err) {
        setError(err.message || "Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [token]);

  function updateProfileField(event) {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  }

  function updatePasswordField(event) {
    const { name, value } = event.target;
    setPasswords((previous) => ({ ...previous, [name]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSavingProfile(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.detail || body.message || "Could not update your profile."
        );
      }

      const updated = await response.json();
      setProfile(updated);
      setNotice("Your profile settings have been saved.");
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (passwords.newPassword.length < 8) {
      setError("Your new password must contain at least 8 characters.");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch(`${API_URL}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.detail || body.message || "Could not change your password."
        );
      }

      setPasswords({ currentPassword: "", newPassword: "" });
      setNotice("Your password has been changed successfully.");
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return <main className="settings-page"><p>Loading settings...</p></main>;
  }

  return (
    <main className="settings-page">
      <header className="settings-heading">
        <p className="settings-eyebrow">YOUR ACCOUNT</p>
        <h1>Settings</h1>
        <p>Manage your profile details and keep your account secure.</p>
      </header>

      {error && <div className="settings-alert error">{error}</div>}
      {notice && <div className="settings-alert success">{notice}</div>}

      <section className="settings-card">
        <div className="settings-card-heading">
          <div className="settings-icon">◉</div>
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
                onChange={updateProfileField}
                required
              />
            </div>

            <div className="settings-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={updateProfileField}
                required
              />
            </div>

            <div className="settings-field settings-full-width">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={updateProfileField}
                required
              />
              <small>If you change your email, you may need to log in again.</small>
            </div>

            <div className="settings-field settings-full-width">
              <label htmlFor="role">Account role</label>
              <input id="role" value={profile.role || ""} readOnly />
              <small>Your account role cannot be changed here.</small>
            </div>
          </div>

          <div className="settings-actions">
            <button type="submit" disabled={savingProfile || !token}>
              {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <div className="settings-icon">♧</div>
          <div>
            <h2>Change password</h2>
            <p>Choose a strong password with at least 8 characters.</p>
          </div>
        </div>

        <form onSubmit={changePassword}>
          <div className="settings-form-grid">
            <div className="settings-field settings-full-width">
              <label htmlFor="currentPassword">Current password</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={updatePasswordField}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="settings-field settings-full-width">
              <label htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={updatePasswordField}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="settings-actions">
            <button type="submit" disabled={savingPassword || !token}>
              {savingPassword ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
