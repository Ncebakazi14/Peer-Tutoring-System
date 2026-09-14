import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import sessionApi from '../../services/sessionApi';
import { useAuth } from '../../context/AuthContext';
import './sessions.css';

const STATUS_OPTIONS = ['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
};

const formatDateTime = (iso) => {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('en-ZA', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export default function SessionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState('ALL');
  const [topicInput, setTopicInput] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (status !== 'ALL') params.status = status;
      if (topicFilter.trim()) params.topic = topicFilter.trim();
      const res = await sessionApi.getAll(params);
      setSessions(toArray(res.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSessions(); }, [status, topicFilter]);

  const statusBadge = (s) => <span className={`badge badge-${s.toLowerCase()}`}>{s}</span>;

  return (
    <div className="sessions-page">
      <div className="page-header">
        <div>
          <h1>Sessions</h1>
          <p>Browse all available tutoring sessions.</p>
        </div>
        {user?.role === 'TUTOR' && (
          <button className="btn btn-primary" onClick={() => navigate('/sessions/new')}>
            + Create Session
          </button>
        )}
      </div>

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'ALL' ? 'All statuses' : s.replace('_', ' ')}</option>)}
        </select>
        <form onSubmit={(e) => { e.preventDefault(); setTopicFilter(topicInput); }} className="topic-search">
          <input
            type="text"
            className="input"
            placeholder="Search by topic..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading && <p>Loading sessions...</p>}

      {!loading && !error && sessions.length === 0 && (
        <p className="empty">No sessions found. Try a different filter.</p>
      )}

      {!loading && sessions.length > 0 && (
        <div className="session-grid">
          {sessions.map((s) => (
            <div key={s.sessionId} className="session-card">
              <div className="card-top">
                <h3>{s.topic || 'Tutoring session'}</h3>
                {statusBadge(s.status)}
              </div>
              <p className="meta">
                {formatDateTime(s.startTime)} â†’ {formatDateTime(s.endTime)}
              </p>
              <p className="meta">{s.isOnline ? 'Online' : (s.location || 'Location TBA')}</p>
              <p className="meta">
                Spots: {s.currentStudents}/{s.maxStudents}
              </p>
              <Link to={`/sessions/${s.sessionId}`} className="btn btn-outline">View details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
