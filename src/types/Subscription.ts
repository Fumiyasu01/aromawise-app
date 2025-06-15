export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  currency: string;
  features: string[];
  limitations?: {
    oilsPerMonth?: number;
    recipesPerMonth?: number;
    blendsPerMonth?: number;
    exportPerMonth?: number;
  };
  recommended?: boolean;
  stripePriceIds?: {
    monthly: string;
    yearly: string;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

export interface BillingHistory {
  id: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
}

export interface CheckoutSession {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  successUrl: string;
  cancelUrl: string;
}

// 料金プラン定義
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: '無料プラン',
    description: '基本機能で始める',
    price: {
      monthly: 0,
      yearly: 0
    },
    currency: 'JPY',
    features: [
      '基本的なオイル情報',
      '症状別レコメンド',
      'マイオイル管理（10個まで）',
      '基本レシピ閲覧',
      'ローカルデータ保存'
    ],
    limitations: {
      oilsPerMonth: 10,
      recipesPerMonth: 5,
      blendsPerMonth: 3,
      exportPerMonth: 1
    }
  },
  {
    id: 'basic',
    name: 'ベーシック',
    description: '個人利用に最適',
    price: {
      monthly: 480,
      yearly: 4800
    },
    currency: 'JPY',
    features: [
      '全てのオイル情報',
      '高度な症状別レコメンド',
      'マイオイル管理（無制限）',
      '全レシピアクセス',
      'カスタムブレンド作成',
      '使用履歴と効果記録',
      'データエクスポート',
      'クラウド同期'
    ],
    limitations: {
      exportPerMonth: 10
    },
    recommended: true,
    stripePriceIds: {
      monthly: 'price_basic_monthly',
      yearly: 'price_basic_yearly'
    }
  },
  {
    id: 'premium',
    name: 'プレミアム',
    description: 'プロフェッショナル向け',
    price: {
      monthly: 980,
      yearly: 9800
    },
    currency: 'JPY',
    features: [
      'ベーシックの全機能',
      '家族アカウント（5人まで）',
      'AI による個別アドバイス',
      '専門家への質問機能',
      '無制限エクスポート',
      '優先サポート',
      'APIアクセス',
      '新機能の早期アクセス'
    ],
    stripePriceIds: {
      monthly: 'price_premium_monthly',
      yearly: 'price_premium_yearly'
    }
  }
];

// プランの機能チェック
export const checkFeatureAccess = (
  userPlan: string,
  feature: keyof NonNullable<PricingPlan['limitations']>
): boolean => {
  const plan = PRICING_PLANS.find(p => p.id === userPlan);
  if (!plan) return false;
  
  if (plan.id === 'premium' || plan.id === 'basic') {
    return true; // Premium and Basic have unlimited access to most features
  }
  
  return !plan.limitations || !plan.limitations[feature];
};

export const getPlanLimitation = (
  userPlan: string,
  limitation: keyof NonNullable<PricingPlan['limitations']>
): number | undefined => {
  const plan = PRICING_PLANS.find(p => p.id === userPlan);
  if (!plan || !plan.limitations) return undefined;
  
  return plan.limitations[limitation];
};