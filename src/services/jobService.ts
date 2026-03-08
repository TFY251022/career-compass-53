import { mockDelay } from './apiClient';
import apiClient from './apiClient';
import { generateMockJobs, getMockRecommendedJobDetail, mockCoverLetter, JOB_CATEGORIES, generateMockRecommendedJobs } from '@/mocks/jobs';
import { isMockMode } from '@/config/mockMode';
import type { JobData, RecommendedJobDetail, JobCategory, RecommendedJob } from '@/types/job';

export async function getJobs(page = 1): Promise<JobData[]> {
  if (isMockMode()) { await mockDelay(); return generateMockJobs(page); }
  return apiClient.get<JobData[]>('/jobs', { params: { page: String(page) } });
}

export async function getJobDetail(id: string): Promise<RecommendedJobDetail> {
  if (isMockMode()) { await mockDelay(); return getMockRecommendedJobDetail(id); }
  return apiClient.get<RecommendedJobDetail>(`/jobs/${id}`);
}

export interface CoverLetterResult { subject: string; body: string; author?: string; email?: string; portfolio?: string }

export async function generateCoverLetter(jobTitle?: string, company?: string): Promise<CoverLetterResult> {
  if (isMockMode()) { await mockDelay(2000); return mockCoverLetter(jobTitle, company); }
  return apiClient.post<CoverLetterResult>('/jobs/cover-letter', { jobTitle, company });
}

export async function getJobCategories(): Promise<JobCategory[]> {
  if (isMockMode()) { await mockDelay(); return JOB_CATEGORIES; }
  return apiClient.get<JobCategory[]>('/jobs/categories');
}

export async function getRecommendedJobs(page = 1): Promise<RecommendedJob[]> {
  if (isMockMode()) { await mockDelay(); return generateMockRecommendedJobs(page); }
  return apiClient.get<RecommendedJob[]>('/jobs/recommendations', { params: { page: String(page) } });
}
