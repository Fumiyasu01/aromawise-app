import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { PRICING_PLANS } from '../../types/Subscription';
import './Subscription.css';

interface PricingProps {
  onClose?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const { createCheckoutSession, getCurrentPlan, isLoading } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const currentPlan = getCurrentPlan();

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated || user?.isGuest) {
      // ログインモーダルを表示するなどの処理
      alert('プランを選択するにはログインが必要です');
      return;
    }

    if (planId === 'free' || planId === currentPlan) {
      return;
    }

    setSelectedPlan(planId);
    
    try {
      const checkoutUrl = await createCheckoutSession({
        planId,
        billingCycle,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/cancel`
      });
      
      // Stripe Checkoutへリダイレクト
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout session creation failed:', error);
      alert('エラーが発生しました。もう一度お試しください。');
    } finally {
      setSelectedPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlySavings = (monthly * 12) - yearly;
    const percentSavings = Math.round((yearlySavings / (monthly * 12)) * 100);
    return { amount: yearlySavings, percent: percentSavings };
  };

  return (
    <div className="pricing-container">
      <div className="pricing-header">
        <h1>料金プラン</h1>
        <p>あなたに最適なプランをお選びください</p>
      </div>

      <div className="billing-toggle">
        <button
          className={`toggle-option ${billingCycle === 'monthly' ? 'active' : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          月払い
        </button>
        <button
          className={`toggle-option ${billingCycle === 'yearly' ? 'active' : ''}`}
          onClick={() => setBillingCycle('yearly')}
        >
          年払い
          <span className="save-badge">最大20%お得</span>
        </button>
      </div>

      <div className="pricing-grid">
        {PRICING_PLANS.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
          const monthlyEquivalent = billingCycle === 'yearly' ? Math.round(plan.price.yearly / 12) : plan.price.monthly;
          const savings = billingCycle === 'yearly' && plan.price.monthly > 0 
            ? calculateSavings(plan.price.monthly, plan.price.yearly)
            : null;
          const isCurrentPlan = plan.id === currentPlan;
          const isUpgrade = plan.price.monthly > (PRICING_PLANS.find(p => p.id === currentPlan)?.price.monthly || 0);
          
          return (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.recommended ? 'recommended' : ''} ${isCurrentPlan ? 'current' : ''}`}
            >
              {plan.recommended && (
                <div className="recommended-badge">おすすめ</div>
              )}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-price">
                <div className="price-amount">
                  {formatPrice(monthlyEquivalent)}
                  <span className="price-period">/月</span>
                </div>
                {billingCycle === 'yearly' && price > 0 && (
                  <div className="yearly-total">
                    年額 {formatPrice(price)}
                    {savings && (
                      <span className="savings">
                        {formatPrice(savings.amount)}お得！
                      </span>
                    )}
                  </div>
                )}
              </div>

              <ul className="feature-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.limitations && (
                <div className="limitations">
                  <p className="limitations-title">制限事項:</p>
                  <ul>
                    {plan.limitations.oilsPerMonth && (
                      <li>月間オイル登録: {plan.limitations.oilsPerMonth}個まで</li>
                    )}
                    {plan.limitations.recipesPerMonth && (
                      <li>月間レシピ作成: {plan.limitations.recipesPerMonth}個まで</li>
                    )}
                    {plan.limitations.exportPerMonth && (
                      <li>月間エクスポート: {plan.limitations.exportPerMonth}回まで</li>
                    )}
                  </ul>
                </div>
              )}

              <button
                className={`select-plan-btn ${isCurrentPlan ? 'current' : isUpgrade ? 'upgrade' : ''}`}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isLoading || selectedPlan === plan.id || isCurrentPlan}
              >
                {isLoading && selectedPlan === plan.id ? (
                  '処理中...'
                ) : isCurrentPlan ? (
                  '現在のプラン'
                ) : plan.id === 'free' ? (
                  '無料で始める'
                ) : isUpgrade ? (
                  'アップグレード'
                ) : (
                  'ダウングレード'
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="pricing-footer">
        <div className="guarantee">
          <h4>🛡️ 30日間返金保証</h4>
          <p>ご満足いただけない場合は、30日以内であれば全額返金いたします。</p>
        </div>
        
        <div className="payment-methods">
          <h4>利用可能な支払い方法</h4>
          <div className="payment-icons">
            <span className="payment-icon">💳</span>
            <span className="payment-text">Visa</span>
            <span className="payment-text">Mastercard</span>
            <span className="payment-text">JCB</span>
            <span className="payment-text">American Express</span>
          </div>
        </div>

        <div className="faq-section">
          <h4>よくある質問</h4>
          <details className="faq-item">
            <summary>プランはいつでも変更できますか？</summary>
            <p>はい、いつでもアップグレードまたはダウングレードが可能です。変更は次の請求サイクルから適用されます。</p>
          </details>
          <details className="faq-item">
            <summary>解約はいつでもできますか？</summary>
            <p>はい、いつでも解約可能です。解約しても、現在の請求期間の終了まではサービスをご利用いただけます。</p>
          </details>
          <details className="faq-item">
            <summary>学生割引はありますか？</summary>
            <p>現在準備中です。学生向けの特別プランの提供を検討しています。</p>
          </details>
        </div>
      </div>

      {onClose && (
        <button className="close-button" onClick={onClose}>
          閉じる
        </button>
      )}
    </div>
  );
};

export default Pricing;