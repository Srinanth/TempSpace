import api from './axios';

export const filesApi = {
  list: async (token) => {
    const { data } = await api.get('/files', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },
  upload: async (token, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/files/upload', formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return data;
  },
  delete: async (token, fileId) => {
    await api.delete(`/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
  },
  download: async (token, fileId, filename) => {
    const response = await api.get(`/files/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};