import { EnhancedOil } from '../types/EnhancedOil';

// JSONデータからEnhancedOil型への変換関数
interface RawOilData {
  id: number;
  name_ja: string;
  name_en: string;
  category: string;
  product_type: string;
  blend_ingredients?: string[];
  symptoms: string[];
  effects: string[];
  mood: string;
  medical_reference: string;
  baby_safe: boolean;
  baby_age_restriction: string;
  pregnancy_safe: boolean;
  pregnancy_notes: string;
  photosensitivity: boolean;
  photosensitivity_hours: number;
  warnings: string;
  pet_safety: string;
  usage_methods: string[];
  dilution_ratio: string;
  application_areas: string[];
  blend_suggestions: string[];
}

const mapCategoryFromJSON = (category: string): EnhancedOil['category'] => {
  const mapping: Record<string, EnhancedOil['category']> = {
    'フローラル系': 'フローラル系',
    '柑橘系': '柑橘系',
    'ハーブ系': 'ハーブ系',
    'ブレンド': 'ブレンド',
    '樹木系': '樹木系',
    'スパイス系': 'スパイス系',
    'ウッディ系': 'ウッディ系',
    'カンファー系': 'カンファー系',
    'アーシー系': 'アーシー系'
  };
  return mapping[category] || 'ハーブ系';
};

const convertRawDataToEnhanced = (raw: RawOilData): EnhancedOil => {
  return {
    id: raw.id.toString(),
    nameJa: raw.name_ja,
    nameEn: raw.name_en,
    category: mapCategoryFromJSON(raw.category),
    productType: raw.product_type as 'single_oil' | 'blend',
    blendIngredients: raw.blend_ingredients,
    symptoms: raw.symptoms,
    effects: raw.effects,
    mood: raw.mood,
    medicalReference: raw.medical_reference,
    safety: {
      baby: {
        safe: raw.baby_safe,
        ageRestriction: raw.baby_age_restriction
      },
      pregnancy: {
        safe: raw.pregnancy_safe,
        notes: raw.pregnancy_notes
      },
      photosensitivity: {
        sensitive: raw.photosensitivity,
        hours: raw.photosensitivity_hours
      },
      warnings: raw.warnings,
      petSafety: raw.pet_safety
    },
    usage: {
      methods: raw.usage_methods as ('aromatic' | 'topical' | 'internal')[],
      dilutionRatio: raw.dilution_ratio,
      applicationAreas: raw.application_areas
    },
    blendSuggestions: raw.blend_suggestions,
    
    // 既存互換性
    aroma: raw.mood,
    benefits: raw.effects,
    description: raw.medical_reference,
    safetyInfo: {
      pregnancy: raw.pregnancy_safe,
      children: raw.baby_safe,
      notes: raw.warnings
    }
  };
};

