export interface FragranceProfile {
  oilId: string;
  aromaFamily: 'citrus' | 'floral' | 'woody' | 'herbal' | 'spicy' | 'fresh';
  intensity: 1 | 2 | 3 | 4 | 5; // 1=軽やか, 5=強い
  notes: {
    top: string[];    // トップノート（最初に感じる香り）
    middle: string[]; // ミドルノート（中心となる香り）
    base: string[];   // ベースノート（長く残る香り）
  };
  personality: string[]; // 'エネルギッシュ', 'リラックス', '上品' など
}

export interface BlendCompatibility {
  oilId1: string;
  oilId2: string;
  compatibility: 1 | 2 | 3 | 4 | 5; // 1=相性悪い, 5=最高の相性
  reason: string; // 相性の理由
  suggestedRatio: string; // 推奨配合比
}

export interface CustomBlend {
  id: string;
  name: string;
  description: string;
  oils: {
    oilId: string;
    oilName: string;
    drops: number;
    percentage: number;
  }[];
  aromaProfile: {
    dominant: string; // 主要な香り系統
    secondary: string; // 副次的な香り系統
    mood: string; // 醸し出す雰囲気
  };
  rating?: number; // ユーザー評価 (1-5)
  notes?: string; // メモ
  createdAt: string;
  isFavorite: boolean;
}

export interface BlendSuggestion {
  id: string;
  name: string;
  description: string;
  category: 'energizing' | 'relaxing' | 'romantic' | 'fresh' | 'sophisticated';
  oils: {
    oilId: string;
    oilName: string;
    drops: number;
    role: 'primary' | 'secondary' | 'accent'; // ブレンドでの役割
  }[];
  compatibility: number; // 全体の相性スコア
  mood: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
}