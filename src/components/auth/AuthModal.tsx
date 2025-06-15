import React, { useState, useEffect } from 'react';
import Login from './Login';
import Signup from './Signup';
import ResetPassword from './ResetPassword';
import './Auth.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [currentMode, setCurrentMode] = useState<'login' | 'signup' | 'reset'>(initialMode);

  useEffect(() => {
    setCurrentMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    // ESCキーで閉じる
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    // モーダルが開いているときはスクロールを無効化
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal" onClick={handleBackdropClick}>
      <div className="auth-modal-content">
        <button className="auth-close" onClick={onClose} aria-label="閉じる">
          ✕
        </button>

        {currentMode === 'login' && (
          <Login
            onSwitchToSignup={() => setCurrentMode('signup')}
            onSwitchToReset={() => setCurrentMode('reset')}
            onClose={onClose}
          />
        )}

        {currentMode === 'signup' && (
          <Signup
            onSwitchToLogin={() => setCurrentMode('login')}
            onClose={onClose}
          />
        )}

        {currentMode === 'reset' && (
          <ResetPassword
            onSwitchToLogin={() => setCurrentMode('login')}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;