import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bookingApi from '../../services/bookingApi';
import { useAuth } from '../../context/AuthContext';
import '../../styles/app.css';

import Layout from '../../components/Layout';
import { I, icons } from '../../components/icons';

const TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }).replace(',', '')
    : '-';

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingApi.getMy();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingApi.updateStatus(bookingId, 'CANCELLED');
      setBookings((list) =>
        list.map((b) => (b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel this booking.');
    }
  };

  const shown = tab === 'all'
    ? bookings
    : bookings.filter((b) => (b.status || '').toUpperCase() === tab.toUpperCase());

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'ST'
    : 'ST';

  const rowTutor = (b) => b.tutorName || b.session?.tutorName || b.tutor?.name || '-';
  const rowSubject = (b) => b.subjectName || b.session?.topic || b.subject || '-';
  const rowWhen = (b) => b.session?.startTime || b.startTime || b.bookingDate;

  const nav = [
    ['Dashboard', 'dashboard', '#'],
    ['Browse Tutors', 'browse', '/sessions'],
    ['My Bookings', 'bookings', '/my-bookings'],
    ['My Reviews', 'reviews', '#'],
    ['Messages', 'messages', '#'],
    ['Notifications', 'notifications', '#'],
    ['Settings', 'settings', '#'],
  ];

  return (
    <Layout
      role="student"
      active="My Bookings"
      title="My Bookings"
      subtitle="View and manage your booked tutoring sessions."
      action={(
        <button className="app-btn-dark" onClick={() => navigate('/bookings/new')}>
          <I size={14}>{icons.plus}</I> New Booking
        </button>
      )}
    >

      <div className="app-tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? 'app-tab active' : 'app-tab'} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {error && <div className="app-alert">{error}</div>}

      <div className="app-card">
        {loading && <p className="app-empty">Loading...</p>}

        {!loading && shown.length === 0 && (
          <p className="app-empty">
            No {tab === 'all' ? '' : tab + ' '}bookings.
            <Link to="/sessions" className="app-link"> Browse sessions to book one.</Link>
          </p>
        )}

        {!loading && shown.length > 0 && (
          <table className="app-table">
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Tutor</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((b) => {
                const status = (b.status || 'PENDING').toUpperCase();
                return (
                  <tr key={b.bookingId || b.id}>
                    <td>{formatDateTime(rowWhen(b))}</td>
                    <td>{rowTutor(b)}</td>
                    <td>{rowSubject(b)}</td>
                    <td>
                      <span className={`app-status ${status.toLowerCase()}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="app-actions">
                        <Link to={`/sessions/${b.sessionId}`} className="app-icon-btn" title="View session">
                          <I size={15}>{icons.eye}</I>
                        </Link>
                        {(status === 'PENDING' || status === 'CONFIRMED') && (
                          <button className="app-icon-btn danger" title="Cancel booking"
                            onClick={() => handleCancel(b.bookingId || b.id)}>
                            <I size={15}>{icons.x}</I>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </Layout>
  );
}
