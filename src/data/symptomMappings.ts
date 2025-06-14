import { SymptomMapping, TimeBasedMapping, SeasonalMapping } from '../types/Recommendation';

export const symptomMappings: SymptomMapping[] = [
  {
    symptom: 'headache',
    nameJa: '頭痛',
    description: 'ストレス性頭痛や緊張性頭痛の緩和',
    recommendedOils: [
      { oilId: 'peppermint', score: 95, reason: '冷却効果で頭痛を和らげる' },
      { oilId: 'lavender', score: 85, reason: 'リラックス効果で緊張を和らげる' },
      { oilId: 'eucalyptus', score: 80, reason: '鼻詰まりによる頭痛に効果的' },
      { oilId: 'rosemary', score: 75, reason: '血行促進で頭痛を軽減' }
    ],
    recommendedRecipeCategories: [
      { category: 'リラックス', score: 90, reason: 'ストレス性頭痛の軽減' },
      { category: '集中力', score: 70, reason: '頭痛後の集中力回復' }
    ],
    recommendedBlendCategories: [
      { category: 'relaxing', score: 85, reason: '緊張をほぐしてリラックス' }
    ]
  },
  {
    symptom: 'stress',
    nameJa: 'ストレス',
    description: '日常のストレスや不安の軽減',
    recommendedOils: [
      { oilId: 'lavender', score: 95, reason: '最も効果的なリラックスオイル' },
      { oilId: 'frankincense', score: 85, reason: '深いリラックスと瞑想効果' },
      { oilId: 'bergamot', score: 80, reason: '気分を明るくしてストレス軽減' },
      { oilId: 'ylang_ylang', score: 75, reason: '心を落ち着かせる効果' }
    ],
    recommendedRecipeCategories: [
      { category: 'リラックス', score: 95, reason: 'ストレス軽減の定番' },
      { category: '瞑想・スピリチュアル', score: 80, reason: '深いリラクゼーション' }
    ],
    recommendedBlendCategories: [
      { category: 'relaxing', score: 95, reason: 'ストレス解消の香り' },
      { category: 'sophisticated', score: 70, reason: '上品で落ち着く香り' }
    ]
  },
  {
    symptom: 'sleep',
    nameJa: '睡眠の質',
    description: 'より良い睡眠とリラックス',
    recommendedOils: [
      { oilId: 'lavender', score: 100, reason: '最高の睡眠促進オイル' },
      { oilId: 'cedarwood', score: 85, reason: '深い眠りをサポート' },
      { oilId: 'ylang_ylang', score: 75, reason: '心を落ち着かせて安眠' },
      { oilId: 'frankincense', score: 70, reason: '深いリラクゼーション効果' }
    ],
    recommendedRecipeCategories: [
      { category: '安眠', score: 100, reason: '睡眠専用ブレンド' },
      { category: 'リラックス', score: 80, reason: 'リラックスして眠りにつく' }
    ],
    recommendedBlendCategories: [
      { category: 'relaxing', score: 95, reason: '深いリラックス効果' }
    ]
  },
  {
    symptom: 'focus',
    nameJa: '集中力',
    description: '仕事や勉強時の集中力アップ',
    recommendedOils: [
      { oilId: 'peppermint', score: 90, reason: '頭をスッキリさせて集中力向上' },
      { oilId: 'rosemary', score: 85, reason: '記憶力と集中力を高める' },
      { oilId: 'lemon', score: 80, reason: '気分をリフレッシュして集中' },
      { oilId: 'eucalyptus', score: 75, reason: '頭をクリアにする効果' }
    ],
    recommendedRecipeCategories: [
      { category: '集中力', score: 100, reason: '集中力専用ブレンド' },
      { category: '気分転換', score: 70, reason: 'リフレッシュして集中' }
    ],
    recommendedBlendCategories: [
      { category: 'energizing', score: 90, reason: 'エネルギッシュな集中力' },
      { category: 'fresh', score: 85, reason: 'フレッシュな頭で集中' }
    ]
  },
  {
    symptom: 'energy',
    nameJa: 'エネルギー不足',
    description: '疲労感や活力不足の解消',
    recommendedOils: [
      { oilId: 'peppermint', score: 95, reason: '即効性のあるエネルギーブースト' },
      { oilId: 'lemon', score: 90, reason: '爽やかで元気になる香り' },
      { oilId: 'orange', score: 85, reason: '明るく元気な気分に' },
      { oilId: 'rosemary', score: 80, reason: '頭をシャキッとさせる' }
    ],
    recommendedRecipeCategories: [
      { category: '気分転換', score: 95, reason: 'エネルギーチャージ' },
      { category: '集中力', score: 75, reason: '活力と集中力の両立' }
    ],
    recommendedBlendCategories: [
      { category: 'energizing', score: 100, reason: 'エネルギッシュなブレンド' },
      { category: 'fresh', score: 85, reason: 'フレッシュで活力的' }
    ]
  },
  {
    symptom: 'cold',
    nameJa: '風邪症状',
    description: '鼻詰まりや喉の不調',
    recommendedOils: [
      { oilId: 'eucalyptus', score: 95, reason: '鼻詰まりの解消に最適' },
      { oilId: 'tea_tree', score: 90, reason: '抗菌・抗ウイルス効果' },
      { oilId: 'peppermint', score: 85, reason: '呼吸を楽にする' },
      { oilId: 'lemon', score: 80, reason: 'ビタミンCで免疫サポート' }
    ],
    recommendedRecipeCategories: [
      { category: '呼吸サポート', score: 100, reason: '呼吸器系のサポート' },
      { category: '免疫サポート', score: 95, reason: '免疫力を高める' }
    ],
    recommendedBlendCategories: [
      { category: 'fresh', score: 90, reason: 'スッキリとした呼吸' }
    ]
  },
  {
    symptom: 'muscle_pain',
    nameJa: '筋肉痛',
    description: '筋肉の疲労や痛みの緩和',
    recommendedOils: [
      { oilId: 'peppermint', score: 90, reason: '冷却効果で痛みを和らげる' },
      { oilId: 'eucalyptus', score: 85, reason: '抗炎症作用で痛み軽減' },
      { oilId: 'lavender', score: 75, reason: 'リラックス効果で筋肉の緊張緩和' },
      { oilId: 'rosemary', score: 70, reason: '血行促進で回復をサポート' }
    ],
    recommendedRecipeCategories: [
      { category: 'リラックス', score: 80, reason: '筋肉の緊張をほぐす' }
    ],
    recommendedBlendCategories: [
      { category: 'relaxing', score: 85, reason: '深いリラックスで回復' }
    ]
  },
  {
    symptom: 'mood',
    nameJa: '気分の落ち込み',
    description: '憂鬱な気分や気持ちの落ち込み',
    recommendedOils: [
      { oilId: 'orange', score: 95, reason: '明るく前向きな気分に' },
      { oilId: 'bergamot', score: 90, reason: '心を明るくする効果' },
      { oilId: 'lemon', score: 85, reason: '爽やかで気分爽快' },
      { oilId: 'ylang_ylang', score: 80, reason: '幸福感を高める' }
    ],
    recommendedRecipeCategories: [
      { category: '気分転換', score: 100, reason: 'ポジティブな気分に変換' },
      { category: 'リラックス', score: 70, reason: '心を落ち着かせる' }
    ],
    recommendedBlendCategories: [
      { category: 'energizing', score: 85, reason: 'エネルギッシュで前向き' },
      { category: 'romantic', score: 75, reason: '幸福感を高める香り' }
    ]
  },
  {
    symptom: 'respiratory',
    nameJa: '呼吸器系',
    description: '鼻詰まりや呼吸の不調',
    recommendedOils: [
      { oilId: 'eucalyptus', score: 100, reason: '呼吸器系のサポートに最適' },
      { oilId: 'peppermint', score: 90, reason: '気道をクリアにする' },
      { oilId: 'tea_tree', score: 85, reason: '抗菌効果で呼吸器保護' },
      { oilId: 'lemon', score: 75, reason: 'ビタミンCで免疫サポート' }
    ],
    recommendedRecipeCategories: [
      { category: '呼吸サポート', score: 100, reason: '呼吸器系専用ブレンド' },
      { category: '免疫サポート', score: 80, reason: '免疫力で呼吸器保護' }
    ],
    recommendedBlendCategories: [
      { category: 'fresh', score: 95, reason: 'クリアな呼吸をサポート' }
    ]
  },
  {
    symptom: 'immune',
    nameJa: '免疫力',
    description: '免疫システムのサポート',
    recommendedOils: [
      { oilId: 'tea_tree', score: 95, reason: '強力な抗菌・抗ウイルス効果' },
      { oilId: 'lemon', score: 90, reason: 'ビタミンCで免疫サポート' },
      { oilId: 'eucalyptus', score: 85, reason: '抗菌作用で感染予防' },
      { oilId: 'frankincense', score: 80, reason: '免疫系の調整' }
    ],
    recommendedRecipeCategories: [
      { category: '免疫サポート', score: 100, reason: '免疫力強化専用' },
      { category: 'ハウスケア', score: 85, reason: '環境の清浄化' }
    ],
    recommendedBlendCategories: [
      { category: 'fresh', score: 90, reason: '清潔で健康的な環境' }
    ]
  }
];

