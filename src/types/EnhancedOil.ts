export interface SafetyInfo {
  baby: {
    safe: boolean;
    ageRestriction: string;
  };
  pregnancy: {
    safe: boolean;
    notes: string;
  };
  photosensitivity: {
    sensitive: boolean;
    hours: number;
  };
  warnings: string;
  petSafety: string;
}

export interface UsageInfo {
  methods: ('aromatic' | 'topical' | 'internal')[];
  dilutionRatio: string;
  applicationAreas: string[];
}

export interface EnhancedOil {
  id: string;
  nameJa: string;
  nameEn: string;
  category: 'フローラル系' | '柑橘系' | 'ハーブ系' | 'ブレンド' | '樹木系' | 'スパイス系' | 'ウッディ系' | 'カンファー系' | 'アーシー系' | '感情アロマセラピー' | 'キッズコレクション' | '季節限定';
  productType: 'single_oil' | 'blend';
  blendIngredients?: string[];
  symptoms: string[];
  effects: string[];
  mood: string;
  medicalReference: string;
  safety: SafetyInfo;
  usage: UsageInfo;
  blendSuggestions: string[];
  
  // 既存との互換性のため
  aroma: string;
  benefits: string[];
  description: string;
  safetyInfo: {
    pregnancy: boolean;
    children: boolean;
    notes: string;
  };
}

// 既存のOil型との変換関数
export const convertToLegacyOil = (enhancedOil: EnhancedOil) => ({
  id: enhancedOil.id,
  name: enhancedOil.nameEn,
  category: mapCategoryToLegacy(enhancedOil.category),
  benefits: enhancedOil.effects,
  symptoms: enhancedOil.symptoms,
  aroma: enhancedOil.mood,
  safetyInfo: {
    pregnancy: enhancedOil.safety.pregnancy.safe,
    children: enhancedOil.safety.baby.safe,
    notes: enhancedOil.safety.warnings
  },
  usage: enhancedOil.usage.methods.map(method => mapUsageMethod(method)),
  description: enhancedOil.medicalReference
});

const mapCategoryToLegacy = (category: string) => {
  const mapping: Record<string, string> = {
    'フローラル系': 'floral',
    '柑橘系': 'citrus',
    'ハーブ系': 'herbal',
    'ブレンド': 'blend',
    '樹木系': 'floral',
    'スパイス系': 'herbal',
    'ウッディ系': 'floral',
    'カンファー系': 'herbal',
    'アーシー系': 'herbal'
  };
  return mapping[category] || 'floral';
};

const mapUsageMethod = (method: string) => {
  const mapping: Record<string, string> = {
    'aromatic': 'アロマ',
    'topical': '局所塗布',
    'internal': '内服'
  };
  return mapping[method] || method;
};