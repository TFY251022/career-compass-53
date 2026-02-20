import { mockDelay } from './apiClient';
import { mockTopics, mockThankYouLetter } from '@/mocks/interview';
import type { InterviewTopic } from '@/types/interview';

// TODO: Replace with API call – GET /interview/topics
export async function getInterviewTopics(): Promise<InterviewTopic[]> {
  await mockDelay();
  return mockTopics;
}

// TODO: Replace with API call – POST /interview/thank-you-letter
export async function generateThankYouLetter(): Promise<string> {
  await mockDelay(2000);
  return mockThankYouLetter;
}
