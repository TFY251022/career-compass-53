import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ResumeItem {
  id: number;
  name: string;
  updatedAt: string;
  content: string;
}

interface ResumeState {
  resumes: ResumeItem[];
  selectedResumeId: number | null;
  setSelectedResumeId: (id: number | null) => void;
}

const STORAGE_KEY = 'selectedResumeId';

// Shared mock data source
export const MOCK_RESUMES: ResumeItem[] = [
  {
    id: 1,
    name: '軟體工程師履歷_v2',
    updatedAt: '2026-02-12',
    content: `王小明\n前端工程師\n\n聯絡方式\nEmail: xiaoming@example.com\n電話: 0912-345-678\n\n工作經歷\n\n科技公司 A | 前端工程師 | 2022 - 現在\n• 開發維護公司核心產品前端\n• 使用 React + TypeScript 建構現代化 UI\n• 優化效能，提升載入速度 40%\n\n新創公司 B | 初階工程師 | 2020 - 2022\n• 參與多個客戶專案開發\n• 學習並應用前端最佳實踐\n\n技能\nReact, TypeScript, JavaScript, CSS, Git, Node.js`,
  },
  {
    id: 2,
    name: '前端工程師履歷',
    updatedAt: '2026-02-10',
    content: `王小明 - 前端工程師履歷\n\n專精於 React 生態系統的前端開發者，\n具備 3 年以上實戰經驗。\n\n核心技能：\n- React / Next.js\n- TypeScript\n- Tailwind CSS\n- REST API 整合\n\n期望職位：資深前端工程師\n期望薪資：NT$ 70,000 - 90,000`,
  },
  {
    id: 3,
    name: 'AI工程師優化版',
    updatedAt: '2026-02-11',
    content: `王小明 - AI 工程師\n\n專注於機器學習與深度學習應用開發。\n\n核心技能：\n- Python / PyTorch / TensorFlow\n- LLM 應用開發\n- MLOps\n\n期望職位：AI 工程師\n期望薪資：NT$ 80,000 - 120,000`,
  },
];

const ResumeContext = createContext<ResumeState | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const resumes = MOCK_RESUMES;

  // Smart default: pick most recent resume by updatedAt, or use localStorage
  const getDefaultId = (): number | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const id = parseInt(stored, 10);
      if (resumes.some((r) => r.id === id)) return id;
    }
    // Fallback: most recent
    if (resumes.length === 0) return null;
    const sorted = [...resumes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return sorted[0].id;
  };

  const [selectedResumeId, setSelectedResumeIdState] = useState<number | null>(getDefaultId);

  const setSelectedResumeId = (id: number | null) => {
    setSelectedResumeIdState(id);
    if (id !== null) {
      localStorage.setItem(STORAGE_KEY, id.toString());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <ResumeContext.Provider value={{ resumes, selectedResumeId, setSelectedResumeId }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumes = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumes must be used within a ResumeProvider');
  }
  return context;
};
