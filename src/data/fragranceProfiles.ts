import { FragranceProfile } from '../types/FragranceBlend';

export const fragranceProfiles: FragranceProfile[] = [
  // 柑橘系
  {
    oilId: 'lemon',
    aromaFamily: 'citrus',
    intensity: 4,
    notes: {
      top: ['フレッシュシトラス', '爽やか'],
      middle: ['レモンピール', 'グリーン'],
      base: ['クリーン', 'ライト']
    },
    personality: ['エネルギッシュ', '浄化', '集中']
  },
  {
    oilId: 'wild-orange',
    aromaFamily: 'citrus',
    intensity: 3,
    notes: {
      top: ['甘いオレンジ', 'ジューシー'],
      middle: ['フルーティ', '温かみ'],
      base: ['甘さ', 'ほのかなスパイス']
    },
    personality: ['ハッピー', '明るい', '親しみやすい']
  },
  {
    oilId: 'bergamot',
    aromaFamily: 'citrus',
    intensity: 3,
    notes: {
      top: ['上品なシトラス', 'エレガント'],
      middle: ['フローラルヒント', '複雑'],
      base: ['ほのかな苦味', '洗練']
    },
    personality: ['上品', '落ち着き', 'バランス']
  },

  // フローラル系
  {
    oilId: 'lavender',
    aromaFamily: 'floral',
    intensity: 3,
    notes: {
      top: ['フレッシュハーブ', '清涼'],
      middle: ['フローラル', '甘さ'],
      base: ['ウッディ', '安らぎ']
    },
    personality: ['リラックス', '癒し', '安眠']
  },

  // 新オイルの香りプロファイル
  {
    oilId: '6',
    aromaFamily: 'citrus',
    intensity: 4,
    notes: {
      top: ['ジューシーオレンジ', 'フレッシュ'],
      middle: ['甘い果肉', 'エネルギッシュ'],
      base: ['温かさ', 'ほのかなスパイス']
    },
    personality: ['ハッピー', '元気', '明るい']
  },
  {
    oilId: '7',
    aromaFamily: 'woody',
    intensity: 5,
    notes: {
      top: ['樹脂', '神聖'],
      middle: ['ウッディ', '深み'],
      base: ['インセンス', 'グラウンディング']
    },
    personality: ['瞑想的', '落ち着き', 'スピリチュアル']
  },
  {
    oilId: '8',
    aromaFamily: 'herbal',
    intensity: 4,
    notes: {
      top: ['メディシナル', 'クリーン'],
      middle: ['カンファー', 'シャープ'],
      base: ['アースィ', '清潔']
    },
    personality: ['浄化', 'クリア', '抗菌']
  },
  {
    oilId: '9',
    aromaFamily: 'herbal',
    intensity: 5,
    notes: {
      top: ['ピリッとしたカンファー', '冷涼'],
      middle: ['ユーカリプトール', 'メントール'],
      base: ['ウッディ', '清涼感']
    },
    personality: ['クリア', '目覚め', '呼吸']
  },
  {
    oilId: '10',
    aromaFamily: 'herbal',
    intensity: 4,
    notes: {
      top: ['ピネン', 'ハーバル'],
      middle: ['カンファー', 'シャープ'],
      base: ['ウッディ', '記憶']
    },
    personality: ['集中', '記憶', 'クリア']
  },

  // ブレンドオイルの香りプロファイル
  {
    oilId: '4',
    aromaFamily: 'spicy',
    intensity: 5,
    notes: {
      top: ['オレンジ', 'スパイシー'],
      middle: ['クローブ', 'シナモン'],
      base: ['ウォーム', '保護的']
    },
    personality: ['保護', 'エネルギッシュ', '温かい']
  },
  {
    oilId: '5',
    aromaFamily: 'herbal',
    intensity: 4,
    notes: {
      top: ['ユーカリ', 'ミント'],
      middle: ['カンファー', 'ハーバル'],
      base: ['クリーン', '呼吸']
    },
    personality: ['クリア', '呼吸', 'リフレッシュ']
  },
  {
    oilId: 'geranium',
    aromaFamily: 'floral',
    intensity: 4,
    notes: {
      top: ['ローズライク', '華やか'],
      middle: ['フローラル', 'グリーン'],
      base: ['ハーバル', 'ほのかな渋み']
    },
    personality: ['女性らしい', 'バランス', '美しい']
  },
  {
    oilId: 'ylang-ylang',
    aromaFamily: 'floral',
    intensity: 5,
    notes: {
      top: ['エキゾチック', '濃厚'],
      middle: ['甘い花', '官能的'],
      base: ['クリーミー', '持続']
    },
    personality: ['ロマンチック', '魅惑的', 'セクシー']
  },

  // ウッディ系
  {
    oilId: 'cedarwood',
    aromaFamily: 'woody',
    intensity: 3,
    notes: {
      top: ['ドライウッド', 'スモーキー'],
      middle: ['杉', '温かみ'],
      base: ['アーシー', '安定']
    },
    personality: ['グラウンディング', '安定', '男性的']
  },
  {
    oilId: 'frankincense',
    aromaFamily: 'woody',
    intensity: 4,
    notes: {
      top: ['神聖', 'レジン'],
      middle: ['ウッディスパイス', '深み'],
      base: ['バルサミック', '瞑想的']
    },
    personality: ['神聖', '瞑想', '高級']
  },

  // ハーブ系
  {
    oilId: 'rosemary',
    aromaFamily: 'herbal',
    intensity: 4,
    notes: {
      top: ['シャープハーブ', '刺激'],
      middle: ['カンファー', 'グリーン'],
      base: ['ウッディ', '持続']
    },
    personality: ['集中', '記憶', '活性化']
  },
  {
    oilId: 'basil',
    aromaFamily: 'herbal',
    intensity: 3,
    notes: {
      top: ['スイートハーブ', 'フレッシュ'],
      middle: ['スパイシー', '温かみ'],
      base: ['アニス', '甘さ']
    },
    personality: ['クリア', 'バランス', '集中']
  },

  // スパイシー系
  {
    oilId: 'peppermint',
    aromaFamily: 'fresh',
    intensity: 5,
    notes: {
      top: ['インテンスミント', '冷涼'],
      middle: ['メンソール', 'シャープ'],
      base: ['クール', '持続']
    },
    personality: ['刺激', '覚醒', '爽快']
  },
  {
    oilId: 'clove',
    aromaFamily: 'spicy',
    intensity: 5,
    notes: {
      top: ['ホットスパイス', '刺激'],
      middle: ['ウォーム', '強烈'],
      base: ['ウッディ', '持続']
    },
    personality: ['情熱', '温かみ', 'パワフル']
  },

  // フレッシュ系
  {
    oilId: 'eucalyptus',
    aromaFamily: 'fresh',
    intensity: 4,
    notes: {
      top: ['メンソール', 'クリア'],
      middle: ['カンファー', '透明感'],
      base: ['クリーン', '浄化']
    },
    personality: ['浄化', 'クリア', '呼吸']
  },
  {
    oilId: 'tea-tree',
    aromaFamily: 'fresh',
    intensity: 4,
    notes: {
      top: ['メディシナル', 'シャープ'],
      middle: ['ハーバル', 'グリーン'],
      base: ['クリーン', '抗菌']
    },
    personality: ['浄化', '保護', 'ナチュラル']
  }
];

