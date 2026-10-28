import { useEffect, useState } from 'react';
import SubjectApi from '../../api/SubjectApi';
import Layout from '../../components/Layout';
import '../../styles/app.css';

const emptySubject = { code: '', name: '', description: '' };

export default function MySubjects() {
    const [subjects, setSubjects] = useState([]);
    const [form, setForm] = useState(emptySubject);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const loadSubjects = async () => {
        try {
            setLoading(true);
            const response = await SubjectApi.getAll();
            setSubjects(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not load subjects.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubjects();
    }, []);

    const handleChange = (event) => {
        setForm((current) => ({
            ...current,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSaving(true);
        try {
            if (editingId === null) {
                await SubjectApi.create(form);
            } else {
                await SubjectApi.update(editingId, form);
            }
            setForm(emptySubject);
            setEditingId(null);
            await loadSubjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save subject.');
        } finally {
            setSaving(false);
        }
    };

    const editSubject = (subject) => {
        setEditingId(subject.subjectId);
        setForm({
            code: subject.code || '',
            name: subject.name || '',
            description: subject.description || '',
        });
    };

    const deleteSubject = async (id) => {
        if (!window.confirm('Delete this subject?')) return;
        try {
            await SubjectApi.remove(id);
            setSubjects((current) =>
                current.filter((subject) => subject.subjectId !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Could not delete subject.');
        }
    };

    return (
        <Layout
            role="tutor"
            active="My Subjects"
            title="My Subjects"
            subtitle="Manage the subjects you offer to students."
        >
            {error && <div className="app-alert">{error}</div>}

            <form className="app-form" onSubmit={handleSubmit}>
                <h2>{editingId === null ? 'Add Subject' : 'Edit Subject'}</h2>
                <label>Code</label>
                <input className="app-input" name="code" value={form.code}
                    onChange={handleChange} required />
                <label>Name</label>
                <input className="app-input" name="name" value={form.name}
                    onChange={handleChange} required />
                <label>Description</label>
                <textarea className="app-input" name="description"
                    value={form.description} onChange={handleChange} rows="3" />
                <button className="app-btn-dark" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingId === null ? 'Add Subject' : 'Save Changes'}
                </button>
                {editingId !== null && (
                    <button className="app-btn-dark" type="button"
                        onClick={() => { setEditingId(null); setForm(emptySubject); }}>
                        Cancel
                    </button>
                )}
            </form>

            <div className="app-card">
                {loading && <p className="app-empty">Loading subjects...</p>}
                {!loading && subjects.length === 0 && (
                    <p className="app-empty">No subjects have been added yet.</p>
                )}
                {!loading && subjects.length > 0 && (
                    <table className="app-table">
                        <thead>
                            <tr><th>Code</th><th>Subject</th><th>Description</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.subjectId}>
                                    <td>{subject.code}</td>
                                    <td>{subject.name}</td>
                                    <td>{subject.description || '-'}</td>
                                    <td>
                                        <button className="app-btn-dark" type="button"
                                            onClick={() => editSubject(subject)}>Edit</button>
                                        <button className="app-btn-danger" type="button"
                                            onClick={() => deleteSubject(subject.subjectId)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}
