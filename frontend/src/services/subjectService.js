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

const subjectService = {
    getAll: async () => {
        const response = await api.get('/subjects');
        return response.data;
    },

    create: async (subject) => {
        const response = await api.post('/subjects', subject);
        return response.data;
    },

    update: async (id, subject) => {
        const response = await api.put(`/subjects/${id}`, subject);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/subjects/${id}`);
    },
};

export default subjectService;