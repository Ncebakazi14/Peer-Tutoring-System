import { useState } from 'react';

// Reusable form used by both Create and Edit.
// Expects: initialValues, submitLabel, serverError, onSubmit(values)
export default function SessionForm({ initialValues, submitLabel, serverError, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [clientError, setClientError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
  };

  const toIso = (localDateTime) => new Date(localDateTime).toISOString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClientError('');

    if (!values.startTime || !values.endTime) {
      setClientError('Please choose a start and end time.');
      return;
    }
    if (new Date(values.endTime) <= new Date(values.startTime)) {
      setClientError('End time must be after start time.');
      return;
    }
    if (Number(values.maxStudents) <= 0) {
      setClientError('Maximum students must be at least 1.');
      return;
    }
    if (values.isOnline && !values.meetingLink.trim()) {
      setClientError('Please provide a meeting link for an online session.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        startTime: toIso(values.startTime),
        endTime: toIso(values.endTime),
        location: values.location,
        isOnline: values.isOnline,
        meetingLink: values.isOnline ? values.meetingLink : null,
        maxStudents: Number(values.maxStudents),
        topic: values.topic,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="session-form" onSubmit={handleSubmit}>
      {(clientError || serverError) && (
        <div className="alert alert-error">{clientError || serverError}</div>
      )}

      <label>Topic</label>
      <input name="topic" className="input" value={values.topic}
        onChange={handleChange} placeholder="e.g. Linked Lists" required />

      <div className="row">
        <div>
          <label>Start time</label>
          <input type="datetime-local" name="startTime" className="input"
            value={values.startTime} onChange={handleChange} required />
        </div>
        <div>
          <label>End time</label>
          <input type="datetime-local" name="endTime" className="input"
            value={values.endTime} onChange={handleChange} required />
        </div>
      </div>

      <label className="checkbox">
        <input type="checkbox" name="isOnline" checked={values.isOnline} onChange={handleChange} />
        This is an online session
      </label>

      {!values.isOnline && (
        <>
          <label>Location</label>
          <input name="location" className="input" value={values.location}
            onChange={handleChange} placeholder="e.g. Library Room 4" required />
        </>
      )}

      {values.isOnline && (
        <>
          <label>Meeting link</label>
          <input name="meetingLink" className="input" value={values.meetingLink}
            onChange={handleChange} placeholder="e.g. https://meet.google.com/..." required />
        </>
      )}

      <label>Maximum students</label>
      <input type="number" name="maxStudents" className="input" min="1"
        value={values.maxStudents} onChange={handleChange} required />

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}

// Helper: ISO string -> "YYYY-MM-DDTHH:mm" for datetime-local inputs
export const isoToLocal = (iso) => (iso ? iso.slice(0, 16) : '');