// 提供されたJSONデータの配列
const rawOilsData: RawOilData[] = [
  {
    id: 1,
    name_ja: "ラベンダー",
    name_en: "Lavender",
    category: "フローラル系",
    product_type: "single_oil",
    symptoms: ["不安", "不眠", "肌の炎症", "軽度の皮膚刺激", "緊張"],
    effects: ["リラクゼーション", "睡眠促進", "肌の鎮静", "精神的な安定", "ストレス軽減"],
    mood: "心を落ち着かせる、穏やか、リラックス、自己認識の向上",
    medical_reference: "睡眠の質改善、不安軽減に関する研究あり（医療行為を推奨するものではありません）",
    baby_safe: true,
    baby_age_restriction: "生後3ヶ月以降（適切に希釈）",
    pregnancy_safe: true,
    pregnancy_notes: "第2・3トリメスターで使用推奨、アロマと局所使用に限定",
    photosensitivity: false,
    photosensitivity_hours: 0,
    warnings: "敏感肌への使用時は希釈必須、内服前に医師相談",
    pet_safety: "猫への使用は避ける、犬は適切に希釈すれば使用可能",
    usage_methods: ["aromatic", "topical", "internal"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル5-10滴",
    application_areas: ["こめかみ", "首の後ろ", "足裏", "胸部"],
    blend_suggestions: ["ベルガモット", "イランイラン", "フランキンセンス", "レモン"]
  },
  {
    id: 2,
    name_ja: "ペパーミント",
    name_en: "Peppermint",
    category: "ハーブ系",
    product_type: "single_oil",
    symptoms: ["消化不良", "頭痛", "筋肉痛", "鼻づまり", "疲労感", "吐き気"],
    effects: ["消化促進", "呼吸機能サポート", "冷却効果", "集中力向上", "エネルギー増進"],
    mood: "活力的、集中力向上、リフレッシュ、目覚め",
    medical_reference: "消化器系サポート、呼吸機能改善の研究あり（医療行為を推奨するものではありません）",
    baby_safe: false,
    baby_age_restriction: "6歳以下の使用不可",
    pregnancy_safe: true,
    pregnancy_notes: "第2・3トリメスターで使用可、授乳中は避ける",
    photosensitivity: false,
    photosensitivity_hours: 0,
    warnings: "高濃度メントール含有のため希釈必須、目や粘膜への接触避ける",
    pet_safety: "猫への使用は避ける、犬への使用も注意が必要",
    usage_methods: ["aromatic", "topical", "internal"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル10滴",
    application_areas: ["こめかみ", "首の後ろ", "足裏", "胸部（希釈必須）"],
    blend_suggestions: ["レモン", "ラベンダー", "ユーカリ", "ローズマリー"]
  },
  {
    id: 3,
    name_ja: "レモン",
    name_en: "Lemon",
    category: "柑橘系",
    product_type: "single_oil",
    symptoms: ["消化不良", "疲労感", "集中力不足", "気分の落ち込み"],
    effects: ["消化促進", "デトックス効果", "空気清浄", "気分向上", "免疫サポート"],
    mood: "爽快感、エネルギッシュ、前向き、集中力向上",
    medical_reference: "消化器系サポート、抗酸化作用の研究あり（医療行為を推奨するものではありません）",
    baby_safe: true,
    baby_age_restriction: "生後6ヶ月以降（適切に希釈）",
    pregnancy_safe: true,
    pregnancy_notes: "全期間使用可能、局所使用時は光毒性に注意",
    photosensitivity: true,
    photosensitivity_hours: 12,
    warnings: "局所使用後12時間は日光・紫外線を避ける",
    pet_safety: "適切に希釈すれば犬猫共に使用可能",
    usage_methods: ["aromatic", "topical", "internal"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル5滴",
    application_areas: ["足裏", "手首（日光曝露を避ける場所）"],
    blend_suggestions: ["ペパーミント", "ラベンダー", "フランキンセンス", "ユーカリ"]
  },
  {
    id: 4,
    name_ja: "オンガード",
    name_en: "On Guard",
    category: "ブレンド",
    product_type: "blend",
    blend_ingredients: ["ワイルドオレンジ", "クローブ", "シナモンバーク", "ユーカリ", "ローズマリー"],
    symptoms: ["免疫力低下", "季節の変わり目の不調", "環境的脅威"],
    effects: ["免疫システムサポート", "抗酸化作用", "表面クリーニング", "保護効果"],
    mood: "活力的、守られている感覚、エネルギッシュ",
    medical_reference: "免疫機能サポート、抗菌・抗ウイルス作用の研究あり（医療行為を推奨するものではありません）",
    baby_safe: false,
    baby_age_restriction: "2歳以下の内服は避ける、局所使用は適切に希釈",
    pregnancy_safe: true,
    pregnancy_notes: "第2・3トリメスターで適度に使用、シナモンとクローブ含有のため注意",
    photosensitivity: false,
    photosensitivity_hours: 0,
    warnings: "希釈せずに使用すると皮膚刺激の可能性、高濃度で使用注意",
    pet_safety: "猫への使用は避ける、犬は適切に希釈すれば使用可能",
    usage_methods: ["aromatic", "topical", "internal"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル10滴",
    application_areas: ["足裏", "胸部", "手首"],
    blend_suggestions: ["フランキンセンス", "ラベンダー", "レモン", "ユーカリ"]
  },
  {
    id: 5,
    name_ja: "ブリーズ",
    name_en: "Breathe",
    category: "ブレンド",
    product_type: "blend",
    blend_ingredients: ["ローレルリーフ", "ペパーミント", "ユーカリ", "ティーツリー", "レモン", "カルダモン", "ラビンツァラ", "ラベンサラ"],
    symptoms: ["呼吸器の不調", "鼻づまり", "季節的な呼吸の問題", "睡眠時の呼吸困難"],
    effects: ["気道のクリア感", "呼吸のしやすさ", "季節的脅威への対処", "安眠促進"],
    mood: "安らぎ、清々しさ、リフレッシュ、落ち着き",
    medical_reference: "呼吸機能サポート、気道の健やかさに関する研究あり（医療行為を推奨するものではありません）",
    baby_safe: true,
    baby_age_restriction: "生後3ヶ月以降（適切に希釈、doTERRA Touch使用推奨）",
    pregnancy_safe: true,
    pregnancy_notes: "全期間使用可能、ユーカリ含有のため適度な使用",
    photosensitivity: true,
    photosensitivity_hours: 12,
    warnings: "レモン含有のため局所使用後12時間は日光を避ける",
    pet_safety: "ユーカリ・ティーツリー含有のため猫への使用は避ける",
    usage_methods: ["aromatic", "topical"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル5-10滴",
    application_areas: ["胸部", "背中", "足裏", "首"],
    blend_suggestions: ["ペパーミント", "ユーカリ", "ラベンダー", "レモン"]
  },
  {
    id: 6,
    name_ja: "ワイルドオレンジ",
    name_en: "Wild Orange",
    category: "柑橘系",
    product_type: "single_oil",
    symptoms: ["ストレス", "気分の落ち込み", "疲労感", "集中力不足"],
    effects: ["気分向上", "エネルギー増進", "空気清浄", "ストレス軽減"],
    mood: "明るい、元気、楽天的、ポジティブ",
    medical_reference: "気分改善、ストレス軽減の研究あり（医療行為を推奨するものではありません）",
    baby_safe: true,
    baby_age_restriction: "生後6ヶ月以降（適切に希釈）",
    pregnancy_safe: true,
    pregnancy_notes: "全期間使用可能、局所使用時は光毒性に注意",
    photosensitivity: true,
    photosensitivity_hours: 12,
    warnings: "局所使用後12時間は日光・紫外線を避ける",
    pet_safety: "適切に希釈すれば犬猫共に使用可能",
    usage_methods: ["aromatic", "topical", "internal"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル5滴",
    application_areas: ["足裏", "手首（日光曝露を避ける場所）"],
    blend_suggestions: ["ラベンダー", "フランキンセンス", "ジンジャー", "シナモン"]
  },
  {
    id: 7,
    name_ja: "フランキンセンス",
    name_en: "Frankincense",
    category: "樹木系",
    product_type: "single_oil",
    symptoms: ["ストレス", "不安", "集中力不足", "精神的な疲労"],
    effects: ["グラウンディング", "精神的な安定", "瞑想サポート", "スキンケア"],
    mood: "内省的、こころ落ち着く、神聖、平和",
    medical_reference: "ストレス軽減、神経系サポートの研究あり（医療行為を推奨するものではありません）",
    baby_safe: true,
    baby_age_restriction: "生後3ヶ月以降（適切に希釈）",
    pregnancy_safe: true,
    pregnancy_notes: "全期間使用可能、アロマと局所使用に限定",
    photosensitivity: false,
    photosensitivity_hours: 0,
    warnings: "敏感肌への使用時は希釈必須",
    pet_safety: "適切に希釈すれば犬猫共に使用可能",
    usage_methods: ["aromatic", "topical", "internal"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル5滴",
    application_areas: ["こめかみ", "首の後ろ", "足裏", "胸部"],
    blend_suggestions: ["ラベンダー", "ワイルドオレンジ", "サンダルウッド", "ローズ"]
  },
  {
    id: 8,
    name_ja: "ティーツリー",
    name_en: "Tea Tree",
    category: "カンファー系",
    product_type: "single_oil",
    symptoms: ["肌のトラブル", "毛穴の問題", "爪の健康", "小さな傷"],
    effects: ["抗菌作用", "抗真菌作用", "皮膚清浄", "クリーニング"],
    mood: "クリーン、リフレッシュ、清潔、空気がきれい",
    medical_reference: "抗菌・抗真菌作用、皮膚ケアの研究あり（医療行為を推奨するものではありません）",
    baby_safe: false,
    baby_age_restriction: "2歳以下の使用不可",
    pregnancy_safe: true,
    pregnancy_notes: "第2・3トリメスターで使用可、高希釈で局所使用",
    photosensitivity: false,
    photosensitivity_hours: 0,
    warnings: "敏感肌への使用時は希釈必須、直接肌につける場合はパッチテスト推奨",
    pet_safety: "猫への使用は避ける、犬は適切に希釈すれば使用可能",
    usage_methods: ["aromatic", "topical"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル10滴",
    application_areas: ["局所的な肌のトラブル部位", "爪周り", "足裏"],
    blend_suggestions: ["ラベンダー", "レモン", "ユーカリ", "ローズマリー"]
  },
  {
    id: 9,
    name_ja: "ユーカリ",
    name_en: "Eucalyptus",
    category: "カンファー系",
    product_type: "single_oil",
    symptoms: ["呼吸器の不調", "鼻づまり", "筋肉痛", "関節痛"],
    effects: ["呼吸サポート", "清涼感", "毛穴オープン", "クリアな呼吸"],
    mood: "クリア、リフレッシュ、清潔、目覚め",
    medical_reference: "呼吸機能サポート、抗菌作用の研究あり（医療行為を推奨するものではありません）",
    baby_safe: false,
    baby_age_restriction: "10歳以下の内服不可、局所使用は2歳以上",
    pregnancy_safe: false,
    pregnancy_notes: "妊娠中は使用禁止、授乳中も避ける",
    photosensitivity: false,
    photosensitivity_hours: 0,
    warnings: "高濃度での使用注意、希釈必須、目や粘膜への接触避ける",
    pet_safety: "猫への使用は避ける、犬は適切に希釈して使用",
    usage_methods: ["aromatic", "topical"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル10滴",
    application_areas: ["胸部", "背中", "足裏", "首"],
    blend_suggestions: ["ペパーミント", "レモン", "ラベンダー", "ティーツリー"]
  },
  {
    id: 10,
    name_ja: "ローズマリー",
    name_en: "Rosemary",
    category: "ハーブ系",
    product_type: "single_oil",
    symptoms: ["集中力不足", "記憶力低下", "精神的疲労", "頭髪の健康"],
    effects: ["集中力向上", "記憶力サポート", "頭皮ケア", "精神清明"],
    mood: "シャープ、クリア、集中、目覚め",
    medical_reference: "記憶力向上、集中力改善の研究あり（医療行為を推奨するものではありません）",
    baby_safe: false,
    baby_age_restriction: "6歳以下の使用不可",
    pregnancy_safe: true,
    pregnancy_notes: "第2・3トリメスターで使用可、適度な使用",
    photosensitivity: false,
    photosensitivity_hours: 0,
    warnings: "高血圧の方は使用前に医師に相談、希釈必須",
    pet_safety: "適切に希釈すれば犬猫共に使用可能",
    usage_methods: ["aromatic", "topical", "internal"],
    dilution_ratio: "1滴のエッセンシャルオイルに対してキャリアオイル10滴",
    application_areas: ["こめかみ", "首の後ろ", "頭皮", "足裏"],
    blend_suggestions: ["ペパーミント", "レモン", "ユーカリ", "フランキンセンス"]
  }
];

// 変換関数でデータを生成
export const enhancedOilsData: EnhancedOil[] = rawOilsData.map(convertRawDataToEnhanced);

// エイリアス - 推奨システムで使用
export const enhancedOils = enhancedOilsData;

// 既存のoilsDataとの統合用
export const getEnhancedOilById = (id: string): EnhancedOil | undefined => {
  return enhancedOilsData.find(oil => oil.id === id);
};