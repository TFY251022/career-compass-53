import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  isLoggedIn: boolean;
  isResumeUploaded: boolean;
  isPersonalityQuizDone: boolean;
  isJobPreferenceQuizDone: boolean;
  isPersonalityTestDone: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setIsResumeUploaded: (value: boolean) => void;
  setIsPersonalityQuizDone: (value: boolean) => void;
  setIsJobPreferenceQuizDone: (value: boolean) => void;
  setIsPersonalityTestDone: (value: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const [isPersonalityQuizDone, setIsPersonalityQuizDone] = useState(false);
  const [isJobPreferenceQuizDone, setIsJobPreferenceQuizDone] = useState(false);
  const [isPersonalityTestDone, setIsPersonalityTestDone] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        isResumeUploaded,
        isPersonalityQuizDone,
        isJobPreferenceQuizDone,
        isPersonalityTestDone,
        setIsLoggedIn,
        setIsResumeUploaded,
        setIsPersonalityQuizDone,
        setIsJobPreferenceQuizDone,
        setIsPersonalityTestDone,
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
