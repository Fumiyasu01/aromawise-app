import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { PRICING_PLANS } from '../../types/Subscription';
import './Subscription.css';

const SubscriptionManagement: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    subscription, 
    paymentMethods, 
    billingHistory,
    cancelSubscription,
    resumeSubscription,
    updatePaymentMethod,
    removePaymentMethod,
    isLoading 
  } = useSubscription();
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);

  if (!isAuthenticated || user?.isGuest) {
    return (
      <div className="subscription-management">
        <div className="subscription-header">
          <h1>サブスクリプション管理</h1>
          <p>サブスクリプションを管理するにはログインが必要です。</p>
          <button className="btn-primary" onClick={() => window.location.href = '/'}>
            ログインする
          </button>
        </div>
      </div>
    );
  }

  const currentPlan = PRICING_PLANS.find(plan => plan.id === subscription?.planId) || PRICING_PLANS[0];
  
  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      setShowCancelConfirm(false);
      alert('サブスクリプションのキャンセルが完了しました。現在の請求期間の終了まではサービスをご利用いただけます。');
    } catch (error) {
      alert('キャンセル処理中にエラーが発生しました。');
    }
  };

  const handleResumeSubscription = async () => {
    try {
      await resumeSubscription();
      alert('サブスクリプションを再開しました。');
    } catch (error) {
      alert('再開処理中にエラーが発生しました。');
    }
  };

  const handleSetDefaultPayment = async (paymentMethodId: string) => {
    try {
      await updatePaymentMethod(paymentMethodId);
      setSelectedPaymentMethod(null);
    } catch (error) {
      alert('支払い方法の更新に失敗しました。');
    }
  };

  const handleRemovePayment = async (paymentMethodId: string) => {
    if (paymentMethods.length === 1) {
      alert('最後の支払い方法は削除できません。');
      return;
    }
    
    if (window.confirm('この支払い方法を削除してもよろしいですか？')) {
      try {
        await removePaymentMethod(paymentMethodId);
      } catch (error) {
        alert('支払い方法の削除に失敗しました。');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="subscription-management">
      <div className="subscription-header">
        <h1>サブスクリプション管理</h1>
      </div>

      {/* 現在のプラン */}
      <div className="current-plan-card">
        <div className="plan-info-header">
          <div>
            <h2 className="plan-name">{currentPlan.name}</h2>
            <p>{currentPlan.description}</p>
          </div>
          <div>
            <span className={`plan-status ${subscription?.status || 'active'}`}>
              {subscription?.cancelAtPeriodEnd ? 'キャンセル済み' : 
               subscription?.status === 'trialing' ? 'トライアル中' : '有効'}
            </span>
          </div>
        </div>

        <div className="plan-details">
          <div className="detail-item">
            <span className="detail-label">次回請求日</span>
            <span className="detail-value">
              {subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : '-'}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">請求額</span>
            <span className="detail-value">{formatCurrency(currentPlan.price.monthly)}/月</span>
          </div>
          {subscription?.trialEnd && (
            <div className="detail-item">
              <span className="detail-label">トライアル終了日</span>
              <span className="detail-value">{formatDate(subscription.trialEnd)}</span>
            </div>
          )}
        </div>

        <div className="plan-actions">
          <button 
            className="btn-secondary" 
            onClick={() => window.location.href = '/#pricing'}
          >
            プランを変更
          </button>
          {subscription?.cancelAtPeriodEnd ? (
            <button 
              className="btn-primary" 
              onClick={handleResumeSubscription}
              disabled={isLoading}
            >
              サブスクリプションを再開
            </button>
          ) : (
            <button 
              className="btn-secondary" 
              onClick={() => setShowCancelConfirm(true)}
              disabled={isLoading}
            >
              キャンセル
            </button>
          )}
        </div>
      </div>

      {/* 支払い方法 */}
      <div className="payment-methods-section">
        <div className="section-header">
          <h3 className="section-title">💳 支払い方法</h3>
          <button className="btn-secondary">+ 新しいカードを追加</button>
        </div>
        
        {paymentMethods.map((method) => (
          <div key={method.id} className="payment-method-card">
            <div className="payment-method-info">
              <span className="card-icon">💳</span>
              <div className="card-details">
                <span className="card-brand">{method.card.brand}</span>
                <span className="card-number">•••• {method.card.last4}</span>
                <span className="card-number">
                  有効期限: {method.card.expMonth}/{method.card.expYear}
                </span>
              </div>
              {method.isDefault && <span className="default-badge">デフォルト</span>}
            </div>
            <div className="payment-method-actions">
              {!method.isDefault && (
                <button 
                  className="btn-secondary"
                  onClick={() => handleSetDefaultPayment(method.id)}
                  disabled={isLoading}
                >
                  デフォルトに設定
                </button>
              )}
              <button 
                className="btn-secondary"
                onClick={() => handleRemovePayment(method.id)}
                disabled={isLoading || paymentMethods.length === 1}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 請求履歴 */}
      <div className="billing-history-section">
        <div className="section-header">
          <h3 className="section-title">📄 請求履歴</h3>
        </div>
        
        {billingHistory.length > 0 ? (
          <table className="billing-history-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>内容</th>
                <th>金額</th>
                <th>状態</th>
                <th>請求書</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.description}</td>
                  <td>{formatCurrency(item.amount)}</td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status === 'paid' ? '支払済み' : 
                       item.status === 'pending' ? '処理中' : '失敗'}
                    </span>
                  </td>
                  <td>
                    {item.invoiceUrl && (
                      <a href={item.invoiceUrl} className="invoice-link" target="_blank" rel="noopener noreferrer">
                        ダウンロード
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>請求履歴はありません。</p>
        )}
      </div>

      {/* キャンセル確認モーダル */}
      {showCancelConfirm && (
        <div className="modal-overlay" onClick={() => setShowCancelConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>サブスクリプションのキャンセル</h3>
            <p>
              本当にサブスクリプションをキャンセルしますか？<br />
              現在の請求期間の終了（{subscription?.currentPeriodEnd && formatDate(subscription.currentPeriodEnd)}）まではサービスをご利用いただけます。
            </p>
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setShowCancelConfirm(false)}
              >
                戻る
              </button>
              <button 
                className="btn-primary" 
                onClick={handleCancelSubscription}
                disabled={isLoading}
              >
                キャンセルする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;