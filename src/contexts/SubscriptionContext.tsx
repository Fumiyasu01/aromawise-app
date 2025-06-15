import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  Subscription, 
  PaymentMethod, 
  BillingHistory, 
  CheckoutSession,
  PRICING_PLANS,
  checkFeatureAccess,
  getPlanLimitation
} from '../types/Subscription';

interface SubscriptionContextType {
  subscription: Subscription | null;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingHistory[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createCheckoutSession: (session: CheckoutSession) => Promise<string>;
  cancelSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
  updatePaymentMethod: (paymentMethodId: string) => Promise<void>;
  addPaymentMethod: (token: string) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  
  // Feature access
  checkFeatureAccess: (feature: string) => boolean;
  getPlanLimitation: (limitation: string) => number | undefined;
  getCurrentPlan: () => string;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // サブスクリプション情報の読み込み
  useEffect(() => {
    if (isAuthenticated && user && !user.isGuest) {
      loadSubscriptionData();
    } else {
      // ゲストまたは未認証の場合はリセット
      setSubscription(null);
      setPaymentMethods([]);
      setBillingHistory([]);
    }
  }, [isAuthenticated, user]);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際のAPIコールに置き換える
      // const [sub, methods, history] = await Promise.all([
      //   api.getSubscription(),
      //   api.getPaymentMethods(),
      //   api.getBillingHistory()
      // ]);
      
      // デモデータ
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // ユーザーのサブスクリプション状態に基づいてデータを設定
      if (user?.subscription?.plan && user.subscription.plan !== 'free') {
        const mockSubscription: Subscription = {
          id: '1',
          userId: user.id,
          planId: user.subscription.plan,
          status: user.subscription.status === 'active' ? 'active' : 'trialing',
          currentPeriodStart: new Date(),
          currentPeriodEnd: user.subscription.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false,
          stripeSubscriptionId: 'sub_demo123',
          stripeCustomerId: 'cus_demo123'
        };
        setSubscription(mockSubscription);
        
        const mockPaymentMethod: PaymentMethod = {
          id: '1',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2025
          },
          isDefault: true
        };
        setPaymentMethods([mockPaymentMethod]);
        
        const mockHistory: BillingHistory[] = [
          {
            id: '1',
            date: new Date(),
            amount: 480,
            currency: 'JPY',
            status: 'paid',
            description: 'ベーシックプラン - 月額',
            invoiceUrl: '#'
          }
        ];
        setBillingHistory(mockHistory);
      }
      
      setError(null);
    } catch (err) {
      setError('サブスクリプション情報の読み込みに失敗しました');
      console.error('Failed to load subscription data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = useCallback(async (session: CheckoutSession): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: 実際のStripe Checkout実装
      // const response = await api.createCheckoutSession(session);
      // return response.url;
      
      // デモ用: Stripe Checkoutセッションを作成
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 実際にはStripeのCheckout URLを返す
      console.log('Creating checkout session:', session);
      
      // デモ用URLを返す
      return `https://checkout.stripe.com/demo?plan=${session.planId}&cycle=${session.billingCycle}`;
    } catch (err) {
      setError('チェックアウトセッションの作成に失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelSubscription = useCallback(async () => {
    if (!subscription) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: 実際のAPIコール
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true
      });
      
      setError(null);
    } catch (err) {
      setError('サブスクリプションのキャンセルに失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const resumeSubscription = useCallback(async () => {
    if (!subscription || !subscription.cancelAtPeriodEnd) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: 実際のAPIコール
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: false
      });
      
      setError(null);
    } catch (err) {
      setError('サブスクリプションの再開に失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const updatePaymentMethod = useCallback(async (paymentMethodId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: 実際のAPIコール
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentMethods(methods => 
        methods.map(method => ({
          ...method,
          isDefault: method.id === paymentMethodId
        }))
      );
      
      setError(null);
    } catch (err) {
      setError('支払い方法の更新に失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPaymentMethod = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: 実際のAPIコール（Stripeトークンを使用）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: 'card',
        card: {
          brand: 'visa',
          last4: '5555',
          expMonth: 3,
          expYear: 2026
        },
        isDefault: paymentMethods.length === 0
      };
      
      setPaymentMethods([...paymentMethods, newMethod]);
      setError(null);
    } catch (err) {
      setError('支払い方法の追加に失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [paymentMethods]);

  const removePaymentMethod = useCallback(async (paymentMethodId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: 実際のAPIコール
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPaymentMethods(methods => 
        methods.filter(method => method.id !== paymentMethodId)
      );
      
      setError(null);
    } catch (err) {
      setError('支払い方法の削除に失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAccess = useCallback((feature: string): boolean => {
    const currentPlan = getCurrentPlan();
    return checkFeatureAccess(currentPlan, feature as any);
  }, []);

  const getLimitation = useCallback((limitation: string): number | undefined => {
    const currentPlan = getCurrentPlan();
    return getPlanLimitation(currentPlan, limitation as any);
  }, []);

  const getCurrentPlan = useCallback((): string => {
    if (subscription) {
      return subscription.planId;
    }
    if (user?.subscription?.plan) {
      return user.subscription.plan;
    }
    return 'free';
  }, [subscription, user]);

  const value: SubscriptionContextType = {
    subscription,
    paymentMethods,
    billingHistory,
    isLoading,
    error,
    createCheckoutSession,
    cancelSubscription,
    resumeSubscription,
    updatePaymentMethod,
    addPaymentMethod,
    removePaymentMethod,
    checkFeatureAccess: checkAccess,
    getPlanLimitation: getLimitation,
    getCurrentPlan
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};