import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { I, icons } from '../../components/icons';
import sessionApi from '../../services/sessionApi';
import { useAuth } from '../../context/AuthContext';
import '../../styles/app.css';

const STATUS_OPTIONS = ['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }).replace(',', '')
    : '-';

export default function SessionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState('ALL');
  const [topicInput, setTopicInput] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {};
        if (status !== 'ALL') params.status = status;
        if (topicFilter.trim()) params.topic = topicFilter.trim();
        const res = await sessionApi.getAll(params); // GET /api/sessions (public)
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.content) ? res.data.content : [];
        setSessions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load sessions.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status, topicFilter]);

  return (
    <Layout
      role={user?.role === 'STUDENT' ? 'student' : 'tutor'}
      active={user?.role === 'STUDENT' ? 'Browse Tutors' : ''}
      title="Sessions"
      subtitle="Browse all available tutoring sessions."
      action={
        user?.role === 'TUTOR' ? (
          <button className="app-btn-dark" onClick={() => navigate('/sessions/new')}>
            <I size={14}>{icons.plus}</I> Create Session
          </button>
        ) : null
      }
    >
      <div className="app-filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="app-input">
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'ALL' ? 'All statuses' : s.replace('_', ' ')}</option>
          ))}
        </select>
        <form onSubmit={(e) => { e.preventDefault(); setTopicFilter(topicInput); }}>
          <input
            type="text"
            className="app-input"
            placeholder="Search by topic..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          <button type="submit" className="app-btn-dark">Search</button>
        </form>
      </div>

      {error && <div className="app-alert">{error}</div>}
      {loading && <p className="app-empty">Loading sessions...</p>}

      {!loading && !error && sessions.length === 0 && (
        <p className="app-empty">No sessions found. Try a different filter.</p>
      )}

      {!loading && sessions.length > 0 && (
        <div className="app-grid">
          {sessions.map((s) => (
            <div key={s.sessionId} className="app-session-card">
              <div className="card-top">
                <h3>{s.topic || 'Tutoring session'}</h3>
                <span className={`app-status ${s.status.toLowerCase()}`}>{s.status.replace('_', ' ')}</span>
              </div>
              <p className="meta">{formatDateTime(s.startTime)} → {formatDateTime(s.endTime)}</p>
              <p className="meta">{s.isOnline ? 'Online' : s.location || 'Location TBA'}</p>
              <p className="meta">Spots: {s.currentStudents}/{s.maxStudents}</p>
              <Link to={`/sessions/${s.sessionId}`} className="app-btn-dark">View details</Link>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
