import api from './axios';

export const spaceApi = {
  create: async () => {
    const { data } = await api.post('/spaces');
    return data;
  },
  join: async (code) => {
    const { data } = await api.post('/spaces/join', { code });
    return data;
  },
  unlock: async (spaceId, password) => {
    const { data } = await api.post('/spaces/unlock', { spaceId, password });
    return data;
  },
  getDetails: async (token) => {
    const { data } = await api.get('/spaces', { 
        headers: { Authorization: `Bearer ${token}` } 
    });
    return data;
  },
  updateSettings: async (token, settings) => {
    const { data } = await api.patch('/spaces', settings, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  }
};