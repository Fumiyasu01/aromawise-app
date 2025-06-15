import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

interface SignupProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onClose }) => {
  const { signup, socialLogin, error, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const getPasswordStrength = (password: string): { level: 'weak' | 'medium' | 'strong', text: string } => {
    if (password.length < 6) return { level: 'weak', text: '弱い' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 1) return { level: 'weak', text: '弱い' };
    if (strength <= 2) return { level: 'medium', text: '普通' };
    return { level: 'strong', text: '強い' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // バリデーション
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setFormError('すべての項目を入力してください');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('パスワードは6文字以上で入力してください');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('パスワードが一致しません');
      return;
    }

    if (!formData.acceptTerms) {
      setFormError('利用規約に同意してください');
      return;
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        acceptTerms: formData.acceptTerms
      });
      onClose();
    } catch (error) {
      // エラーはAuthContextで処理される
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'apple') => {
    try {
      await socialLogin(provider);
      onClose();
    } catch (error) {
      // エラーはAuthContextで処理される
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>新規登録</h2>
        <p>AromaWiseアカウントを作成</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">お名前</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="山田 太郎"
            autoComplete="name"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="6文字以上"
              autoComplete="new-password"
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
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div className={`strength-fill ${passwordStrength.level}`}></div>
              </div>
              <span className="strength-text">
                パスワードの強度: {passwordStrength.text}
              </span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">パスワード（確認）</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="パスワードを再入力"
            autoComplete="new-password"
            disabled={isLoading}
          />
        </div>

        <div className="terms-checkbox">
          <label>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span>
              <a href="#" target="_blank" rel="noopener noreferrer">利用規約</a>と
              <a href="#" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>に同意します
            </span>
          </label>
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
          {isLoading ? '登録中...' : 'アカウント作成'}
        </button>
      </form>

      <div className="auth-divider">
        <span>または</span>
      </div>

      <div className="social-login">
        <button
          className="social-button google"
          onClick={() => handleSocialSignup('google')}
          disabled={isLoading}
        >
          <span className="social-icon">🔷</span>
          Googleで登録
        </button>
        <button
          className="social-button apple"
          onClick={() => handleSocialSignup('apple')}
          disabled={isLoading}
        >
          <span className="social-icon">🍎</span>
          Appleで登録
        </button>
      </div>

      <div className="auth-footer">
        <p>すでにアカウントをお持ちの方</p>
        <button
          className="link-button"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          ログインはこちら
        </button>
      </div>
    </div>
  );
};

export default Signup;