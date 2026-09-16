import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sessionApi from '../../services/sessionApi';
import SessionForm from './SessionForm';
import Layout from '../../components/Layout';
import { I, icons } from '../../components/icons';
import '../../styles/app.css';

export default function CreateSessionPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const empty = {
    topic: '',
    startTime: '',
    endTime: '',
    location: '',
    isOnline: false,
    meetingLink: '',
    maxStudents: 1,
  };

  const handleCreate = async (payload) => {
    try {
      setServerError('');
      const res = await sessionApi.create(payload);
      navigate(`/sessions/${res.data.sessionId}`);
    } catch (err) {
      const resp = err.response;
      const msg = resp?.data?.message || (resp?.data ? JSON.stringify(resp.data) : resp?.status ? `${resp.status} ${resp.statusText}` : err.message);
      setServerError(msg || 'Could not create the session.');
      console.error('Create session error:', err);
    }
  };

  return (
    <Layout
      role="tutor"
      active="My Sessions"
      title="Create Session"
      subtitle="Schedule a new tutoring session. Status starts as SCHEDULED."
      action={
        <button className="app-btn-dark" onClick={() => navigate('/my-sessions')}>
          <I size={14}>{icons.sessions}</I> Back to My Sessions
        </button>
      }
    >
      <div className="app-header">
        <div>
          <h1>Create Session</h1>
          <p>Schedule a new tutoring session. Status starts as SCHEDULED.</p>
        </div>
      </div>
      <SessionForm
        initialValues={empty}
        submitLabel="Create Session"
        serverError={serverError}
        onSubmit={handleCreate}
      />
    </Layout>
  );
}
