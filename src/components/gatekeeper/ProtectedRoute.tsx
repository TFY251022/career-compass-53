import { useState, useEffect, useRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '@/contexts/AppContext';
import GatekeeperOverlay from './GatekeeperOverlay';
import AuthModal from '../auth/AuthModal';

export type GateFlag =
  | 'isLoggedIn'
  | 'isResumeUploaded'
  | 'isPersonalityQuizDone'
  | 'isPersonalityTestDone'
  | 'isJobPreferenceQuizDone';

interface ProtectedRouteProps {
  children: ReactNode;
  /** Which flags must be satisfied. Defaults to ['isLoggedIn']. */
  requiredFlags?: GateFlag[];
}

const ProtectedRoute = ({
  children,
  requiredFlags = ['isLoggedIn'],
}: ProtectedRouteProps) => {
  const state = useAppState();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Track latest isLoggedIn via ref to avoid stale closure in handleAuthModalClose
  const isLoggedInRef = useRef(state.isLoggedIn);
  isLoggedInRef.current = state.isLoggedIn;

  const loginOnly = requiredFlags.length === 1 && requiredFlags[0] === 'isLoggedIn';

  // Determine which flags are missing
  const missingFlags = requiredFlags.filter((flag) => !state[flag]);
  const needsLogin = missingFlags.includes('isLoggedIn');
  const hasNonLoginMissing = missingFlags.some((f) => f !== 'isLoggedIn');

  const showGatekeeper = !needsLogin && hasNonLoginMissing && !loginOnly;

  useEffect(() => {
    if (needsLogin) {
      setShowAuthModal(true);
    }
  }, [needsLogin]);

  const handleAuthModalClose = (isOpen: boolean) => {
    setShowAuthModal(isOpen);
    // Use ref to get the latest isLoggedIn value (avoids stale closure)
    if (!isOpen && !isLoggedInRef.current) {
      navigate(-1);
    }
  };

  const handleGatekeeperClose = (isOpen: boolean) => {
    if (!isOpen) {
      navigate(-1);
    }
  };

  const handleGatekeeperLogin = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      {children}
      {showGatekeeper && (
        <GatekeeperOverlay
          open={showGatekeeper}
          onOpenChange={handleGatekeeperClose}
          onLoginClick={handleGatekeeperLogin}
          requiredFlags={requiredFlags}
        />
      )}
      <AuthModal
        open={showAuthModal}
        onOpenChange={handleAuthModalClose}
      />
    </>
  );
};

export default ProtectedRoute;
