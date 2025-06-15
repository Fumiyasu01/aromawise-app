import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

interface LoginProps {
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onSwitchToReset, onClose }) => {
  const { login, socialLogin, continueAsGuest, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      await login({ email, password });
      onClose();
    } catch (error) {
      // エラーはAuthContextで処理される
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    try {
      await socialLogin(provider);
      onClose();
    } catch (error) {
      // エラーはAuthContextで処理される
    }
  };

  const handleGuestLogin = () => {
    continueAsGuest();
    onClose();
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>ログイン</h2>
        <p>AromaWiseへようこそ</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <span>ログイン状態を保持</span>
          </label>
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToReset}
            disabled={isLoading}
          >
            パスワードを忘れた方
          </button>
        </div>

        {(error || formError) && (
          <div className="error-message">
            {error || formError}
          </div>
        )}

        <button 
          type="submit" 
          className="btn-primary auth-submit"
          disabled={isLoading}
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      <div className="auth-divider">
        <span>または</span>
      </div>

      <div className="social-login">
        <button
          className="social-button google"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
        >
          <span className="social-icon">🔷</span>
          Googleでログイン
        </button>
        <button
          className="social-button apple"
          onClick={() => handleSocialLogin('apple')}
          disabled={isLoading}
        >
          <span className="social-icon">🍎</span>
          Appleでログイン
        </button>
      </div>

      <div className="auth-footer">
        <p>アカウントをお持ちでない方</p>
        <button
          className="link-button"
          onClick={onSwitchToSignup}
          disabled={isLoading}
        >
          新規登録はこちら
        </button>
      </div>

      <div className="guest-option">
        <button
          className="link-button guest-link"
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          ゲストとして続ける
        </button>
      </div>

      <div className="demo-credentials">
        <p className="demo-note">
          デモ用ログイン情報:<br />
          メール: demo@example.com<br />
          パスワード: demo123
        </p>
      </div>
    </div>
  );
};

export default Login;