export const timeBasedMappings: TimeBasedMapping[] = [
  {
    timeOfDay: 'morning',
    nameJa: '朝',
    description: 'エネルギッシュな一日のスタート',
    boostCategories: [
      { category: '気分転換', multiplier: 1.3 },
      { category: '集中力', multiplier: 1.2 },
      { category: 'energizing', multiplier: 1.4 },
      { category: 'fresh', multiplier: 1.2 }
    ],
    boostOilTypes: [
      { type: 'citrus', multiplier: 1.3 },
      { type: 'mint', multiplier: 1.2 }
    ]
  },
  {
    timeOfDay: 'afternoon',
    nameJa: '午後',
    description: '集中力の維持とリフレッシュ',
    boostCategories: [
      { category: '集中力', multiplier: 1.3 },
      { category: '気分転換', multiplier: 1.1 },
      { category: 'energizing', multiplier: 1.1 },
      { category: 'fresh', multiplier: 1.1 }
    ],
    boostOilTypes: [
      { type: 'mint', multiplier: 1.2 },
      { type: 'citrus', multiplier: 1.1 }
    ]
  },
  {
    timeOfDay: 'evening',
    nameJa: '夕方',
    description: '一日の疲れを癒してリラックス',
    boostCategories: [
      { category: 'リラックス', multiplier: 1.3 },
      { category: '安眠', multiplier: 1.1 },
      { category: 'relaxing', multiplier: 1.3 },
      { category: 'sophisticated', multiplier: 1.2 }
    ],
    boostOilTypes: [
      { type: 'floral', multiplier: 1.2 },
      { type: 'woody', multiplier: 1.1 }
    ]
  },
  {
    timeOfDay: 'night',
    nameJa: '夜',
    description: '深いリラックスと質の良い睡眠',
    boostCategories: [
      { category: '安眠', multiplier: 1.5 },
      { category: 'リラックス', multiplier: 1.4 },
      { category: '瞑想・スピリチュアル', multiplier: 1.3 },
      { category: 'relaxing', multiplier: 1.4 }
    ],
    boostOilTypes: [
      { type: 'floral', multiplier: 1.3 },
      { type: 'woody', multiplier: 1.2 }
    ]
  }
];

