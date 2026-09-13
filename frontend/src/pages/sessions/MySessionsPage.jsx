import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sessionApi from '../../services/sessionApi';
import { useAuth } from '../../context/AuthContext';
import './mySessions.css';

const I = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const icons = {
  dashboard: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9 21v-6h6v6" /></>,
  profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" /></>,
  subjects: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z" /><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" /></>,
  sessions: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4M16 3v4" /></>,
  bookings: <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4a2 2 0 0 1 6 0" /><path d="m9 14 2 2 4-4" /></>,
  reviews: <path d="m12 3 2.7 5.8 6.3.8-4.6 4.3 1.2 6.1L12 17l-5.6 3 1.2-6.1L3 9.6l6.3-.8z" />,
  earnings: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M5.5 9.5h.01M18.5 14.5h.01" /></>,
  notifications: <><path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.15-1.4l2-1.55-2-3.46-2.35.95A7 7 0 0 0 14.1 5.1L13.75 2.6h-3.5L9.9 5.1a7 7 0 0 0-2.4 1.44l-2.35-.95-2 3.46 2 1.55a7 7 0 0 0 0 2.8l-2 1.55 2 3.46 2.35-.95a7 7 0 0 0 2.4 1.44l.35 2.5h3.5l.35-2.5a7 7 0 0 0 2.4-1.44l2.35.95 2-3.46-2-1.55c.1-.45.15-.92.15-1.4z" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></>,
  pencil: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  trash: <><path d="M3 6h18" /><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  bell: <><path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9" /><path d="M10 20a2.2 2.2 0 0 0 4 0" /></>,
  cap: <><path d="M2 9.5 12 4l10 5.5L12 15z" /><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" /><path d="M22 9.5V15" /></>,
};

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }).replace(',', '')
    : '-';

const durationHrs = (start, end) =>
  (((new Date(end) - new Date(start)) / 3600000).toFixed(1)) + ' hrs';

export default function MySessionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await sessionApi.getMy();
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.content) ? res.data.content : [];
      setSessions(data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Delete this session? This cannot be undone.')) return;
    try {
      await sessionApi.remove(sessionId);
      setSessions((list) => list.filter((s) => s.sessionId !== sessionId));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this session.');
    }
  };

  const now = new Date();
  const upcoming = sessions.filter((s) => new Date(s.startTime) >= now && s.status !== 'CANCELLED');
  const past = sessions.filter((s) => new Date(s.startTime) < now || s.status === 'CANCELLED' || s.status === 'COMPLETED');
  const recurring = [];

  const shown = tab === 'upcoming' ? upcoming : tab === 'past' ? past : recurring;

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'TN'
    : 'TN';

  const wireframeStatus = (s) => (s.currentStudents > 0 ? 'Booked' : 'Available');

  const nav = [
    ['Dashboard', 'dashboard', '#'],
    ['My Profile', 'profile', '#'],
    ['My Subjects', 'subjects', '#'],
    ['My Sessions', 'sessions', '/my-sessions'],
    ['My Bookings', 'bookings', '#'],
    ['Reviews', 'reviews', '#'],
    ['Earnings', 'earnings', '#'],
    ['Notifications', 'notifications', '#'],
    ['Settings', 'settings', '#'],
  ];

  return (
    <div className="ms-shell">
      <aside className="ms-sidebar">
        <div className="ms-brand">
          <I size={18}>{icons.cap}</I> PEER TUTORING
        </div>
        <nav className="ms-nav">
          {nav.map(([label, icon, to]) => (
            <a key={label} href={to} className={label === 'My Sessions' ? 'ms-nav-item active' : 'ms-nav-item'}>
              <I size={16}>{icons[icon]}</I> {label}
            </a>
          ))}
          <a href="#" className="ms-nav-item">
            <I size={16}>{icons.logout}</I> Logout
          </a>
        </nav>
      </aside>

      <main className="ms-main">
        <header className="ms-topbar">
          <button className="ms-icon-btn" title="Notifications"><I size={18}>{icons.bell}</I></button>
          <div className="ms-avatar">{initials}</div>
        </header>

        <div className="ms-content">
          <div className="ms-header">
            <div>
              <h1>My Sessions</h1>
              <p>Create and manage your available tutoring sessions.</p>
            </div>
            <button className="ms-btn-dark" onClick={() => navigate('/sessions/new')}>
              <I size={14}>{icons.plus}</I> Create Session
            </button>
          </div>

          <div className="ms-tabs">
            {['upcoming', 'recurring', 'past'].map((t) => (
              <button key={t} className={tab === t ? 'ms-tab active' : 'ms-tab'} onClick={() => setTab(t)}>
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {error && <div className="ms-alert">{error}</div>}

          <div className="ms-card">
            {loading && <p className="ms-empty">Loading...</p>}

            {!loading && shown.length === 0 && (
              <p className="ms-empty">No {tab} sessions.</p>
            )}

            {!loading && shown.length > 0 && (
              <table className="ms-table">
                <thead>
                  <tr>
                    <th>Date &amp; Time</th>
                    <th>Subject</th>
                    <th>Duration</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((s) => (
                    <tr key={s.sessionId}>
                      <td>{formatDateTime(s.startTime)}</td>
                      <td>{s.subjectName || s.topic || '-'}</td>
                      <td>{durationHrs(s.startTime, s.endTime)}</td>
                      <td>{s.isOnline ? 'Online' : s.location || '-'}</td>
                      <td>
                        <span className={wireframeStatus(s) === 'Booked' ? 'ms-status booked' : 'ms-status available'}>
                          {wireframeStatus(s)}
                        </span>
                      </td>
                      <td>
                        <div className="ms-actions">
                          <button className="ms-icon-btn" title="Edit" onClick={() => navigate(`/sessions/${s.sessionId}/edit`)}>
                            <I size={15}>{icons.pencil}</I>
                          </button>
                          <button className="ms-icon-btn danger" title="Delete" onClick={() => handleDelete(s.sessionId)}>
                            <I size={15}>{icons.trash}</I>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <button className="ms-add-slot" onClick={() => navigate('/sessions/new')}>
            <I size={15}>{icons.plus}</I> Add New Session Slot
          </button>
        </div>
      </main>
    </div>
  );
}
