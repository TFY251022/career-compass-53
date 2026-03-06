import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { isMockMode, setMockMode as _setMockMode } from '@/config/mockMode';

interface AppState {
  isLoggedIn: boolean;
  isResumeUploaded: boolean;
  isPersonalityQuizDone: boolean;
  isJobPreferenceQuizDone: boolean;
  isPersonalityTestDone: boolean;
  avatarUrl: string | null;
  useMockData: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setIsResumeUploaded: (value: boolean) => void;
  setIsPersonalityQuizDone: (value: boolean) => void;
  setIsJobPreferenceQuizDone: (value: boolean) => void;
  setIsPersonalityTestDone: (value: boolean) => void;
  setAvatarUrl: (value: string | null) => void;
  setUseMockData: (value: boolean) => void;
}

const APP_STATE_KEY = 'app-global-state';

interface PersistedFlags {
  isLoggedIn: boolean;
  isResumeUploaded: boolean;
  isPersonalityQuizDone: boolean;
  isJobPreferenceQuizDone: boolean;
  isPersonalityTestDone: boolean;
  avatarUrl: string | null;
}

const loadFlags = (): PersistedFlags => {
  try {
    const saved = localStorage.getItem(APP_STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    isLoggedIn: false,
    isResumeUploaded: false,
    isPersonalityQuizDone: false,
    isJobPreferenceQuizDone: false,
    isPersonalityTestDone: false,
    avatarUrl: null,
  };
};

/** Atomically merge a partial update into persisted flags */
const persistFlag = (partial: Partial<PersistedFlags>) => {
  const current = loadFlags();
  localStorage.setItem(APP_STATE_KEY, JSON.stringify({ ...current, ...partial }));
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const initial = loadFlags();
  const [isLoggedIn, _setIsLoggedIn] = useState(initial.isLoggedIn);
  const [isResumeUploaded, _setIsResumeUploaded] = useState(initial.isResumeUploaded);
  const [isPersonalityQuizDone, _setIsPersonalityQuizDone] = useState(initial.isPersonalityQuizDone);
  const [isJobPreferenceQuizDone, _setIsJobPreferenceQuizDone] = useState(initial.isJobPreferenceQuizDone);
  const [isPersonalityTestDone, _setIsPersonalityTestDone] = useState(initial.isPersonalityTestDone);
  const [avatarUrl, _setAvatarUrl] = useState(initial.avatarUrl);
  const [useMockData, _setUseMockData] = useState(isMockMode);

  // Each setter atomically merges its flag into localStorage,
  // preventing race conditions where one useEffect overwrites another flag.
  const setIsLoggedIn = useCallback((value: boolean) => {
    _setIsLoggedIn(value);
    persistFlag({ isLoggedIn: value });
  }, []);

  const setIsResumeUploaded = useCallback((value: boolean) => {
    _setIsResumeUploaded(value);
    persistFlag({ isResumeUploaded: value });
  }, []);

  const setIsPersonalityQuizDone = useCallback((value: boolean) => {
    _setIsPersonalityQuizDone(value);
    persistFlag({ isPersonalityQuizDone: value });
  }, []);

  const setIsJobPreferenceQuizDone = useCallback((value: boolean) => {
    _setIsJobPreferenceQuizDone(value);
    persistFlag({ isJobPreferenceQuizDone: value });
  }, []);

  const setIsPersonalityTestDone = useCallback((value: boolean) => {
    _setIsPersonalityTestDone(value);
    persistFlag({ isPersonalityTestDone: value });
  }, []);

  const setAvatarUrl = useCallback((value: string | null) => {
    _setAvatarUrl(value);
    persistFlag({ avatarUrl: value });
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        isResumeUploaded,
        isPersonalityQuizDone,
        isJobPreferenceQuizDone,
        isPersonalityTestDone,
        avatarUrl,
        setIsLoggedIn,
        setIsResumeUploaded,
        setIsPersonalityQuizDone,
        setIsJobPreferenceQuizDone,
        setIsPersonalityTestDone,
        setAvatarUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};
