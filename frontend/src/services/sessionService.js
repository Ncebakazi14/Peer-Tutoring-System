
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const sessionService = {
    getAll: async (filters = {}) => {
        const params = {};

        if (filters.status) params.status = filters.status;
        if (filters.topic?.trim()) params.topic = filters.topic.trim();

        const response = await api.get('/sessions', { params });
        return response.data;
    },

    create: async (session) => {
        const response = await api.post('/sessions', session);
        return response.data;
    },

    update: async (id, session) => {
        const response = await api.put(`/sessions/${id}`, session);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/sessions/${id}`);
    },
};

export default sessionService;
