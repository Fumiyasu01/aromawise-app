import { Oil } from '../types/Oil';

export const oilsData: Oil[] = [
  // 柑橘系オイル
  {
    id: 'lemon',
    name: 'Lemon',
    category: 'citrus',
    benefits: ['浄化', 'エネルギー向上', '集中力アップ'],
    symptoms: ['疲労', '集中力低下', '気分の落ち込み'],
    aroma: 'フレッシュで爽やかな柑橘の香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '光毒性あり。塗布後12時間は直射日光を避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'レモンオイルは浄化作用があり、気分をリフレッシュさせます。'
  },
  {
    id: 'wild-orange',
    name: 'Wild Orange',
    category: 'citrus',
    benefits: ['気分向上', 'ストレス軽減', 'エネルギー増強'],
    symptoms: ['ストレス', '不安', '疲労感'],
    aroma: '甘くフレッシュなオレンジの香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '光毒性あり。塗布後12時間は直射日光を避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'ワイルドオレンジは心を明るくし、前向きな気持ちにします。'
  },
  {
    id: 'grapefruit',
    name: 'Grapefruit',
    category: 'citrus',
    benefits: ['代謝促進', '気分向上', 'デトックス'],
    symptoms: ['むくみ', '代謝低下', '気分の落ち込み'],
    aroma: 'さっぱりとしたグレープフルーツの香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '光毒性あり。塗布後12時間は直射日光を避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'グレープフルーツオイルは代謝をサポートし、すっきりとした気分にします。'
  },
  {
    id: 'tangerine',
    name: 'Tangerine',
    category: 'citrus',
    benefits: ['リラックス', '安眠', '気分安定'],
    symptoms: ['不眠', '不安', 'イライラ'],
    aroma: '甘くて優しいタンジェリンの香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '光毒性あり。塗布後12時間は直射日光を避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'タンジェリンオイルは穏やかでリラックス効果があります。'
  },
  {
    id: 'bergamot',
    name: 'Bergamot',
    category: 'citrus',
    benefits: ['ストレス軽減', '気分向上', 'リラックス'],
    symptoms: ['ストレス', '不安', '緊張'],
    aroma: '上品で複雑な柑橘の香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '光毒性あり。塗布後12時間は直射日光を避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'ベルガモットオイルは心を落ち着かせ、バランスを整えます。'
  },
  {
    id: 'lime',
    name: 'Lime',
    category: 'citrus',
    benefits: ['浄化', 'エネルギー向上', '集中力アップ'],
    symptoms: ['疲労', '集中力低下', '気分の落ち込み'],
    aroma: 'シャープで爽やかなライムの香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '光毒性あり。塗布後12時間は直射日光を避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'ライムオイルは心をクリアにし、活力を与えます。'
  },

  // フローラル・樹木系
  {
    id: 'lavender',
    name: 'Lavender',
    category: 'floral',
    benefits: ['リラックス', '安眠', '肌の鎮静'],
    symptoms: ['不眠', 'ストレス', '肌荒れ', '緊張'],
    aroma: '優雅で穏やかなラベンダーの香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '一般的に安全。敏感肌の方は希釈して使用'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ラベンダーオイルは最も汎用性が高く、リラックス効果に優れています。'
  },
  {
    id: 'roman-chamomile',
    name: 'Roman Chamomile',
    category: 'floral',
    benefits: ['鎮静', '安眠', '肌の保護'],
    symptoms: ['不眠', 'イライラ', '肌の炎症'],
    aroma: '甘くて優しいカモミールの香り',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中は使用を避ける。キク科アレルギーの方は注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ローマンカモミールオイルは穏やかで、特に子供に適しています。'
  },
  {
    id: 'ylang-ylang',
    name: 'Ylang Ylang',
    category: 'floral',
    benefits: ['リラックス', '気分向上', 'ホルモンバランス'],
    symptoms: ['ストレス', 'PMS', '緊張'],
    aroma: '甘くてエキゾチックな花の香り',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '子供への使用は避ける。濃度が高いと頭痛を起こす場合がある'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'イランイランオイルは心を落ち着かせ、女性のバランスをサポートします。'
  },
  {
    id: 'geranium',
    name: 'Geranium',
    category: 'floral',
    benefits: ['ホルモンバランス', '肌の健康', '気分安定'],
    symptoms: ['PMS', '肌トラブル', '情緒不安定'],
    aroma: 'ローズに似た甘い花の香り',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中は使用を避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ゼラニウムオイルは女性の健康をサポートし、肌を美しく保ちます。'
  },
  {
    id: 'tea-tree',
    name: 'Tea Tree',
    category: 'floral',
    benefits: ['抗菌', '免疫サポート', '肌の浄化'],
    symptoms: ['ニキビ', '免疫力低下', '感染症'],
    aroma: 'フレッシュで薬草のような香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '原液での使用は避ける。希釈して使用'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ティーツリーオイルは強力な抗菌作用があり、肌トラブルに効果的です。'
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    category: 'floral',
    benefits: ['呼吸器サポート', '清涼感', '集中力向上'],
    symptoms: ['鼻づまり', '咳', '疲労感'],
    aroma: 'クリアで爽快なユーカリの香り',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '3歳未満の子供には使用しない'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ユーカリオイルは呼吸を楽にし、頭をクリアにします。'
  },
  {
    id: 'cedarwood',
    name: 'Cedarwood',
    category: 'floral',
    benefits: ['安眠', 'リラックス', '集中力向上'],
    symptoms: ['不眠', 'ADHD', 'ストレス'],
    aroma: '温かく木質の香り',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中は使用を避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'シダーウッドオイルは心を落ち着かせ、深い眠りをサポートします。'
  },
  {
    id: 'frankincense',
    name: 'Frankincense',
    category: 'floral',
    benefits: ['アンチエイジング', '瞑想', '細胞再生'],
    symptoms: ['肌の老化', 'ストレス', '傷跡'],
    aroma: '神聖で深みのある香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '一般的に安全。最高品質のオイル'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'フランキンセンスオイルは「オイルの王様」と呼ばれ、多くの用途があります。'
  },

  // ハーブ・スパイス系
  {
    id: 'peppermint',
    name: 'Peppermint',
    category: 'herbal',
    benefits: ['消化サポート', '清涼感', '頭痛軽減'],
    symptoms: ['頭痛', '消化不良', '疲労感'],
    aroma: 'クールで爽快なミントの香り',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '妊娠中・授乳中・6歳未満は使用禁止'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'ペパーミントオイルは爽快感があり、様々な不調をサポートします。'
  },
  {
    id: 'oregano',
    name: 'Oregano',
    category: 'herbal',
    benefits: ['免疫サポート', '抗菌', '抗酸化'],
    symptoms: ['免疫力低下', '感染症', '炎症'],
    aroma: '強くスパイシーなハーブの香り',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '妊娠中・授乳中・子供は使用禁止。刺激が強い'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'オレガノオイルは強力な抗菌作用があり、免疫システムをサポートします。'
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    category: 'herbal',
    benefits: ['記憶力向上', '集中力アップ', '血行促進'],
    symptoms: ['記憶力低下', '集中力不足', '血行不良'],
    aroma: 'フレッシュで刺激的なハーブの香り',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中・てんかんの方は使用を避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ローズマリーオイルは記憶力と集中力を高めます。'
  },
  {
    id: 'basil',
    name: 'Basil',
    category: 'herbal',
    benefits: ['ストレス軽減', '集中力向上', '筋肉の緊張緩和'],
    symptoms: ['ストレス', '筋肉痛', '疲労感'],
    aroma: '甘くスパイシーなバジルの香り',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中は使用を避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'バジルオイルは心と体をリフレッシュし、ストレスを軽減します。'
  },
  {
    id: 'thyme',
    name: 'Thyme',
    category: 'herbal',
    benefits: ['免疫サポート', '抗菌', '呼吸器サポート'],
    symptoms: ['免疫力低下', '呼吸器の不調', '感染症'],
    aroma: '温かくスパイシーなハーブの香り',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '妊娠中・子供は使用禁止。刺激が強い'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'タイムオイルは強力な抗菌作用があり、免疫システムを強化します。'
  },
  {
    id: 'clove',
    name: 'Clove',
    category: 'herbal',
    benefits: ['抗菌', '鎮痛', '免疫サポート'],
    symptoms: ['歯痛', '感染症', '免疫力低下'],
    aroma: '温かくスパイシーなクローブの香り',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '妊娠中・子供は使用禁止。非常に刺激が強い'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'クローブオイルは強力な鎮痛・抗菌作用があります。'
  },

  // ブレンド
  {
    id: 'on-guard',
    name: 'On Guard',
    category: 'blend',
    benefits: ['免疫サポート', '抗菌', '浄化'],
    symptoms: ['免疫力低下', '感染症予防', '風邪の初期症状'],
    aroma: 'スパイシーで温かい香り',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中は使用を避ける。希釈して使用'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'オンガードは免疫システムをサポートする保護ブレンドです。'
  },
  {
    id: 'breathe',
    name: 'Breathe',
    category: 'blend',
    benefits: ['呼吸器サポート', '清涼感', 'リフレッシュ'],
    symptoms: ['鼻づまり', '咳', '呼吸困難'],
    aroma: 'クリアで爽快な香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '一般的に安全。希釈して使用'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ブリーズは呼吸を楽にし、すっきりとした気分にします。'
  },
  {
    id: 'digestzen',
    name: 'DigestZen',
    category: 'blend',
    benefits: ['消化サポート', '胃腸の健康', '吐き気軽減'],
    symptoms: ['消化不良', '胃もたれ', '吐き気'],
    aroma: '甘くスパイシーな香り',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中は使用を避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'ダイジェストゼンは消化システムをサポートする消化ブレンドです。'
  },
  {
    id: 'deep-blue',
    name: 'Deep Blue',
    category: 'blend',
    benefits: ['筋肉痛軽減', '炎症軽減', '痛み軽減'],
    symptoms: ['筋肉痛', '関節痛', '炎症'],
    aroma: 'クールで爽快な香り',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '妊娠中・子供は使用禁止。外用のみ'
    },
    usage: ['局所塗布'],
    description: 'ディープブルーは筋肉や関節の不快感を和らげる鎮静ブレンドです。'
  },
  {
    id: 'balance',
    name: 'Balance',
    category: 'blend',
    benefits: ['グラウンディング', 'リラックス', '安定感'],
    symptoms: ['不安', 'ストレス', '不安定感'],
    aroma: '木質でアーシーな香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '一般的に安全'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'バランスは心の安定をもたらすグラウンディングブレンドです。'
  },

  // 人気単品
  {
    id: 'copaiba',
    name: 'Copaiba',
    category: 'popular',
    benefits: ['炎症軽減', 'リラックス', '痛み軽減'],
    symptoms: ['炎症', '痛み', 'ストレス'],
    aroma: '甘く木質の香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '一般的に安全'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'コパイバオイルは天然のカンナビノイドを含み、炎症をサポートします。'
  },
  {
    id: 'wintergreen',
    name: 'Wintergreen',
    category: 'popular',
    benefits: ['筋肉痛軽減', '痛み軽減', '炎症軽減'],
    symptoms: ['筋肉痛', '関節痛', '頭痛'],
    aroma: 'ミントに似た爽快な香り',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '妊娠中・子供・血液凝固阻害剤服用者は使用禁止'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ウィンターグリーンオイルは自然の鎮痛作用があります。'
  },
  {
    id: 'cypress',
    name: 'Cypress',
    category: 'popular',
    benefits: ['血行促進', 'むくみ軽減', 'リフレッシュ'],
    symptoms: ['むくみ', '血行不良', '疲労感'],
    aroma: 'フレッシュで木質の香り',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '一般的に安全'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'サイプレスオイルは循環をサポートし、すっきりとした気分にします。'
  },
  {
    id: 'marjoram',
    name: 'Marjoram',
    category: 'popular',
    benefits: ['筋肉の緊張緩和', '安眠', 'リラックス'],
    symptoms: ['筋肉の緊張', '不眠', 'ストレス'],
    aroma: '温かく甘いハーブの香り',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中は使用を避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'マジョラムオイルは筋肉を和らげ、深いリラックスをもたらします。'
  }
];