export const seasonalMappings: SeasonalMapping[] = [
  {
    season: 'spring',
    nameJa: '春',
    description: '新しい始まりとエネルギー',
    boostCategories: [
      { category: '気分転換', multiplier: 1.2 },
      { category: '免疫サポート', multiplier: 1.1 },
      { category: 'fresh', multiplier: 1.2 },
      { category: 'energizing', multiplier: 1.1 }
    ],
    featuredSymptoms: ['energy', 'mood', 'immune']
  },
  {
    season: 'summer',
    nameJa: '夏',
    description: '暑さ対策とリフレッシュ',
    boostCategories: [
      { category: '気分転換', multiplier: 1.3 },
      { category: 'fresh', multiplier: 1.4 },
      { category: 'energizing', multiplier: 1.2 }
    ],
    featuredSymptoms: ['energy', 'focus', 'mood']
  },
  {
    season: 'autumn',
    nameJa: '秋',
    description: '免疫力強化と心の安定',
    boostCategories: [
      { category: '免疫サポート', multiplier: 1.3 },
      { category: 'リラックス', multiplier: 1.2 },
      { category: 'sophisticated', multiplier: 1.2 }
    ],
    featuredSymptoms: ['immune', 'stress', 'sleep']
  },
  {
    season: 'winter',
    nameJa: '冬',
    description: '暖かさと免疫サポート',
    boostCategories: [
      { category: '免疫サポート', multiplier: 1.4 },
      { category: '呼吸サポート', multiplier: 1.3 },
      { category: 'リラックス', multiplier: 1.2 }
    ],
    featuredSymptoms: ['cold', 'respiratory', 'immune', 'mood']
  }
];