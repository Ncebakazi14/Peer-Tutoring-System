import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

// Attach the logged-in user's JWT token to requests.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const TutorApi = {
    // Retrieve all tutor profiles.
    getAllTutorProfiles: async () => {
        const response = await api.get('/tutor-profiles');
        return response.data;
    },

    // Retrieve one tutor profile by ID.
    getTutorProfileById: async (id) => {
        const response = await api.get(`/tutor-profiles/${id}`);
        return response.data;
    },

    // Retrieve all subjects.
    getAllSubjects: async () => {
        const response = await api.get('/subjects');
        return response.data;
    },
};

export default TutorApi;