import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import './Subscription.css';

const StripeCheckout: React.FC = () => {
  const { user } = useAuth();
  const { isLoading } = useSubscription();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // URLパラメータから情報を取得
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const success = params.get('success');
    const canceled = params.get('canceled');

    if (success === 'true' && sessionId) {
      handleSuccess(sessionId);
    } else if (canceled === 'true') {
      handleCancel();
    } else {
      // 不正なアクセス
      window.location.href = '/';
    }
  }, []);

  const handleSuccess = async (sessionId: string) => {
    try {
      // TODO: バックエンドでセッションを確認し、サブスクリプションを有効化
      // const response = await api.confirmCheckoutSession(sessionId);
      
      // デモ用の処理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStatus('success');
      
      // 3秒後にダッシュボードへリダイレクト
      setTimeout(() => {
        window.location.href = '/#settings';
      }, 3000);
    } catch (error) {
      console.error('Checkout confirmation failed:', error);
      setErrorMessage('決済の確認中にエラーが発生しました。');
      setStatus('error');
    }
  };

  const handleCancel = () => {
    // キャンセルされた場合は料金ページへ戻る
    window.location.href = '/#pricing';
  };

  return (
    <div className="checkout-result-container">
      {status === 'processing' && (
        <div className="checkout-processing">
          <div className="spinner"></div>
          <h2>決済を処理しています...</h2>
          <p>しばらくお待ちください。</p>
        </div>
      )}

      {status === 'success' && (
        <div className="checkout-success">
          <div className="success-icon">✅</div>
          <h2>決済が完了しました！</h2>
          <p>AromaWise {user?.subscription?.plan === 'basic' ? 'ベーシック' : 'プレミアム'}プランへようこそ。</p>
          <p>まもなく設定画面へ移動します...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="checkout-error">
          <div className="error-icon">❌</div>
          <h2>エラーが発生しました</h2>
          <p>{errorMessage}</p>
          <button className="btn-primary" onClick={() => window.location.href = '/#pricing'}>
            料金ページへ戻る
          </button>
        </div>
      )}
    </div>
  );
};

export default StripeCheckout;