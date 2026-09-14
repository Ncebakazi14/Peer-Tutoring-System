import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sessionApi from '../../services/sessionApi';
import SessionForm from './SessionForm';

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
      setServerError(err.response?.data?.message || 'Could not create the session.');
    }
  };

  return (
    <div className="sessions-page">
      <div className="page-header">
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
    </div>
  );
}
