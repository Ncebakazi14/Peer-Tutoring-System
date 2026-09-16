import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import sessionApi from '../../services/sessionApi';
import { useAuth } from '../../context/AuthContext';
import '../../styles/app.css';
import Layout from '../../components/Layout';
import { I, icons } from '../../components/icons';

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

  if (error) return (
    <Layout
      role={user?.role === 'STUDENT' ? 'student' : 'tutor'}
      active={user?.role === 'STUDENT' ? 'Browse Tutors' : 'My Sessions'}
      title="Session"
    >
      <div className="app-alert">{error}</div>
    </Layout>
  );
  if (!session) return (
    <Layout
      role={user?.role === 'STUDENT' ? 'student' : 'tutor'}
      active={user?.role === 'STUDENT' ? 'Browse Tutors' : 'My Sessions'}
      title="Session"
    >
      <p className="app-empty">Loading...</p>
    </Layout>
  );

  return (
      <Layout
        role={user?.role === 'STUDENT' ? 'student' : 'tutor'}
        active={user?.role === 'STUDENT' ? 'Browse Tutors' : 'My Sessions'}
        title={session.topic || 'Tutoring session'}
        subtitle="Session overview"
        action={
          <button className="app-btn-dark" onClick={() => navigate('/sessions')}>
            <I size={14}>{icons.browse}</I> Browse sessions
          </button>
        }
      >
      <div className="app-header">
        <div>
          <h1>{session.topic || 'Tutoring session'}</h1>
          <span className={`app-status ${session.status.toLowerCase()}`}>{session.status.replace('_',' ')}</span>
        </div>
        <Link to="/sessions" className="app-link">← Back to sessions</Link>
      </div>

      {actionMsg && <div className="app-alert">{actionMsg}</div>}

      <div className="app-detail">
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
          <div className="app-actions">
            <button className="app-btn-dark" onClick={() => navigate(`/sessions/${id}/edit`)}>
              Edit
            </button>
            <button className="app-btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
