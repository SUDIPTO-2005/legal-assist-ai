import api from './api';
import { AIAuditLog } from '../types';

export const auditService = {
  async getAuditLogs(params?: { action_type?: string; escalation_triggered?: boolean }): Promise<AIAuditLog[]> {
    const res = await api.get('/api/v1/audit/', { params });
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  }
};
