import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (storedUser?.id) {
    config.headers['X-User-Id'] = storedUser.id;
  }

  return config;
});

export default api;
