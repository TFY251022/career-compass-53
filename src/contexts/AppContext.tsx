import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { isMockMode, setMockMode as _setMockMode } from "@/config/mockMode";

// --- Types ---
export interface UserData {
  user_id: number;
  email: string;
  [key: string]: any;
}

interface PersistedFlags {
  isLoggedIn: boolean;
  user: UserData | null;
  isResumeUploaded: boolean;
  isPersonalityQuizDone: boolean;
  isJobPreferenceQuizDone: boolean;
  isPersonalityTestDone: boolean;
  avatarUrl: string | null;
}

interface AppState extends PersistedFlags {
  useMockData: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: UserData | null) => void;
  setIsResumeUploaded: (value: boolean) => void;
  setIsPersonalityQuizDone: (value: boolean) => void;
  setIsJobPreferenceQuizDone: (value: boolean) => void;
  setIsPersonalityTestDone: (value: boolean) => void;
  setAvatarUrl: (value: string | null) => void;
  setUseMockData: (value: boolean) => void;
}

// --- Helpers ---
const APP_STATE_KEY = "app-global-state";

const loadFlags = (): PersistedFlags => {
  if (typeof window === "undefined") return getDefaultFlags();
  try {
    const saved = localStorage.getItem(APP_STATE_KEY);
    return saved ? JSON.parse(saved) : getDefaultFlags();
  } catch {
    return getDefaultFlags();
  }
};

const getDefaultFlags = (): PersistedFlags => ({
  isLoggedIn: false,
  user: null,
  isResumeUploaded: false,
  isPersonalityQuizDone: false,
  isJobPreferenceQuizDone: false,
  isPersonalityTestDone: false,
  avatarUrl: null,
});

/** 原子化更新 localStorage，避免覆蓋掉其他欄位 */
const persistFlag = (partial: Partial<PersistedFlags>) => {
  const current = loadFlags();
  localStorage.setItem(APP_STATE_KEY, JSON.stringify({ ...current, ...partial }));
};

// --- Context ---
const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const initial = loadFlags();

  // State
  const [isLoggedIn, _setIsLoggedIn] = useState(initial.isLoggedIn);
  const [user, _setUser] = useState<UserData | null>(initial.user);
  const [isResumeUploaded, _setIsResumeUploaded] = useState(initial.isResumeUploaded);
  const [isPersonalityQuizDone, _setIsPersonalityQuizDone] = useState(initial.isPersonalityQuizDone);
  const [isJobPreferenceQuizDone, _setIsJobPreferenceQuizDone] = useState(initial.isJobPreferenceQuizDone);
  const [isPersonalityTestDone, _setIsPersonalityTestDone] = useState(initial.isPersonalityTestDone);
  const [avatarUrl, _setAvatarUrl] = useState(initial.avatarUrl);
  const [useMockData, _setUseMockData] = useState(isMockMode);

  // Setters with Persistence
  const setIsLoggedIn = useCallback((value: boolean) => {
    _setIsLoggedIn(value);
    persistFlag({ isLoggedIn: value });
  }, []);

  const setUser = useCallback((value: UserData | null) => {
    _setUser(value);
    persistFlag({ user: value });
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

  const setUseMockData = useCallback((value: boolean) => {
    _setUseMockData(value);
    _setMockMode(value);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        isResumeUploaded,
        isPersonalityQuizDone,
        isJobPreferenceQuizDone,
        isPersonalityTestDone,
        avatarUrl,
        useMockData,
        setIsLoggedIn,
        setUser,
        setIsResumeUploaded,
        setIsPersonalityQuizDone,
        setIsJobPreferenceQuizDone,
        setIsPersonalityTestDone,
        setAvatarUrl,
        setUseMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};
