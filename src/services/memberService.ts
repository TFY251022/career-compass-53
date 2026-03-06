import { mockDelay } from './apiClient';
import apiClient from './apiClient';
import { mockUserId, mockProfile } from '@/mocks/member';
import { isMockMode } from '@/config/mockMode';
import type { UserProfile } from '@/types/member';

export async function getMyProfile(): Promise<UserProfile> {
  if (isMockMode()) { await mockDelay(); return mockProfile; }
  return apiClient.get<UserProfile>('/members/me');
}

export async function getMyUserId(): Promise<string> {
  if (isMockMode()) { await mockDelay(); return mockUserId; }
  return apiClient.get<string>('/members/me/id');
}

export async function updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  if (isMockMode()) { await mockDelay(); return { ...mockProfile, ...data }; }
  return apiClient.put<UserProfile>('/members/me', data);
}
