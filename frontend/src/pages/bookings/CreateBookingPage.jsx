import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { I, icons } from '../../components/icons';
import sessionApi from '../../services/sessionApi';
import bookingApi from '../../services/bookingApi';
import '../../styles/app.css';

export default function CreateBookingPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await sessionApi.getAll();
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.content) ? res.data.content : [];
        setSessions(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load sessions.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selected) return setError('Please select a session to book.');
    setSubmitting(true);
    try {
      await bookingApi.create({ sessionId: selected });
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || (err.message || 'Could not create booking.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout role="student" active="My Bookings" title="New Booking" subtitle="Choose a session to book">
      {error && <div className="app-alert">{error}</div>}
      {loading ? (
        <p className="app-empty">Loading sessions...</p>
      ) : (
        <form className="app-form" onSubmit={handleSubmit}>
          <label>Available sessions</label>
          <select className="app-input" value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">-- Select a session --</option>
            {sessions.map((s) => (
              <option key={s.sessionId} value={s.sessionId}>
                {s.topic} — {new Date(s.startTime).toLocaleString()}
              </option>
            ))}
          </select>

          <div style={{ marginTop: 14 }}>
            <button type="submit" className="app-btn-dark" disabled={submitting}>
              {submitting ? 'Booking...' : 'Create Booking'}
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
}
