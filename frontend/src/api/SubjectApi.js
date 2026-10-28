import api from '../services/api';

const SubjectApi = {
    getAll: () => api.get('/subjects/mine'),
    create: (data) => api.post('/subjects', data),
    update: (id, data) => api.put(`/subjects/${id}`, data),
    remove: (id) => api.delete(`/subjects/${id}`),
};

export default SubjectApi;
