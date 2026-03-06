import { mockDelay } from './apiClient';
import apiClient from './apiClient';
import { MOCK_RESUMES, mockOriginalResumeData, mockResumeData, mockSuggestions } from '@/mocks/resumes';
import { isMockMode } from '@/config/mockMode';
import type { ResumeItem, OriginalResumeData, ResumeData, Suggestion } from '@/types/resume';

export async function getResumes(): Promise<ResumeItem[]> {
  if (isMockMode()) { await mockDelay(); return MOCK_RESUMES; }
  return apiClient.get<ResumeItem[]>('/resumes');
}

export async function getOriginalResumeData(): Promise<OriginalResumeData> {
  if (isMockMode()) { await mockDelay(); return mockOriginalResumeData; }
  return apiClient.get<OriginalResumeData>('/resumes/original');
}

export async function getOptimizedResumeData(): Promise<ResumeData> {
  if (isMockMode()) { await mockDelay(); return mockResumeData; }
  return apiClient.post<ResumeData>('/resumes/optimize', {});
}

export async function getResumeSuggestions(): Promise<Suggestion[]> {
  if (isMockMode()) { await mockDelay(); return mockSuggestions; }
  return apiClient.get<Suggestion[]>('/resumes/suggestions');
}
