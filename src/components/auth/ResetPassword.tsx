import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

interface ResetPasswordProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onSwitchToLogin, onClose }) => {
  const { resetPassword, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email) {
      setFormError('メールアドレスを入力してください');
      return;
    }

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // エラーはAuthContextで処理される
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-header">
          <h2>メール送信完了</h2>
          <p>パスワードリセットの手順をメールで送信しました</p>
        </div>

        <div className="success-message">
          <p>
            {email} にパスワードリセットのリンクを送信しました。
            メールをご確認ください。
          </p>
        </div>

        <div className="reset-info">
          <p>
            メールが届かない場合は：<br />
            • 迷惑メールフォルダをご確認ください<br />
            • メールアドレスが正しいか確認してください<br />
            • しばらく待ってから再度お試しください
          </p>
        </div>

        <button 
          className="btn-primary auth-submit"
          onClick={onSwitchToLogin}
        >
          ログイン画面に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h2>パスワードリセット</h2>
        <p>登録したメールアドレスを入力してください</p>
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

        <div className="reset-info">
          <p>
            入力されたメールアドレスにパスワードリセットのリンクを送信します。
            リンクの有効期限は24時間です。
          </p>
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
          {isLoading ? '送信中...' : 'リセットリンクを送信'}
        </button>
      </form>

      <div className="reset-back">
        <button
          className="link-button"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          ログイン画面に戻る
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;