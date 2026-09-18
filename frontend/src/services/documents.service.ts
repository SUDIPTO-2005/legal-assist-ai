import api from './api';
import { DocumentItem, DocumentFolder } from '../types';

export const documentsService = {
  async getDocuments(params?: { search?: string; document_type?: string; folder?: string }): Promise<{ results: DocumentItem[] }> {
    const res = await api.get('/api/v1/documents/', { params });
    // Normalize DRF pagination or raw list
    return Array.isArray(res.data) ? { results: res.data } : res.data;
  },

  async getDocument(id: string): Promise<DocumentItem> {
    const res = await api.get(`/api/v1/documents/${id}/`);
    return res.data;
  },

  async uploadDocument(formData: FormData): Promise<DocumentItem> {
    const res = await api.post('/api/v1/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async deleteDocument(id: string): Promise<void> {
    await api.delete(`/api/v1/documents/${id}/`);
  },

  async getFolders(): Promise<DocumentFolder[]> {
    const res = await api.get('/api/v1/documents/folders/');
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async createFolder(name: string, color?: string): Promise<DocumentFolder> {
    const res = await api.post('/api/v1/documents/folders/', { name, color: color || '#1E3A5F' });
    return res.data;
  },

  getDownloadUrl(id: string): string {
    return `/api/v1/documents/${id}/download/`;
  }
};
