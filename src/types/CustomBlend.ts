export interface BlendIngredient {
  oilId: string;
  drops: number;
  percentage?: number;
  note?: 'top' | 'middle' | 'base'; // 香りのノート
}

export interface CustomBlend {
  id: string;
  name: string;
  description: string;
  purpose: string; // 用途（リラックス、集中力向上など）
  ingredients: BlendIngredient[];
  totalDrops: number;
  dilutionRatio?: number; // 希釈率（%）
  carrierOil?: string; // キャリアオイルの種類
  carrierAmount?: number; // キャリアオイルの量（ml）
  category: BlendCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // ユーザーID
  isPublic: boolean; // 公開/非公開
  likes: number;
  rating?: number;
  instructions?: string; // 使用方法
  precautions?: string; // 注意事項
  imageUrl?: string;
}

export type BlendCategory = 
  | 'relaxation' // リラクゼーション
  | 'energy' // エネルギー
  | 'focus' // 集中力
  | 'sleep' // 睡眠
  | 'wellness' // 健康
  | 'beauty' // 美容
  | 'cleaning' // お掃除
  | 'seasonal' // 季節
  | 'custom'; // その他

export interface BlendCalculation {
  totalVolume: number; // 総容量（ml）
  ingredients: {
    oilId: string;
    oilName: string;
    drops: number;
    volume: number; // ml
    percentage: number;
    cost?: number; // コスト計算（オプション）
  }[];
  dilutionPercentage: number;
  safetyWarnings: string[];
  estimatedCost?: number;
}

export interface BlendTemplate {
  id: string;
  name: string;
  description: string;
  category: BlendCategory;
  baseRecipe: Omit<CustomBlend, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

// ブレンド作成時の検証ルール
export interface BlendValidation {
  maxIngredients: number;
  minIngredients: number;
  maxDropsPerIngredient: number;
  maxTotalDrops: number;
  requiresCarrierOil: boolean;
  allowedCategories: BlendCategory[];
}

export const BLEND_VALIDATION: BlendValidation = {
  maxIngredients: 6,
  minIngredients: 2,
  maxDropsPerIngredient: 10,
  maxTotalDrops: 30,
  requiresCarrierOil: true,
  allowedCategories: [
    'relaxation',
    'energy',
    'focus',
    'sleep',
    'wellness',
    'beauty',
    'cleaning',
    'seasonal',
    'custom'
  ]
};

// 一滴の容量（ml）
export const DROP_TO_ML = 0.05;

// 希釈率のガイドライン
export const DILUTION_GUIDELINES = {
  baby: { min: 0.1, max: 0.25, label: '赤ちゃん用' },
  child: { min: 0.5, max: 1, label: '子供用' },
  adult_daily: { min: 1, max: 2, label: '大人（日常使い）' },
  adult_therapeutic: { min: 2, max: 3, label: '大人（治療目的）' },
  adult_acute: { min: 3, max: 5, label: '大人（急性症状）' }
};

// キャリアオイルの種類
export const CARRIER_OILS = [
  { id: 'jojoba', name: 'ホホバオイル', description: '肌なじみが良い' },
  { id: 'coconut', name: 'ココナッツオイル', description: '保湿効果が高い' },
  { id: 'almond', name: 'スイートアーモンドオイル', description: '敏感肌に優しい' },
  { id: 'grapeseed', name: 'グレープシードオイル', description: 'さらっとした使用感' },
  { id: 'argan', name: 'アルガンオイル', description: 'エイジングケアに' },
  { id: 'olive', name: 'オリーブオイル', description: '栄養豊富' }
];

// ブレンドテンプレート例
export const BLEND_TEMPLATES: BlendTemplate[] = [
  {
    id: 'relax-basic',
    name: 'リラックスブレンド',
    description: '心を落ち着かせ、リラックスしたい時に',
    category: 'relaxation',
    baseRecipe: {
      name: 'リラックスブレンド',
      description: '心を落ち着かせ、リラックスしたい時に',
      purpose: 'ストレス解消、リラクゼーション',
      ingredients: [
        { oilId: 'lavender', drops: 3, note: 'middle' },
        { oilId: 'bergamot', drops: 2, note: 'top' },
        { oilId: 'ylang-ylang', drops: 1, note: 'base' }
      ],
      totalDrops: 6,
      dilutionRatio: 2,
      carrierOil: 'jojoba',
      carrierAmount: 10,
      category: 'relaxation',
      tags: ['リラックス', 'ストレス', '夜'],
      isPublic: true,
      likes: 0,
      instructions: '手のひらに数滴取り、深呼吸しながら香りを楽しんでください。',
      precautions: '妊娠中の方は使用前に医師に相談してください。'
    },
    difficulty: 'beginner',
    featured: true
  },
  {
    id: 'focus-blend',
    name: '集中力アップブレンド',
    description: '仕事や勉強に集中したい時に',
    category: 'focus',
    baseRecipe: {
      name: '集中力アップブレンド',
      description: '仕事や勉強に集中したい時に',
      purpose: '集中力向上、頭をスッキリ',
      ingredients: [
        { oilId: 'peppermint', drops: 2, note: 'top' },
        { oilId: 'rosemary', drops: 2, note: 'middle' },
        { oilId: 'lemon', drops: 2, note: 'top' }
      ],
      totalDrops: 6,
      dilutionRatio: 1.5,
      carrierOil: 'grapeseed',
      carrierAmount: 10,
      category: 'focus',
      tags: ['集中力', '仕事', '勉強'],
      isPublic: true,
      likes: 0,
      instructions: 'こめかみに少量塗布するか、ディフューザーで拡散してください。',
      precautions: '高血圧の方は注意してください。'
    },
    difficulty: 'beginner',
    featured: true
  }
];