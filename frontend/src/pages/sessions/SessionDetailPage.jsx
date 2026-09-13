import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import sessionApi from '../../services/sessionApi';
import { useAuth } from '../../context/AuthContext';
import './sessions.css';

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '-';

export default function SessionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await sessionApi.getById(id);
        setSession(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this session.');
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this session? This cannot be undone.')) return;
    setDeleting(true);
    setActionMsg('');
    try {
      await sessionApi.remove(id);
      navigate('/sessions');
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Could not delete this session.');
      setDeleting(false);
    }
  };

  if (error) return <div className="sessions-page"><div className="alert alert-error">{error}</div></div>;
  if (!session) return <div className="sessions-page"><p>Loading...</p></div>;

  return (
    <div className="sessions-page">
      <div className="page-header">
        <div>
          <h1>{session.topic || 'Tutoring session'}</h1>
          <span className={`badge badge-${session.status.toLowerCase()}`}>{session.status}</span>
        </div>
        <Link to="/sessions" className="btn btn-outline">← Back to sessions</Link>
      </div>

      {actionMsg && <div className="alert alert-error">{actionMsg}</div>}

      <div className="detail-card">
        <dl>
          <dt>Starts</dt><dd>{formatDateTime(session.startTime)}</dd>
          <dt>Ends</dt><dd>{formatDateTime(session.endTime)}</dd>
          <dt>Format</dt><dd>{session.isOnline ? 'Online' : 'In person'}</dd>
          {!session.isOnline && (<><dt>Location</dt><dd>{session.location || 'TBA'}</dd></>)}
          {session.isOnline && (<><dt>Meeting link</dt><dd>{session.meetingLink || 'TBA'}</dd></>)}
          <dt>Spots</dt><dd>{session.currentStudents} / {session.maxStudents} booked</dd>
          <dt>Tutor profile</dt><dd>#{session.tutorProfileId}</dd>
        </dl>

        {user?.role === 'TUTOR' && (
          <div className="actions">
            <button className="btn btn-primary" onClick={() => navigate(`/sessions/${id}/edit`)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
