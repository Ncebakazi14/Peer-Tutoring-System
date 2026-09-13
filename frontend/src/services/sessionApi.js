import api from './api';

// All Session endpoints - the JWT is attached automatically by the
// Axios interceptor in src/services/api.js
const sessionApi = {
  // GET /api/sessions?status=&topic=  (public)
  getAll: (params = {}) => api.get('/sessions', { params }),

  // GET /api/sessions/{id}            (public)
  getById: (id) => api.get(`/sessions/${id}`),

  // GET /api/sessions/my              (TUTOR only - optional)
  getMy: () => api.get('/sessions/my'),

  // POST /api/sessions                (TUTOR only)
  create: (data) => api.post('/sessions', data),

  // PUT /api/sessions/{id}            (owner only)
  update: (id, data) => api.put(`/sessions/${id}`, data),

  // DELETE /api/sessions/{id}         (owner only, 409 if bookings exist)
  remove: (id) => api.delete(`/sessions/${id}`),
};

export default sessionApi;