import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const API_URL = '/student';

const StudentApi = {
    getAllStudents: async () => {
        throw new Error(
            'The backend does not currently provide a get-all-students endpoint.'
        );
    },

    getStudentById: async (studentId) => {
        const response = await api.get(
            `${API_URL}/read/${encodeURIComponent(studentId)}`
        );
        return response.data;
    },

    createStudent: async (studentData) => {
        const response = await api.post(
            `${API_URL}/create`,
            studentData
        );
        return response.data;
    },

    updateStudent: async (studentData) => {
        const response = await api.put(
            `${API_URL}/update`,
            studentData
        );
        return response.data;
    },

    deleteStudent: async (studentId) => {
        const response = await api.delete(
            `${API_URL}/delete/${encodeURIComponent(studentId)}`
        );
        return response.data;
    },
};

export default StudentApi;