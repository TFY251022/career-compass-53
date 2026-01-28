import { useState, useEffect, ReactNode } from 'react';
import { useAppState } from '@/contexts/AppContext';
import GatekeeperOverlay from './GatekeeperOverlay';
import AuthModal from '../auth/AuthModal';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAppState();
  const [showGatekeeper, setShowGatekeeper] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowGatekeeper(true);
    } else {
      setShowGatekeeper(false);
    }
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      {children}
      <GatekeeperOverlay 
        open={showGatekeeper} 
        onOpenChange={setShowGatekeeper}
        onLoginClick={handleLoginClick}
      />
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </>
  );
};

export default ProtectedRoute;
