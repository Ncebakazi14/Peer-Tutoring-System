import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the JWT token to authenticated API requests.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const sessionService = {
    // Retrieve all sessions, with optional filters.
    getAll: async (filters = {}) => {
        const params = {};

        if (filters.status) {
            params.status = filters.status;
        }

        if (filters.topic?.trim()) {
            params.topic = filters.topic.trim();
        }

        const response = await api.get('/sessions', { params });
        return response.data;
    },

    // Retrieve sessions belonging to the authenticated user.
    getMine: async () => {
        const response = await api.get('/sessions/mine');
        return response.data;
    },

    // Retrieve the authenticated tutor's profile.
    getMyTutorProfile: async () => {
        const response = await api.get('/tutor-profiles/mine');
        return response.data;
    },

    // Create a new session.
    create: async (session) => {
        const response = await api.post('/sessions', session);
        return response.data;
    },

    // Update an existing session.
    update: async (id, session) => {
        const response = await api.put(`/sessions/${id}`, session);
        return response.data;
    },

    // Delete a session.
    delete: async (id) => {
        await api.delete(`/sessions/${id}`);
    },
};

export default sessionService;