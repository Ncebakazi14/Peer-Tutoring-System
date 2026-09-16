import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sessionApi from '../../services/sessionApi';
import { useAuth } from '../../context/AuthContext';
import '../../styles/app.css';

import Layout from '../../components/Layout';
import { I, icons } from '../../components/icons';

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
    ['My Bookings', 'bookings', '/my-bookings'],
    ['Reviews', 'reviews', '#'],
    ['Earnings', 'earnings', '#'],
    ['Notifications', 'notifications', '#'],
    ['Settings', 'settings', '#'],
  ];

  return (
    <Layout
      role="tutor"
      active="My Sessions"
      title="My Sessions"
      subtitle="Create and manage your available tutoring sessions."
      action={(
        <button className="app-btn-dark" onClick={() => navigate('/sessions/new')}>
          <I size={14}>{icons.plus}</I> Create Session
        </button>
      )}
    >
      <div className="app-tabs">
        {['upcoming', 'recurring', 'past'].map((t) => (
          <button key={t} className={tab === t ? 'app-tab active' : 'app-tab'} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <div className="app-alert">{error}</div>}

      <div className="app-card">
        {loading && <p className="app-empty">Loading...</p>}

        {!loading && shown.length === 0 && (
          <p className="app-empty">No {tab} sessions.</p>
        )}

        {!loading && shown.length > 0 && (
          <table className="app-table">
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
                    <span className={wireframeStatus(s) === 'Booked' ? 'app-status booked' : 'app-status available-status'}>
                      {wireframeStatus(s)}
                    </span>
                  </td>
                  <td>
                    <div className="app-actions">
                      <button className="app-icon-btn" title="Edit" onClick={() => navigate(`/sessions/${s.sessionId}/edit`)}>
                        <I size={15}>{icons.pencil}</I>
                      </button>
                      <button className="app-icon-btn danger" title="Delete" onClick={() => handleDelete(s.sessionId)}>
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

      <button className="app-add-slot" onClick={() => navigate('/sessions/new')}>
        <I size={15}>{icons.plus}</I> Add New Session Slot
      </button>
    </Layout>
  );
}
