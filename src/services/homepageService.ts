import { mockDelay } from './apiClient';
import apiClient from './apiClient';
import { heroStats, news } from '@/mocks/homepage';
import { isMockMode } from '@/config/mockMode';
import type { HeroStat, NewsItem } from '@/types/homepage';

export async function getHeroStats(): Promise<HeroStat[]> {
  if (isMockMode()) { await mockDelay(); return heroStats; }
  return apiClient.get<HeroStat[]>('/homepage/stats');
}

export async function getNews(): Promise<NewsItem[]> {
  if (isMockMode()) { await mockDelay(); return news; }
  return apiClient.get<NewsItem[]>('/homepage/news');
}
