
import { useEffect, useState } from 'react';
import subjectService from '../../services/subjectService';

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState({
        code: '',
        name: '',
        description: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function loadSubjects() {
        setLoading(true);
        setError('');

        try {
            const data = await subjectService.getAll();
            setSubjects(data);
        } catch (err) {
            setError(
                err.response?.status === 401 || err.response?.status === 403
                    ? 'Your session may have expired. Please log in again.'
                    : 'Could not load subjects. Check that the backend is running.'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSubjects();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function resetForm() {
        setForm({ code: '', name: '', description: '' });
        setEditingId(null);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        const subject = {
            code: form.code.trim(),
            name: form.name.trim(),
            description: form.description.trim(),
        };

        try {
            if (editingId !== null) {
                await subjectService.update(editingId, subject);
                setSuccess('Subject updated successfully.');
            } else {
                await subjectService.create(subject);
                setSuccess('Subject added successfully.');
            }

            resetForm();
            await loadSubjects();
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Access denied. Please log in again and retry.');
            } else if (err.response?.status === 400) {
                setError('Please check the subject details and try again.');
            } else {
                setError(
                    err.response?.data?.message ||
                    'Could not save the subject. A subject code may already exist.'
                );
            }
        } finally {
            setSaving(false);
        }
    }

    function startEditing(subject) {
        setEditingId(subject.subjectId);
        setForm({
            code: subject.code ?? '',
            name: subject.name ?? '',
            description: subject.description ?? '',
        });
        setError('');
        setSuccess('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleDelete(subject) {
        const confirmed = window.confirm(
            `Delete "${subject.name}" (${subject.code})?`
        );

        if (!confirmed) return;

        setError('');
        setSuccess('');

        try {
            await subjectService.delete(subject.subjectId);
            setSuccess('Subject deleted successfully.');

            if (editingId === subject.subjectId) {
                resetForm();
            }

            await loadSubjects();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Could not delete the subject. Please try again.'
            );
        }
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-label">STUDENT PORTAL</span>
                    <h1>Subjects</h1>
                    <p>Browse and manage tutoring subjects.</p>
                </div>
            </div>

            <section className="dashboard-section">
                <h2>{editingId !== null ? 'Edit Subject' : 'Add a Subject'}</h2>

                {error && (
                    <p role="alert" style={{ color: '#b42318' }}>
                        {error}
                    </p>
                )}

                {success && (
                    <p role="status" style={{ color: '#18794e' }}>
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="subject-code">Subject code</label>
                        <input
                            id="subject-code"
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            placeholder="e.g. MATH101"
                            required
                            maxLength={30}
                            style={{ display: 'block', width: '100%', padding: '0.7rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="subject-name">Subject name</label>
                        <input
                            id="subject-name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="e.g. Mathematics"
                            required
                            maxLength={100}
                            style={{ display: 'block', width: '100%', padding: '0.7rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="subject-description">Description</label>
                        <textarea
                            id="subject-description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe this subject"
                            rows={3}
                            style={{ display: 'block', width: '100%', padding: '0.7rem' }}
                        />
                    </div>

                    <button type="submit" disabled={saving}>
                        {saving
                            ? 'Saving...'
                            : editingId !== null
                                ? 'Save Changes'
                                : 'Add Subject'}
                    </button>

                    {editingId !== null && (
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={saving}
                            style={{ marginLeft: '0.5rem' }}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </section>

            <section className="dashboard-section">
                <h2>Available Subjects</h2>

                {loading ? (
                    <p>Loading subjects...</p>
                ) : subjects.length === 0 ? (
                    <p>No subjects have been added yet.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '0.7rem' }}>Code</th>
                                    <th style={{ textAlign: 'left', padding: '0.7rem' }}>Name</th>
                                    <th style={{ textAlign: 'left', padding: '0.7rem' }}>Description</th>
                                    <th style={{ textAlign: 'left', padding: '0.7rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map((subject) => (
                                    <tr key={subject.subjectId}>
                                        <td style={{ padding: '0.7rem' }}>{subject.code}</td>
                                        <td style={{ padding: '0.7rem' }}>{subject.name}</td>
                                        <td style={{ padding: '0.7rem' }}>
                                            {subject.description || '—'}
                                        </td>
                                        <td style={{ padding: '0.7rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => startEditing(subject)}
                                            >
                                                Edit
                                            </button>
                                            {' '}
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(subject)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <button
                    type="button"
                    onClick={loadSubjects}
                    disabled={loading}
                    style={{ marginTop: '1rem' }}
                >
                    Refresh Subjects
                </button>
            </section>
        </div>
    );
}

export default Subjects;
