import { mockDelay } from './apiClient';
import apiClient from './apiClient';
import { mockAnalysisResult, analysisHistory } from '@/mocks/analysis';
import { isMockMode } from '@/config/mockMode';
import type { LearningResource, SideProject, AnalysisHistoryItem, AnalysisRequest, AnalysisResult } from '@/types/analysis';

export async function getLearningResources(): Promise<LearningResource[]> {
  if (isMockMode()) { await mockDelay(); return mockAnalysisResult.learningResources; }
  return apiClient.get<LearningResource[]>('/analysis/resources');
}

export async function getSideProjects(): Promise<SideProject[]> {
  if (isMockMode()) { await mockDelay(); return mockAnalysisResult.sideProjects; }
  return apiClient.get<SideProject[]>('/analysis/projects');
}

export async function getAnalysisHistory(): Promise<AnalysisHistoryItem[]> {
  if (isMockMode()) { await mockDelay(); return analysisHistory; }
  return apiClient.get<AnalysisHistoryItem[]>('/analysis/history');
}

export async function generateAnalysis(payload: AnalysisRequest): Promise<AnalysisResult> {
  if (isMockMode()) {
    console.log('[analysisService] generateAnalysis called with:', payload);
    await mockDelay(2000);
    return mockAnalysisResult;
  }
  return apiClient.post<AnalysisResult>('/analysis/generate', payload);
}