// 香り系統の説明
export const aromaFamilyDescriptions = {
  citrus: {
    name: '柑橘系',
    description: 'フレッシュで爽やか、エネルギッシュな香り',
    characteristics: ['明るい', '爽快', '浄化', 'エネルギー'],
    icon: '🍋'
  },
  floral: {
    name: 'フローラル系',
    description: '花のような優雅で女性らしい香り',
    characteristics: ['優雅', '癒し', 'ロマンチック', '美しい'],
    icon: '🌸'
  },
  woody: {
    name: 'ウッディ系',
    description: '木の温かみと深みのある落ち着いた香り',
    characteristics: ['安定', '温かみ', 'グラウンディング', '瞑想'],
    icon: '🌳'
  },
  herbal: {
    name: 'ハーブ系',
    description: 'ナチュラルで薬草のような知的な香り',
    characteristics: ['集中', 'ナチュラル', '活性化', 'バランス'],
    icon: '🌿'
  },
  spicy: {
    name: 'スパイシー系',
    description: '温かくて刺激的、情熱的な香り',
    characteristics: ['情熱', '温かみ', 'パワフル', '刺激'],
    icon: '🌶️'
  },
  fresh: {
    name: 'フレッシュ系',
    description: '清涼感があり浄化作用のある香り',
    characteristics: ['清涼', '浄化', 'クリア', '呼吸'],
    icon: '❄️'
  }
};