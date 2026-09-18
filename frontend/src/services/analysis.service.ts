import api from './api';
import { AnalysisResult, ComparisonReport } from '../types';

export const analysisService = {
  async triggerAnalysis(documentId: string, explanationMode?: string, language?: string): Promise<AnalysisResult> {
    const res = await api.post(`/api/v1/analysis/document/${documentId}/trigger/`, {
      explanation_mode: explanationMode,
      language: language
    });
    return res.data;
  },

  async getLatestAnalysis(documentId: string): Promise<AnalysisResult> {
    const res = await api.get(`/api/v1/analysis/document/${documentId}/latest/`);
    return res.data;
  },

  async getAnalysisById(analysisId: string): Promise<AnalysisResult> {
    const res = await api.get(`/api/v1/analysis/${analysisId}/`);
    return res.data;
  },

  async compareDocuments(docAId: string, docBId: string): Promise<ComparisonReport> {
    const res = await api.post('/api/v1/analysis/compare/', {
      document_a: docAId,
      document_b: docBId,
    });
    return res.data;
  },

  async getComparisonReports(): Promise<ComparisonReport[]> {
    const res = await api.get('/api/v1/analysis/compare/');
    return Array.isArray(res.data) ? res.data : (res.data.results || []);
  }
};
