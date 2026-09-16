import api from './api';

const bookingApi = {
  getMy: () => api.get('/bookings/my'),
  create: (data) => api.post('/bookings', data),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

export default bookingApi;
