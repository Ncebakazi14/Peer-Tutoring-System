
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'peer_tutor_bookings';

const tutors = [
  { id: 'thabang', name: 'Thabang Ndouvhada', subject: 'Computer Science', price: 260 },
  { id: 'maths', name: 'Megan Lewis', subject: 'Mathematics', price: 220 },
  { id: 'physics', name: 'Kabelo Ndlovu', subject: 'Physics', price: 180 },
  { id: 'chem', name: 'Aaliyah Khan', subject: 'Chemistry', price: 210 },
];

export default function Bookings() {
  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  const [tutorId, setTutorId] = useState(tutors[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [sessionType, setSessionType] = useState('Revision');
  const [message, setMessage] = useState('');

  const selectedTutor = tutors.find(t => t.id === tutorId) || tutors[0];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  function createBooking(event) {
    event.preventDefault();

    if (!date || date < new Date().toLocaleDateString('en-CA')) {
      setMessage('Please choose today or a future date.');
      return;
    }

    const booking = {
      id: crypto.randomUUID(),
      tutorId: selectedTutor.id,
      tutorName: selectedTutor.name,
      subject: selectedTutor.subject,
      amount: selectedTutor.price,
      bookingDate: date,
      bookingTime: time,
      sessionType,
      status: 'Pending',
    };

    setBookings(previous => [booking, ...previous]);
    setMessage('Booking added to this browser.');
  }

  function cancelBooking(id) {
    setBookings(previous => previous.filter(b => b.id !== id));
    setMessage('Booking removed from this browser.');
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>My Bookings</h1>
          <p>Choose a tutor and manage your booking requests.</p>
        </div>
      </div>

      {message && <p role="status">{message}</p>}

      <section className="dashboard-card">
        <h2>Book a tutoring session</h2>

        <form onSubmit={createBooking}>
          <label htmlFor="bookingTutor">Tutor</label>
          <select
            id="bookingTutor"
            value={tutorId}
            onChange={e => setTutorId(e.target.value)}
          >
            {tutors.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.subject}
              </option>
            ))}
          </select>

          <p>Price: R{selectedTutor.price} per session</p>

          <label htmlFor="bookingDate">Date</label>
          <input
            id="bookingDate"
            type="date"
            min={new Date().toLocaleDateString('en-CA')}
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />

          <label htmlFor="bookingTime">Time</label>
          <input
            id="bookingTime"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />

          <label htmlFor="sessionType">Session type</label>
          <select
            id="sessionType"
            value={sessionType}
            onChange={e => setSessionType(e.target.value)}
          >
            <option>Revision</option>
            <option>Exam preparation</option>
            <option>Assignment support</option>
            <option>General tutoring</option>
          </select>

          <button type="submit">Request booking</button>
        </form>
      </section>

      <section className="dashboard-card">
        <h2>Your bookings ({bookings.length})</h2>

        {bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          bookings.map(booking => (
            <article key={booking.id}>
              <h3>{booking.tutorName}</h3>
              <p>{booking.subject}</p>
              <p>
                {booking.bookingDate} at {booking.bookingTime}
              </p>
              <p>Session: {booking.sessionType}</p>
              <p>Price: R{booking.amount}</p>
              <p>Status: {booking.status}</p>
              <button
                type="button"
                onClick={() => cancelBooking(booking.id)}
              >
                Remove booking
              </button>
              <hr />
            </article>
          ))
        )}
      </section>
    </main>
  );
}
