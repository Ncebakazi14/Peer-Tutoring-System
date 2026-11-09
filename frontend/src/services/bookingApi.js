import api from './api';

const bookingApi = {
  getMy: () => api.get('/bookings'),
  getRequests: () => api.get('/bookings/requests'),
  create: (data) => api.post('/bookings', data),
  remove: (id) => api.delete(`/bookings/${id}`),
};

export default bookingApi;
