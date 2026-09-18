import api from './api';
import { ChatSession, ChatMessage } from '../types';

export const chatService = {
  async getSessions(): Promise<ChatSession[]> {
    const res = await api.get('/api/v1/chat/sessions/');
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  },

  async createSession(documentId?: string, title?: string): Promise<ChatSession> {
    const res = await api.post('/api/v1/chat/sessions/', {
      document: documentId || null,
      title: title || 'Legal Document Inquiry'
    });
    return res.data;
  },

  async getSession(id: string): Promise<ChatSession> {
    const res = await api.get(`/api/v1/chat/sessions/${id}/`);
    return res.data;
  },

  async sendMessage(sessionId: string, message: string): Promise<{ user_message: ChatMessage; assistant_message: ChatMessage }> {
    const res = await api.post(`/api/v1/chat/sessions/${sessionId}/message/`, { message });
    return res.data;
  }
};
