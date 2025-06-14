import { BlendCompatibility, BlendSuggestion } from '../types/FragranceBlend';

export const blendCompatibilities: BlendCompatibility[] = [
  // 柑橘系同士
  { oilId1: 'lemon', oilId2: 'wild-orange', compatibility: 5, reason: '柑橘系の爽やかさが相乗効果', suggestedRatio: '1:1' },
  { oilId1: 'lemon', oilId2: 'bergamot', compatibility: 4, reason: 'フレッシュとエレガントの調和', suggestedRatio: '2:1' },
  { oilId1: 'wild-orange', oilId2: 'bergamot', compatibility: 4, reason: '甘さと上品さのバランス', suggestedRatio: '1:1' },

  // 柑橘系 × フローラル系
  { oilId1: 'lemon', oilId2: 'lavender', compatibility: 5, reason: 'クラシックな組み合わせ、万能', suggestedRatio: '1:2' },
  { oilId1: 'bergamot', oilId2: 'lavender', compatibility: 5, reason: '上品でリラックス効果抜群', suggestedRatio: '1:1' },
  { oilId1: 'wild-orange', oilId2: 'ylang-ylang', compatibility: 4, reason: '甘さが調和し、ロマンチック', suggestedRatio: '2:1' },
  { oilId1: 'bergamot', oilId2: 'geranium', compatibility: 4, reason: 'エレガントで女性らしい', suggestedRatio: '1:1' },

  // 柑橘系 × ハーブ系
  { oilId1: 'lemon', oilId2: 'rosemary', compatibility: 4, reason: '集中力を高める爽やかブレンド', suggestedRatio: '2:1' },
  { oilId1: 'wild-orange', oilId2: 'basil', compatibility: 3, reason: '甘さとハーブの意外な調和', suggestedRatio: '3:1' },

  // 柑橘系 × フレッシュ系
  { oilId1: 'lemon', oilId2: 'peppermint', compatibility: 4, reason: '究極の爽快感', suggestedRatio: '2:1' },
  { oilId1: 'lemon', oilId2: 'eucalyptus', compatibility: 4, reason: 'クリアで浄化作用', suggestedRatio: '1:1' },

  // フローラル系同士
  { oilId1: 'lavender', oilId2: 'geranium', compatibility: 4, reason: '女性らしく癒しの香り', suggestedRatio: '2:1' },
  { oilId1: 'lavender', oilId2: 'ylang-ylang', compatibility: 3, reason: 'リラックスとロマンスの融合', suggestedRatio: '3:1' },

  // フローラル系 × ウッディ系
  { oilId1: 'lavender', oilId2: 'cedarwood', compatibility: 5, reason: '安眠とグラウンディングの最強コンビ', suggestedRatio: '2:1' },
  { oilId1: 'geranium', oilId2: 'frankincense', compatibility: 4, reason: '美と神聖さの調和', suggestedRatio: '1:1' },
  { oilId1: 'ylang-ylang', oilId2: 'frankincense', compatibility: 4, reason: '官能的で神秘的', suggestedRatio: '1:2' },

  // フローラル系 × ハーブ系
  { oilId1: 'lavender', oilId2: 'rosemary', compatibility: 3, reason: 'リラックスと活性化のバランス', suggestedRatio: '2:1' },
  { oilId1: 'geranium', oilId2: 'basil', compatibility: 3, reason: '女性らしさとクリアさ', suggestedRatio: '1:1' },

  // ウッディ系同士
  { oilId1: 'cedarwood', oilId2: 'frankincense', compatibility: 5, reason: '深い瞑想とグラウンディング', suggestedRatio: '1:1' },

  // ウッディ系 × ハーブ系
  { oilId1: 'cedarwood', oilId2: 'rosemary', compatibility: 3, reason: '安定と活性化', suggestedRatio: '1:1' },
  { oilId1: 'frankincense', oilId2: 'basil', compatibility: 3, reason: '神聖とクリアさ', suggestedRatio: '2:1' },

  // ハーブ系同士
  { oilId1: 'rosemary', oilId2: 'basil', compatibility: 4, reason: 'ハーブの相乗効果で集中力アップ', suggestedRatio: '1:1' },

  // フレッシュ系
  { oilId1: 'peppermint', oilId2: 'eucalyptus', compatibility: 4, reason: '最強の清涼感と浄化', suggestedRatio: '1:2' },
  { oilId1: 'tea-tree', oilId2: 'eucalyptus', compatibility: 4, reason: '抗菌とクリアな香り', suggestedRatio: '1:1' },

  // 特別な組み合わせ
  { oilId1: 'peppermint', oilId2: 'lavender', compatibility: 3, reason: '刺激と癒しの意外な調和', suggestedRatio: '1:3' },
  { oilId1: 'clove', oilId2: 'wild-orange', compatibility: 4, reason: 'ホリデーシーズンの定番', suggestedRatio: '1:4' }
];

