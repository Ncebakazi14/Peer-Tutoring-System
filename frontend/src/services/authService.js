import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const authService = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

export default authService;