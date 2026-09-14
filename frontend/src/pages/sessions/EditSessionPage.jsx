import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import sessionApi from '../../services/sessionApi';
import SessionForm, { isoToLocal } from './SessionForm';

export default function EditSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await sessionApi.getById(id);
        setInitial({
          topic: res.data.topic || '',
          startTime: isoToLocal(res.data.startTime),
          endTime: isoToLocal(res.data.endTime),
          location: res.data.location || '',
          isOnline: res.data.isOnline,
          meetingLink: res.data.meetingLink || '',
          maxStudents: res.data.maxStudents,
        });
      } catch (err) {
        setLoadError(err.response?.data?.message || 'Could not load this session.');
      }
    };
    load();
  }, [id]);

  const handleUpdate = async (payload) => {
    try {
      setServerError('');
      await sessionApi.update(id, payload);
      navigate(`/sessions/${id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not update the session.');
    }
  };

  if (loadError) return <div className="sessions-page"><div className="alert alert-error">{loadError}</div></div>;
  if (!initial) return <div className="sessions-page"><p>Loading...</p></div>;

  return (
    <div className="sessions-page">
      <div className="page-header">
        <div>
          <h1>Edit Session</h1>
          <p>Update the time, place or capacity of this session.</p>
        </div>
      </div>
      <SessionForm
        initialValues={initial}
        submitLabel="Save Changes"
        serverError={serverError}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