export const blendSuggestions: BlendSuggestion[] = [
  {
    id: 'morning-energy',
    name: 'モーニングエナジー',
    description: '朝の目覚めとエネルギーチャージに最適なブレンド',
    category: 'energizing',
    oils: [
      { oilId: 'wild-orange', oilName: 'Wild Orange', drops: 4, role: 'primary' },
      { oilId: 'peppermint', oilName: 'Peppermint', drops: 2, role: 'secondary' },
      { oilId: 'lemon', oilName: 'Lemon', drops: 2, role: 'accent' }
    ],
    compatibility: 4.5,
    mood: '爽快で元気いっぱい',
    season: 'all'
  },
  {
    id: 'evening-calm',
    name: 'イブニングカーム',
    description: '一日の疲れを癒し、深いリラックスへ導くブレンド',
    category: 'relaxing',
    oils: [
      { oilId: 'lavender', oilName: 'Lavender', drops: 4, role: 'primary' },
      { oilId: 'bergamot', oilName: 'Bergamot', drops: 2, role: 'secondary' },
      { oilId: 'cedarwood', oilName: 'Cedarwood', drops: 1, role: 'accent' }
    ],
    compatibility: 5,
    mood: '深い安らぎと平和',
    season: 'all'
  },
  {
    id: 'romantic-evening',
    name: 'ロマンチックイブニング',
    description: '特別な夜を演出する魅惑的で官能的なブレンド',
    category: 'romantic',
    oils: [
      { oilId: 'ylang-ylang', oilName: 'Ylang Ylang', drops: 2, role: 'primary' },
      { oilId: 'bergamot', oilName: 'Bergamot', drops: 3, role: 'secondary' },
      { oilId: 'frankincense', oilName: 'Frankincense', drops: 2, role: 'accent' }
    ],
    compatibility: 4.2,
    mood: '官能的で神秘的',
    season: 'all'
  },
  {
    id: 'forest-walk',
    name: 'フォレストウォーク',
    description: '森林浴のような自然の恵みを感じるアーシーなブレンド',
    category: 'fresh',
    oils: [
      { oilId: 'cedarwood', oilName: 'Cedarwood', drops: 3, role: 'primary' },
      { oilId: 'eucalyptus', oilName: 'Eucalyptus', drops: 2, role: 'secondary' },
      { oilId: 'tea-tree', oilName: 'Tea Tree', drops: 1, role: 'accent' }
    ],
    compatibility: 4.3,
    mood: '自然で清浄',
    season: 'autumn'
  },
  {
    id: 'elegant-lady',
    name: 'エレガントレディ',
    description: '上品で女性らしい、洗練された大人の香り',
    category: 'sophisticated',
    oils: [
      { oilId: 'geranium', oilName: 'Geranium', drops: 3, role: 'primary' },
      { oilId: 'bergamot', oilName: 'Bergamot', drops: 2, role: 'secondary' },
      { oilId: 'frankincense', oilName: 'Frankincense', drops: 1, role: 'accent' }
    ],
    compatibility: 4.4,
    mood: '上品で洗練された',
    season: 'all'
  },
  {
    id: 'study-focus',
    name: 'スタディフォーカス',
    description: '集中力と記憶力を高める勉強・仕事に最適なブレンド',
    category: 'energizing',
    oils: [
      { oilId: 'rosemary', oilName: 'Rosemary', drops: 3, role: 'primary' },
      { oilId: 'lemon', oilName: 'Lemon', drops: 2, role: 'secondary' },
      { oilId: 'basil', oilName: 'Basil', drops: 1, role: 'accent' }
    ],
    compatibility: 4.1,
    mood: 'クリアで集中',
    season: 'all'
  },
  {
    id: 'spring-garden',
    name: 'スプリングガーデン',
    description: '春の花園を思わせる華やかで明るいフローラルブレンド',
    category: 'fresh',
    oils: [
      { oilId: 'lavender', oilName: 'Lavender', drops: 2, role: 'primary' },
      { oilId: 'geranium', oilName: 'Geranium', drops: 2, role: 'secondary' },
      { oilId: 'lemon', oilName: 'Lemon', drops: 2, role: 'accent' }
    ],
    compatibility: 4.3,
    mood: '明るく華やか',
    season: 'spring'
  },
  {
    id: 'winter-warmth',
    name: 'ウィンターウォームス',
    description: '寒い冬の夜を暖かく包む、ホリデー気分のスパイシーブレンド',
    category: 'sophisticated',
    oils: [
      { oilId: 'wild-orange', oilName: 'Wild Orange', drops: 4, role: 'primary' },
      { oilId: 'clove', oilName: 'Clove', drops: 1, role: 'secondary' },
      { oilId: 'cedarwood', oilName: 'Cedarwood', drops: 2, role: 'accent' }
    ],
    compatibility: 4.4,
    mood: '暖かく祝祭的',
    season: 'winter'
  },

  // 新オイルを活用した革新的ブレンド
  {
    id: 'immunity-shield',
    name: 'イミュニティシールド',
    description: 'オンガードとフランキンセンスで免疫力をサポートする保護ブレンド',
    category: 'energizing',
    oils: [
      { oilId: '4', oilName: 'オンガード', drops: 3, role: 'primary' },
      { oilId: '7', oilName: 'フランキンセンス', drops: 2, role: 'secondary' },
      { oilId: '6', oilName: 'ワイルドオレンジ', drops: 2, role: 'accent' }
    ],
    compatibility: 4.6,
    mood: '保護的で力強い',
    season: 'winter'
  },
  {
    id: 'respiratory-clear',
    name: 'レスピラトリークリア',
    description: 'ブリーズとユーカリで呼吸をクリアにする浄化ブレンド',
    category: 'fresh',
    oils: [
      { oilId: '5', oilName: 'ブリーズ', drops: 4, role: 'primary' },
      { oilId: '9', oilName: 'ユーカリ', drops: 2, role: 'secondary' },
      { oilId: '8', oilName: 'ティーツリー', drops: 1, role: 'accent' }
    ],
    compatibility: 4.7,
    mood: 'クリアで浄化的',
    season: 'all'
  },
  {
    id: 'meditation-deep',
    name: 'メディテーションディープ',
    description: 'フランキンセンスとラベンダーで深い瞑想状態を促すスピリチュアルブレンド',
    category: 'relaxing',
    oils: [
      { oilId: '7', oilName: 'フランキンセンス', drops: 4, role: 'primary' },
      { oilId: 'lavender', oilName: 'ラベンダー', drops: 3, role: 'secondary' },
      { oilId: '6', oilName: 'ワイルドオレンジ', drops: 1, role: 'accent' }
    ],
    compatibility: 4.8,
    mood: '神聖で内省的',
    season: 'all'
  },
  {
    id: 'mental-clarity',
    name: 'メンタルクラリティ',
    description: 'ローズマリーとペパーミントで記憶力と集中力を最大化するブレンド',
    category: 'energizing',
    oils: [
      { oilId: '10', oilName: 'ローズマリー', drops: 3, role: 'primary' },
      { oilId: 'peppermint', oilName: 'ペパーミント', drops: 2, role: 'secondary' },
      { oilId: '7', oilName: 'フランキンセンス', drops: 1, role: 'accent' }
    ],
    compatibility: 4.5,
    mood: 'シャープで明晰',
    season: 'all'
  },
  {
    id: 'skin-purifying',
    name: 'スキンピュリファイング',
    description: 'ティーツリーとラベンダーで肌を清浄に保つ美容ブレンド',
    category: 'fresh',
    oils: [
      { oilId: '8', oilName: 'ティーツリー', drops: 2, role: 'primary' },
      { oilId: 'lavender', oilName: 'ラベンダー', drops: 3, role: 'secondary' },
      { oilId: '3', oilName: 'レモン', drops: 1, role: 'accent' }
    ],
    compatibility: 4.4,
    mood: 'クリーンで健康的',
    season: 'all'
  },
  {
    id: 'joyful-morning',
    name: 'ジョイフルモーニング',
    description: 'ワイルドオレンジとフランキンセンスで喜びに満ちた朝を迎えるブレンド',
    category: 'energizing',
    oils: [
      { oilId: '6', oilName: 'ワイルドオレンジ', drops: 4, role: 'primary' },
      { oilId: '7', oilName: 'フランキンセンス', drops: 2, role: 'secondary' },
      { oilId: 'lavender', oilName: 'ラベンダー', drops: 1, role: 'accent' }
    ],
    compatibility: 4.6,
    mood: '喜びに満ちた明るさ',
    season: 'spring'
  },
  {
    id: 'grounding-earth',
    name: 'グラウンディングアース',
    description: 'フランキンセンスとティーツリーで大地とのつながりを感じるアーシーブレンド',
    category: 'sophisticated',
    oils: [
      { oilId: '7', oilName: 'フランキンセンス', drops: 3, role: 'primary' },
      { oilId: '8', oilName: 'ティーツリー', drops: 2, role: 'secondary' },
      { oilId: '9', oilName: 'ユーカリ', drops: 1, role: 'accent' }
    ],
    compatibility: 4.3,
    mood: 'グラウンディングで安定',
    season: 'autumn'
  },
  {
    id: 'confidence-boost',
    name: 'コンフィデンスブースト',
    description: 'ローズマリーとワイルドオレンジで自信と活力を高めるエンパワメントブレンド',
    category: 'energizing',
    oils: [
      { oilId: '10', oilName: 'ローズマリー', drops: 3, role: 'primary' },
      { oilId: '6', oilName: 'ワイルドオレンジ', drops: 3, role: 'secondary' },
      { oilId: '2', oilName: 'ペパーミント', drops: 1, role: 'accent' }
    ],
    compatibility: 4.4,
    mood: '自信に満ちた力強さ',
    season: 'all'
  }
];