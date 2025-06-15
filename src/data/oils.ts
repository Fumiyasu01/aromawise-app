import { Oil } from '../types/Oil';

export const oilsData: Oil[] = [
  // 柑橘系オイル
  {
    id: 'lemon',
    name: 'Lemon',
    category: 'citrus',
    benefits: ['消化促進', 'デトックス効果', '空気清浄', '気分向上', '免疫サポート'],
    symptoms: ['消化不良', '疲労感', '集中力不足', '気分の落ち込み'],
    aroma: '爽快感、エネルギッシュ、前向き、集中力向上',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '局所使用後12時間は日光・紫外線を避ける。適切に希釈すれば犬猫共に使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポート、抗酸化作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'wild-orange',
    name: 'Wild Orange',
    category: 'citrus',
    benefits: ['気分向上', 'エネルギー増進', '抗酸化作用', '免疫サポート'],
    symptoms: ['気分の落ち込み', '不安', '疲労感', '集中力不足'],
    aroma: '幸福感、活力、前向き、楽観的',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '敏感肌への使用時は希釈推奨。適切に希釈すれば犬に使用可能、猫は注意'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '気分向上、抗酸化作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'grapefruit',
    name: 'Grapefruit',
    category: 'citrus',
    benefits: ['気分向上', 'デトックス効果', '代謝サポート', '食欲調整'],
    symptoms: ['疲労感', '食欲不振', '気分の落ち込み', 'むくみ'],
    aroma: '明るい、楽観的、活力的',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '局所使用後12時間は日光・紫外線を避ける。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '代謝サポート、抗酸化作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'tangerine',
    name: 'Tangerine',
    category: 'citrus',
    benefits: ['鎮静作用', '睡眠促進', '気分向上', 'リラクゼーション'],
    symptoms: ['不安', 'イライラ', '不眠', '緊張'],
    aroma: '穏やか、幸福感、安らぎ',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '局所使用後12時間は日光を避ける。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '鎮静作用、睡眠改善の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'bergamot',
    name: 'Bergamot',
    category: 'citrus',
    benefits: ['リラクゼーション', '気分向上', '自信向上', 'ストレス軽減'],
    symptoms: ['不安', 'ストレス', '気分の落ち込み', '緊張'],
    aroma: '穏やか、自信、楽観的、バランス',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '最強の光毒性、局所使用後18時間は日光・紫外線を避ける。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '不安軽減、ストレス管理の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'lime',
    name: 'Lime',
    category: 'citrus',
    benefits: ['気分向上', '集中力向上', '空気清浄', '免疫サポート'],
    symptoms: ['疲労感', '集中力不足', '気分の落ち込み'],
    aroma: '爽快感、リフレッシュ、活力的',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '圧搾法の場合は光毒性あり、局所使用後12時間は日光を避ける。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '抗酸化作用、気分向上の研究あり（医療行為を推奨するものではありません）'
  },

  // フローラル・樹木系
  {
    id: 'lavender',
    name: 'Lavender',
    category: 'floral',
    benefits: ['リラクゼーション', '睡眠促進', '肌の鎮静', '精神的な安定', 'ストレス軽減'],
    symptoms: ['不安', '不眠', '肌の炎症', '軽度の皮膚刺激', '緊張'],
    aroma: '心を落ち着かせる、穏やか、リラックス、自己認識の向上',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '敏感肌への使用時は希釈必須、内服前に医師相談。猫への使用は避ける、犬は適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '睡眠の質改善、不安軽減に関する研究あり（医療行為を推奨するものではありません）'
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
    benefits: ['消化促進', '呼吸機能サポート', '冷却効果', '集中力向上', 'エネルギー増進'],
    symptoms: ['消化不良', '頭痛', '筋肉痛', '鼻づまり', '疲労感', '吐き気'],
    aroma: '活力的、集中力向上、リフレッシュ、目覚め',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '6歳以下の使用不可。第2・3トリメスターで使用可、授乳中は避ける。高濃度メントール含有のため希釈必須、目や粘膜への接触避ける。猫への使用は避ける、犬への使用も注意が必要'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポート、呼吸機能改善の研究あり（医療行為を推奨するものではありません）'
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
    benefits: ['記憶力向上', '集中力向上', '育毛促進', '血行促進', '筋肉弛緩'],
    symptoms: ['記憶力低下', '集中力不足', '抜け毛', '低血圧', '筋肉痛'],
    aroma: '明晰、集中、活力、記憶',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下使用不可。第2・3トリメスターで使用可、高血圧の方は注意。てんかん、高血圧の方は注意。適切に希釈すれば犬に使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '記憶力向上、育毛効果の研究あり（医療行為を推奨するものではありません）'
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
    benefits: ['抗菌作用', '免疫サポート', '呼吸器サポート', '抗炎症作用'],
    symptoms: ['呼吸器感染', '疲労感', '関節炎', '免疫力低下'],
    aroma: '勇気、力強さ、浄化',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6歳以下使用不可。妊娠中は使用禁止。ホットオイル、高血圧の方は注意。使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '抗菌作用、呼吸器サポートの研究あり（医療行為を推奨するものではありません）'
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
    benefits: ['免疫システムサポート', '抗酸化作用', '表面クリーニング', '保護効果'],
    symptoms: ['免疫力低下', '季節の変わり目の不調', '環境的脅威'],
    aroma: '活力的、守られている感覚、エネルギッシュ',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下の内服は避ける、局所使用は適切に希釈。第2・3トリメスターで適度に使用、シナモンとクローブ含有のため注意。希釈せずに使用すると皮膚刺激の可能性、高濃度で使用注意。猫への使用は避ける、犬は適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '免疫機能サポート、抗菌・抗ウイルス作用の研究あり（医療行為を推奨するものではありません）。成分：ワイルドオレンジ、クローブ、シナモンバーク、ユーカリ、ローズマリー'
  },
  {
    id: 'breathe',
    name: 'Breathe',
    category: 'blend',
    benefits: ['気道のクリア感', '呼吸のしやすさ', '季節的脅威への対処', '安眠促進'],
    symptoms: ['呼吸器の不調', '鼻づまり', '季節的な呼吸の問題', '睡眠時の呼吸困難'],
    aroma: '安らぎ、清々しさ、リフレッシュ、落ち着き',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: 'レモン含有のため局所使用後12時間は日光を避ける。ユーカリ・ティーツリー含有のため猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '呼吸機能サポート、気道の健やかさに関する研究あり（医療行為を推奨するものではありません）。成分：ローレルリーフ、ペパーミント、ユーカリ、ティーツリー、レモン、カルダモン、ラビンツァラ、ラベンサラ'
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
    benefits: ['筋肉弛緩', '血圧調整', '鎮静作用', '感情サポート'],
    symptoms: ['筋肉痛', '関節痛', '高血圧', '不眠', '悲しみ'],
    aroma: '慰め、受容、信頼、安心',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '低血圧の方は注意。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '筋肉弛緩、血圧調整の研究あり（医療行為を推奨するものではありません）'
  },

  // 追加の柑橘系オイル
  {
    id: 'green-mandarin',
    name: 'Green Mandarin',
    category: 'citrus',
    benefits: ['消化促進', '神経系サポート', '鎮静作用'],
    symptoms: ['消化不良', '神経過敏', '不安'],
    aroma: '穏やか、安心感、リフレッシュ',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '敏感肌への使用時は希釈推奨。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'clementine',
    name: 'Clementine',
    category: 'citrus',
    benefits: ['気分向上', 'エネルギー増進', '免疫サポート'],
    symptoms: ['気分の落ち込み', 'ストレス', '疲労感'],
    aroma: '明るい、楽しい、前向き',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '敏感肌への使用時は希釈推奨。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '気分向上の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'yuzu',
    name: 'Yuzu',
    category: 'citrus',
    benefits: ['リラクゼーション', '気分向上', '集中力向上', '免疫サポート'],
    symptoms: ['ストレス', '緊張', '疲労感', '不安'],
    aroma: '爽やか、穏やか、集中',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '敏感肌への使用時は希釈推奨。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },

  // 追加のフローラル系オイル
  {
    id: 'rose',
    name: 'Rose',
    category: 'floral',
    benefits: ['肌の若返り', '感情的な癒し', '自己愛の向上', 'ホルモンバランス'],
    symptoms: ['肌の老化', '感情的な傷', '悲しみ', '自己価値の低下'],
    aroma: '愛情深い、優雅、自信、女性性',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '非常に高価、希釈必須。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'スキンケア効果、感情サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'ylang-ylang',
    name: 'Ylang Ylang',
    category: 'floral',
    benefits: ['リラクゼーション', '血圧調整', '性欲向上', '感情バランス'],
    symptoms: ['不安', '高血圧', '性的な問題', '怒り'],
    aroma: 'ロマンチック、穏やか、喜び、自信',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '強い香りのため使いすぎ注意、頭痛を引き起こす可能性。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '血圧調整、リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    category: 'floral',
    benefits: ['気分向上', '自信向上', '性欲向上', '肌の改善'],
    symptoms: ['うつ', '不安', '性的な問題', '肌の問題'],
    aroma: '幸福感、ロマンチック、自信、官能的',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '妊娠中使用禁止（子宮収縮を促す可能性）、非常に高価。使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '気分向上、スキンケア効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'geranium',
    name: 'Geranium',
    category: 'floral',
    benefits: ['ホルモンバランス調整', '肌の改善', '感情バランス', '虫除け'],
    symptoms: ['ホルモンバランスの乱れ', '月経不順', '肌の問題', '不安'],
    aroma: 'バランス、穏やか、女性的、調和',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '敏感肌への使用時は希釈推奨。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ホルモンバランス、スキンケア効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'roman-chamomile',
    name: 'Roman Chamomile',
    category: 'floral',
    benefits: ['鎮静作用', '睡眠促進', '肌の鎮静', '感情の安定'],
    symptoms: ['不眠', '不安', '怒り', '肌の炎症', '子供の不調'],
    aroma: '穏やか、平和、忍耐、安らぎ',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし、非常に穏やか。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '睡眠改善、鎮静効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'neroli',
    name: 'Neroli',
    category: 'floral',
    benefits: ['抗うつ作用', '肌の再生', 'リラクゼーション', '消化促進'],
    symptoms: ['不安', 'うつ', '不眠', '肌の老化'],
    aroma: '幸福感、平和、自信、純粋',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '高価なオイル。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '抗うつ効果、スキンケア効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'osmanthus',
    name: 'Osmanthus',
    category: 'floral',
    benefits: ['リラクゼーション', '気分向上', '瞑想サポート'],
    symptoms: ['ストレス', '不安', '悲しみ'],
    aroma: '穏やか、瞑想的、甘美',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '非常に高価。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },

  // 追加のフローラル系オイル（続き）
  {
    id: 'cananga',
    name: 'Cananga',
    category: 'floral',
    benefits: ['リラクゼーション', '血圧調整', '気分向上'],
    symptoms: ['不安', 'ストレス', '高血圧'],
    aroma: '穏やか、バランス、喜び',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: 'イランイランの近縁種。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'helichrysum',
    name: 'Helichrysum',
    category: 'floral',
    benefits: ['組織再生', '抗炎症作用', '鎮痛作用', '感情的な癒し'],
    symptoms: ['打撲', '傷跡', '関節炎', '感情的なトラウマ'],
    aroma: '癒し、解放、勇気、再生',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '非常に高価、抗凝固薬使用者は注意。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '組織再生、抗炎症作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'blue-tansy',
    name: 'Blue Tansy',
    category: 'floral',
    benefits: ['抗アレルギー作用', '肌の鎮静', '感情の鎮静', '抗炎症作用'],
    symptoms: ['アレルギー', '肌の炎症', '不安', '怒り'],
    aroma: '落ち着き、自制心、平和',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下使用不可。青色のオイル、衣服に付着注意。使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '抗アレルギー、抗炎症作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'palmarosa',
    name: 'Palmarosa',
    category: 'floral',
    benefits: ['肌の保湿', '抗菌作用', '消化促進', '細胞再生'],
    symptoms: ['肌の乾燥', '感染症', '消化不良'],
    aroma: 'リフレッシュ、バランス、適応',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '抗菌作用、スキンケア効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'magnolia',
    name: 'Magnolia',
    category: 'floral',
    benefits: ['リラクゼーション', 'ホルモンバランス', '気分向上'],
    symptoms: ['不安', '緊張', '月経前症候群'],
    aroma: '穏やか、女性的、優雅',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '高価なオイル。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'lavender-mint',
    name: 'Lavender Mint',
    category: 'floral',
    benefits: ['頭痛緩和', '集中力向上', 'リラクゼーション'],
    symptoms: ['頭痛', '緊張', '集中力不足'],
    aroma: '集中、リラックス、クリア',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '6歳以下使用不可。ペパーミント含有のため年齢制限あり。猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '頭痛緩和の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'petitgrain',
    name: 'Petitgrain',
    category: 'floral',
    benefits: ['リラクゼーション', '睡眠促進', '筋肉弛緩', '抗うつ作用'],
    symptoms: ['不安', '不眠', 'ストレス', '筋肉の緊張'],
    aroma: '穏やか、バランス、自信',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '睡眠改善、リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },

  // 追加のハーブ系オイル
  {
    id: 'spearmint',
    name: 'Spearmint',
    category: 'herbal',
    benefits: ['消化促進', '気分向上', '集中力向上', '冷却効果'],
    symptoms: ['消化不良', '吐き気', '集中力不足', '疲労感'],
    aroma: 'リフレッシュ、明晰、楽観的',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: 'ペパーミントより穏やか。適切に希釈すれば犬に使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'basil',
    name: 'Basil',
    category: 'herbal',
    benefits: ['筋肉弛緩', '頭痛緩和', '集中力向上', '抗炎症作用'],
    symptoms: ['筋肉痛', '頭痛', '疲労感', '集中力不足'],
    aroma: '集中、活力、明晰',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '2歳以下使用不可。妊娠中使用禁止、希釈必須。使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '筋肉痛緩和、集中力向上の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'oregano',
    name: 'Oregano',
    category: 'herbal',
    benefits: ['強力な抗菌作用', '免疫サポート', '抗真菌作用', '抗ウイルス作用'],
    symptoms: ['感染症', '免疫力低下', '消化器の問題', '真菌感染'],
    aroma: '保護的、強力、浄化',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '12歳未満使用禁止。妊娠中・授乳中は使用禁止。ホットオイル、大幅希釈必須、粘膜への接触避ける。使用禁止'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '抗菌・抗ウイルス作用の研究あり（医療行為を推奨するものではありません）'
  },

  // 追加のハーブ系オイル（続き）
  {
    id: 'citronella',
    name: 'Citronella',
    category: 'herbal',
    benefits: ['虫除け効果', '抗真菌作用', '消臭効果', '筋肉弛緩'],
    symptoms: ['虫刺され', '筋肉痛', '疲労感'],
    aroma: 'リフレッシュ、保護的',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '皮膚刺激の可能性。適切に希釈すれば犬に使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '虫除け効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'coriander',
    name: 'Coriander',
    category: 'herbal',
    benefits: ['消化促進', '抗炎症作用', '循環促進'],
    symptoms: ['消化不良', '筋肉痛', '関節炎'],
    aroma: '活力、創造性',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポートの研究あり（医療行為を推奨するものではありません）'
  },

  // ウッディ系オイル
  {
    id: 'frankincense',
    name: 'Frankincense',
    category: 'floral',
    benefits: ['抗炎症作用', '免疫サポート', '細胞再生', '瞑想促進', '精神的な向上'],
    symptoms: ['不安', '炎症', '肌の老化', '免疫力低下', '瞑想困難'],
    aroma: '神聖、瞑想的、平和、精神性',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし、非常に安全。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '抗炎症作用、免疫サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'sandalwood',
    name: 'Sandalwood',
    category: 'popular',
    benefits: ['深いリラクゼーション', '瞑想促進', '肌の保湿', '性欲向上'],
    symptoms: ['不安', '不眠', '肌の乾燥', '性的な問題'],
    aroma: '瞑想的、グラウンディング、官能的、神聖',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '高価なオイル。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'リラクゼーション効果、スキンケア効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'cedarwood',
    name: 'Cedarwood',
    category: 'floral',
    benefits: ['鎮静作用', '集中力向上', '呼吸器サポート', '育毛促進'],
    symptoms: ['不眠', '不安', '注意欠陥', '呼吸器の問題', '抜け毛'],
    aroma: 'グラウンディング、安定、集中、強さ',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '妊娠中使用禁止。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ADD/ADHD改善、育毛効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'black-spruce',
    name: 'Black Spruce',
    category: 'popular',
    benefits: ['副腎サポート', '呼吸器サポート', '筋肉弛緩', 'グラウンディング'],
    symptoms: ['疲労感', 'ストレス', '呼吸器の問題', '筋肉痛'],
    aroma: '安定、強さ、バランス、活力',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '副腎サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'douglas-fir',
    name: 'Douglas Fir',
    category: 'popular',
    benefits: ['呼吸器サポート', '空気清浄', '筋肉弛緩', '気分向上'],
    symptoms: ['呼吸器の問題', '筋肉の緊張', 'ネガティブな感情'],
    aroma: '新鮮、クリア、前向き、浄化',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '呼吸器サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'balsam-fir',
    name: 'Balsam Fir',
    category: 'popular',
    benefits: ['呼吸器サポート', '抗炎症作用', 'エネルギー向上', 'グラウンディング'],
    symptoms: ['呼吸器の問題', '筋肉痛', '関節痛', '疲労感'],
    aroma: 'リフレッシュ、エネルギッシュ、グラウンディング',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '呼吸器サポート、抗炎症作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'cypress',
    name: 'Cypress',
    category: 'popular',
    benefits: ['循環促進', '収斂作用', '感情バランス', 'リンパドレナージ'],
    symptoms: ['静脈瘤', 'むくみ', '過度の発汗', '感情的な変化'],
    aroma: '安定、流れ、変化への適応',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '循環改善の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'juniper-berry',
    name: 'Juniper Berry',
    category: 'popular',
    benefits: ['利尿作用', 'デトックス効果', '腎臓サポート', '抗菌作用'],
    symptoms: ['むくみ', '関節炎', '腎臓の問題', '肌の問題'],
    aroma: '浄化、保護、クリア',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下使用不可。腎臓疾患の方は注意。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'デトックス効果、腎機能サポートの研究あり（医療行為を推奨するものではありません）'
  },

  // 追加のハーブ系オイル（続き2）
  {
    id: 'cilantro',
    name: 'Cilantro',
    category: 'herbal',
    benefits: ['消化促進', 'デトックス効果', '抗酸化作用', '消臭効果'],
    symptoms: ['消化不良', '重金属の蓄積', '体臭'],
    aroma: 'クリーン、リフレッシュ、浄化',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'デトックス効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'parsley',
    name: 'Parsley',
    category: 'herbal',
    benefits: ['消化促進', '利尿作用', '口臭予防', '抗酸化作用'],
    symptoms: ['消化不良', 'むくみ', '口臭'],
    aroma: 'クリーン、フレッシュ、浄化',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下使用不可。腎臓疾患の方は注意。使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'melissa',
    name: 'Melissa',
    category: 'herbal',
    benefits: ['強力な鎮静作用', '抗ウイルス作用', '気分向上', '免疫サポート'],
    symptoms: ['不安', '不眠', 'ヘルペス', '緊張性頭痛'],
    aroma: '喜び、光、希望、安らぎ',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '非常に高価、皮膚刺激の可能性。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '抗ウイルス作用、鎮静効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'clary-sage',
    name: 'Clary Sage',
    category: 'herbal',
    benefits: ['ホルモンバランス調整', '鎮静作用', '陶酔感', '月経促進'],
    symptoms: ['月経不順', '更年期症状', 'ストレス', '不眠'],
    aroma: '陶酔感、明晰、女性的、バランス',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '使用不可。妊娠中は使用禁止（子宮収縮を促す可能性）。アルコール摂取時は使用避ける、運転前の使用注意。使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ホルモンバランス調整の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'lemongrass',
    name: 'Lemongrass',
    category: 'herbal',
    benefits: ['筋肉弛緩', '消化促進', '虫除け効果', '抗真菌作用'],
    symptoms: ['筋肉痛', '消化不良', '頭痛', '虫刺され'],
    aroma: 'エネルギッシュ、クリア、前向き',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '2歳以下使用不可。妊娠中は使用禁止。皮膚刺激の可能性、希釈必須。猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '抗真菌作用、虫除け効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'fennel',
    name: 'Fennel',
    category: 'herbal',
    benefits: ['消化促進', 'ホルモンバランス', '授乳促進', '利尿作用'],
    symptoms: ['消化不良', '月経不順', '授乳量不足', 'むくみ'],
    aroma: '自信、勇気、モチベーション',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6歳以下使用不可。妊娠中は使用禁止（エストロゲン様作用）。てんかん、エストロゲン依存性疾患の方は使用避ける。使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポート、ホルモンバランスの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'dill',
    name: 'Dill',
    category: 'herbal',
    benefits: ['消化促進', '鎮痙作用', '抗菌作用'],
    symptoms: ['消化不良', 'ガス', 'しゃっくり'],
    aroma: 'リフレッシュ、軽やか',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポートの研究あり（医療行為を推奨するものではありません）'
  },

  // ウッディ系オイル（追加）
  {
    id: 'arborvitae',
    name: 'Arborvitae',
    category: 'popular',
    benefits: ['抗真菌作用', '虫除け効果', 'グラウンディング', '保護効果'],
    symptoms: ['真菌感染', '虫刺され', '感情的なブロック'],
    aroma: '保護的、グラウンディング、神聖',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '6歳以下使用不可。内服は避ける。使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '抗真菌作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'ho-wood',
    name: 'Ho Wood',
    category: 'popular',
    benefits: ['リラクゼーション', '抗菌作用', '肌の再生', '免疫サポート'],
    symptoms: ['不安', '不眠', '肌の問題', '感染症'],
    aroma: '穏やか、平和、リラックス',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '抗菌作用、リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'siam-wood',
    name: 'Siam Wood',
    category: 'popular',
    benefits: ['リラクゼーション', 'グラウンディング', '瞑想促進'],
    symptoms: ['ストレス', '不安', '睡眠障害'],
    aroma: '瞑想的、グラウンディング、平和',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'niau-wood',
    name: 'Niau Wood',
    category: 'popular',
    benefits: ['リラクゼーション', 'グラウンディング', '感情バランス'],
    symptoms: ['ストレス', '緊張', '不安'],
    aroma: '穏やか、安定、グラウンディング',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'buddha-wood',
    name: 'Buddha Wood',
    category: 'popular',
    benefits: ['瞑想促進', '精神的な明晰さ', 'グラウンディング'],
    symptoms: ['不安', '瞑想困難', '感情的な不安定'],
    aroma: '瞑想的、精神的、平和、明晰',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '瞑想促進効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'hinoki',
    name: 'Hinoki',
    category: 'popular',
    benefits: ['リラクゼーション', '呼吸器サポート', '抗炎症作用', '森林浴効果'],
    symptoms: ['ストレス', '不眠', '呼吸器の問題', '肌の炎症'],
    aroma: '穏やか、リフレッシュ、日本的な静寂',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '森林浴効果、リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'petitgrain',
    name: 'Petitgrain',
    category: 'popular',
    benefits: ['リラクゼーション', '睡眠促進', '筋肉弛緩', '抗うつ作用'],
    symptoms: ['不安', '不眠', 'ストレス', '筋肉の緊張'],
    aroma: '穏やか、バランス、自信',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '特になし。適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '睡眠改善、リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },

  // スパイス系オイル
  {
    id: 'cinnamon-bark',
    name: 'Cinnamon Bark',
    category: 'herbal',
    benefits: ['消化促進', '血糖値サポート', '抗菌作用', '性欲向上'],
    symptoms: ['消化不良', '血糖値の問題', '感染症', '性欲減退'],
    aroma: '温かい、情熱的、活力的',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '6歳以下使用不可。ホットオイル、大幅希釈必須、粘膜への接触避ける。使用禁止'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '血糖値管理、抗菌作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'cassia',
    name: 'Cassia',
    category: 'herbal',
    benefits: ['消化促進', '血糖値サポート', '抗炎症作用', '温熱効果'],
    symptoms: ['消化不良', '血糖値の問題', '関節炎'],
    aroma: '勇気、温かさ、活力',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '12歳未満使用禁止。妊娠中は使用禁止。最もホットなオイルの一つ、極度の希釈必須。使用禁止'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '血糖値管理の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'clove',
    name: 'Clove',
    category: 'herbal',
    benefits: ['鎮痛作用', '強力な抗菌作用', '抗真菌作用', '抗酸化作用'],
    symptoms: ['歯痛', '感染症', '真菌感染', '消化不良'],
    aroma: '保護的、温かい、勇気',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '6歳以下使用不可。ホットオイル、大幅希釈必須、抗凝固薬使用者は注意。使用禁止'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '歯科での鎮痛効果、抗菌作用の研究あり（医療行為を推奨するものではありません）'
  },

  // スパイス系（続き）とカンファー系
  {
    id: 'cardamom',
    name: 'Cardamom',
    category: 'herbal',
    benefits: ['消化促進', '呼吸器サポート', '鎮痙作用', '気分向上'],
    symptoms: ['消化不良', '呼吸器の問題', '筋肉のけいれん'],
    aroma: '明晰、リフレッシュ、温かい',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'ginger',
    name: 'Ginger',
    category: 'herbal',
    benefits: ['消化促進', '吐き気軽減', '抗炎症作用', '温熱効果'],
    symptoms: ['吐き気', '消化不良', '関節炎', '乗り物酔い'],
    aroma: 'エネルギッシュ、温かい、勇気',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、敏感肌への使用時は希釈推奨'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '吐き気軽減、消化促進の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'black-pepper',
    name: 'Black Pepper',
    category: 'herbal',
    benefits: ['消化促進', '温熱効果', '抗炎症作用', '禁煙サポート'],
    symptoms: ['消化不良', '筋肉痛', '関節炎', '禁煙サポート'],
    aroma: '活力的、温かい、刺激的',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下使用不可、皮膚刺激の可能性、使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化促進、禁煙サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'pink-pepper',
    name: 'Pink Pepper',
    category: 'herbal',
    benefits: ['消化促進', '気分向上', 'リラクゼーション'],
    symptoms: ['消化不良', '不安', '感情的な緊張'],
    aroma: '軽やか、楽観的、バランス',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化促進効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'coriander',
    name: 'Coriander',
    category: 'herbal',
    benefits: ['消化促進', '抗炎症作用', '循環促進'],
    symptoms: ['消化不良', '筋肉痛', '関節炎'],
    aroma: '活力、創造性',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    category: 'herbal',
    benefits: ['呼吸器サポート', '去痰作用', '抗炎症作用', '集中力向上'],
    symptoms: ['呼吸器の問題', '鼻づまり', '筋肉痛', '集中力不足'],
    aroma: 'クリア、リフレッシュ、集中',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '2歳以下使用不可、妊娠中は使用禁止、てんかんの方は注意、猫には有毒'
    },
    usage: ['アロマ', '局所塗布'],
    description: '呼吸器サポート、抗炎症作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'tea-tree',
    name: 'Tea Tree/Melaleuca',
    category: 'herbal',
    benefits: ['強力な抗菌作用', '抗真菌作用', '抗ウイルス作用', '免疫サポート'],
    symptoms: ['にきび', '真菌感染', '傷', '虫刺され', 'フケ'],
    aroma: '浄化、クリーン、保護的',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、猫には有毒'
    },
    usage: ['アロマ', '局所塗布'],
    description: '抗菌・抗真菌作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'cajeput',
    name: 'Cajeput',
    category: 'herbal',
    benefits: ['呼吸器サポート', '鎮痛作用', '抗炎症作用'],
    symptoms: ['呼吸器の問題', '筋肉痛', '関節痛'],
    aroma: 'クリア、活力的',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下使用不可、皮膚刺激の可能性、猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '呼吸器サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'niaouli',
    name: 'Niaouli',
    category: 'herbal',
    benefits: ['呼吸器サポート', '抗アレルギー作用', '免疫サポート'],
    symptoms: ['呼吸器感染', 'アレルギー', '筋肉痛'],
    aroma: 'クリア、保護的',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下使用不可、猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '呼吸器サポート、免疫サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'ravintsara',
    name: 'Ravintsara',
    category: 'herbal',
    benefits: ['呼吸器サポート', '抗ウイルス作用', '免疫サポート', 'リラクゼーション'],
    symptoms: ['呼吸器感染', '不眠', '免疫力低下', 'ストレス'],
    aroma: 'クリア、保護的、リラックス',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後3ヶ月以降、非常に穏やか、適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '抗ウイルス作用、免疫サポートの研究あり（医療行為を推奨するものではありません）'
  },

  // カンファー系（続き）とアーシー系
  {
    id: 'ravensara',
    name: 'Ravensara',
    category: 'herbal',
    benefits: ['筋肉弛緩', '抗炎症作用', '呼吸器サポート'],
    symptoms: ['筋肉痛', '関節痛', '呼吸器の問題'],
    aroma: 'リラックス、鎮静',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、ラヴィンツァラと混同しないよう注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: '筋肉弛緩効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'laurel-leaf',
    name: 'Laurel Leaf',
    category: 'herbal',
    benefits: ['呼吸器サポート', '消化促進', 'リンパドレナージ', '抗菌作用'],
    symptoms: ['呼吸器感染', '消化不良', 'リンパの滞り'],
    aroma: '自信、勇気、成功',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下使用不可、皮膚刺激の可能性、使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '呼吸器サポート、抗菌作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'vetiver',
    name: 'Vetiver',
    category: 'herbal',
    benefits: ['深いグラウンディング', '集中力向上', '鎮静作用', 'トラウマケア'],
    symptoms: ['不安', 'ADHD', '不眠', 'トラウマ'],
    aroma: 'グラウンディング、安定、集中、保護',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、粘度が高い、香りが強い'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ADHD改善、トラウマケアの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'patchouli',
    name: 'Patchouli',
    category: 'herbal',
    benefits: ['肌の再生', '抗うつ作用', '性欲向上', 'グラウンディング'],
    symptoms: ['肌の問題', '不安', 'うつ', '性欲減退'],
    aroma: 'グラウンディング、官能的、平和',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、香りが強い、好き嫌いが分かれる'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'スキンケア効果、抗うつ作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'myrrh',
    name: 'Myrrh',
    category: 'herbal',
    benefits: ['組織再生', '抗菌作用', '瞑想促進', '感情的な癒し'],
    symptoms: ['口内炎', '歯肉炎', '傷', '肌の老化', '瞑想困難'],
    aroma: '神聖、瞑想的、平和、精神性',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '2歳以下使用不可、妊娠中は使用禁止、粘度が高い、使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '口腔ケア、組織再生の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'copaiba',
    name: 'Copaiba',
    category: 'herbal',
    benefits: ['強力な抗炎症作用', '鎮痛作用', '神経系サポート', '肌の改善'],
    symptoms: ['慢性痛', '炎症', '不安', '肌の問題'],
    aroma: '穏やか、サポート的、安心',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後3ヶ月以降、非常に穏やか、適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: 'CBD様作用、抗炎症作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'wintergreen',
    name: 'Wintergreen',
    category: 'herbal',
    benefits: ['強力な鎮痛作用', '抗炎症作用', '冷却効果', '筋肉弛緩'],
    symptoms: ['筋肉痛', '関節痛', '頭痛', '炎症'],
    aroma: 'リフレッシュ、鎮静、爽快',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '10歳未満使用禁止、妊娠中・授乳中は使用禁止、高毒性、メチルサリチル酸98%含有、抗凝固薬使用者は禁止、使用禁止、特に猫には致命的'
    },
    usage: ['局所塗布'],
    description: '鎮痛効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    category: 'herbal',
    benefits: ['抗炎症作用', '抗酸化作用', '消化促進', '肝臓サポート'],
    symptoms: ['関節炎', '炎症', '消化不良', '肌の問題'],
    aroma: '温かい、エネルギッシュ、ポジティブ',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、衣服に付着すると黄色く染まる'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '抗炎症作用、抗酸化作用の研究あり（医療行為を推奨するものではありません）'
  },

  // ブレンドオイル
  {
    id: 'on-guard',
    name: 'On Guard',
    category: 'blend',
    benefits: ['免疫システムサポート', '抗酸化作用', '表面クリーニング', '保護効果'],
    symptoms: ['免疫力低下', '季節の変わり目の不調', '環境的脅威'],
    aroma: '活力的、守られている感覚、エネルギッシュ',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '2歳以下の内服は避ける、希釈せずに使用すると皮膚刺激の可能性、猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '免疫機能サポート、抗菌・抗ウイルス作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'breathe',
    name: 'Breathe/Air',
    category: 'blend',
    benefits: ['気道のクリア感', '呼吸のしやすさ', '季節的脅威への対処', '安眠促進'],
    symptoms: ['呼吸器の不調', '鼻づまり', '季節的な呼吸の問題', '睡眠時の呼吸困難'],
    aroma: '安らぎ、清々しさ、リフレッシュ、落ち着き',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後3ヶ月以降、レモン含有のため局所使用後12時間は日光を避ける、猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '呼吸機能サポート、気道の健やかさに関する研究あり（医療行為を推奨するものではありません）'
  },

  // ブレンドオイル（続き）と感情アロマセラピー
  {
    id: 'digestzen',
    name: 'DigestZen/ZenGest',
    category: 'blend',
    benefits: ['消化促進', '胃腸の不快感軽減', '健康的な消化機能サポート'],
    symptoms: ['消化不良', '胃もたれ', '吐き気', 'ガス', '胃痛'],
    aroma: '快適、安心、リラックス',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '6歳以下の内服は避ける、フェンネル含有のためてんかんの方は注意、猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'deep-blue',
    name: 'Deep Blue',
    category: 'blend',
    benefits: ['鎮痛作用', '抗炎症作用', '冷却効果', '筋肉・関節サポート'],
    symptoms: ['筋肉痛', '関節痛', '腰痛', 'スポーツ後の疲労'],
    aroma: '鎮静、リフレッシュ、快適',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '10歳未満使用禁止、妊娠中・授乳中は使用禁止、ウィンターグリーン含有のため高毒性、使用禁止'
    },
    usage: ['局所塗布'],
    description: '鎮痛効果、抗炎症作用の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'aromatouch',
    name: 'AromaTouch',
    category: 'blend',
    benefits: ['筋肉弛緩', 'リラクゼーション', '循環促進', 'マッサージ効果向上'],
    symptoms: ['筋肉の緊張', 'ストレス', '循環不良'],
    aroma: 'リラックス、快適、バランス',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '2歳以下使用不可、バジル含有のため妊娠中は使用禁止、グレープフルーツ含有のため光毒性注意'
    },
    usage: ['局所塗布'],
    description: '筋肉弛緩、リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'balance',
    name: 'Balance',
    category: 'blend',
    benefits: ['グラウンディング', '感情バランス', '鎮静作用', 'センタリング'],
    symptoms: ['不安', 'ストレス', '感情の不安定', 'グラウンディング不足'],
    aroma: '安定、グラウンディング、平和、調和',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後3ヶ月以降、青色のオイル、衣服に付着注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: '感情バランス、グラウンディング効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'serenity',
    name: 'Serenity/Lavender Peace',
    category: 'blend',
    benefits: ['睡眠促進', '深いリラクゼーション', '不安軽減', '心の平穏'],
    symptoms: ['不眠', '不安', 'ストレス', '緊張'],
    aroma: '穏やか、リラックス、安眠、平和',
    safetyInfo: {
      pregnancy: false,
      children: true,
      notes: '生後3ヶ月以降、シダーウッド含有のため妊娠中は避ける、眠気を誘うため運転前の使用注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: '睡眠改善、リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'peace',
    name: 'Peace',
    category: 'blend',
    benefits: ['安心感', '感情の安定', '恐れの解放', '内なる平和'],
    symptoms: ['不安', '恐れ', '心配', '感情的な動揺'],
    aroma: '平和、安心、穏やか、満足',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '2歳以下使用不可、クラリセージ含有のため妊娠中は使用禁止、アルコール摂取時は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '感情サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'motivate',
    name: 'Motivate',
    category: 'blend',
    benefits: ['やる気向上', '自信回復', '集中力向上', '前向きな気持ち'],
    symptoms: ['やる気不足', '倦怠感', '先延ばし', '自信喪失'],
    aroma: 'やる気、自信、勇気、決意',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6歳以下使用不可、バジル含有のため妊娠中は使用禁止、猫への使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '集中力向上の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'cheer',
    name: 'Cheer',
    category: 'blend',
    benefits: ['気分向上', '楽観的な気持ち', '幸福感', '前向きな態度'],
    symptoms: ['気分の落ち込み', '悲しみ', '落胆', 'ネガティブな感情'],
    aroma: '明るい、楽観的、幸福、陽気',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '6歳以下使用不可、ホットオイル含有のため希釈必須、使用は避ける'
    },
    usage: ['アロマ', '局所塗布'],
    description: '気分向上効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'passion',
    name: 'Passion',
    category: 'blend',
    benefits: ['情熱喚起', '親密さ向上', '創造性向上', '感覚的な体験'],
    symptoms: ['情熱の欠如', '関係性の問題', '創造性の低下'],
    aroma: '情熱的、ロマンチック、創造的、官能的',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '使用不可、ジャスミン含有のため妊娠中は使用禁止、使用禁止'
    },
    usage: ['アロマ', '局所塗布'],
    description: '感情サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'console',
    name: 'Console',
    category: 'blend',
    benefits: ['慰め', '希望の回復', '感情的な癒し', '悲しみの処理'],
    symptoms: ['悲しみ', '喪失感', '絶望', '感情的な痛み'],
    aroma: '慰め、希望、癒し、受容',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: '感情サポートの研究あり（医療行為を推奨するものではありません）'
  },

  // 感情アロマセラピー（続き）とキッズコレクション
  {
    id: 'forgive',
    name: 'Forgive',
    category: 'blend',
    benefits: ['許し', '感情の解放', '心の軽さ', '新たな始まり'],
    symptoms: ['怒り', '恨み', '罪悪感', '感情的なブロック'],
    aroma: '解放、許し、更新、自由',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6歳以下使用不可、ミルラ・タイム含有のため妊娠中は使用禁止、ベルガモット含有のため光毒性注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: '感情サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'intune',
    name: 'InTune',
    category: 'blend',
    benefits: ['集中力向上', '精神的な明晰さ', '注意力持続', '学習能力向上'],
    symptoms: ['集中力不足', '注意欠陥', '精神的な霧', '学習困難'],
    aroma: '集中、明晰、落ち着き、フォーカス',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、ライム含有のため光毒性注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: '集中力向上、ADD/ADHDサポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'citrus-bliss',
    name: 'Citrus Bliss',
    category: 'blend',
    benefits: ['気分向上', 'ストレス軽減', '活力向上', '幸福感'],
    symptoms: ['気分の落ち込み', 'ストレス', '疲労感', 'やる気不足'],
    aroma: '幸福、活力、陽気、楽観的',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、柑橘系オイル多数含有のため光毒性注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: '気分向上効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'clarycalm',
    name: 'ClaryCalm',
    category: 'blend',
    benefits: ['ホルモンバランス調整', '月経周期サポート', '更年期症状緩和', '感情バランス'],
    symptoms: ['月経不順', 'PMS', '更年期症状', 'ホルモンバランスの乱れ'],
    aroma: 'バランス、女性的、穏やか、調和',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '使用不可、妊娠中は使用禁止、ベルガモット含有のため光毒性、エストロゲン依存性疾患の方は注意'
    },
    usage: ['局所塗布'],
    description: 'ホルモンバランス調整の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'whisper',
    name: 'Whisper',
    category: 'blend',
    benefits: ['女性的魅力向上', '自信向上', '官能的な香り', '個性的な香り'],
    symptoms: ['自信喪失', '女性性の低下', '魅力不足感'],
    aroma: '女性的、魅力的、自信、官能的',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '使用不可、ジャスミン含有のため妊娠中は使用禁止、ベルガモット含有のため光毒性注意'
    },
    usage: ['局所塗布'],
    description: '感情サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'thinker-kids',
    name: 'Thinker (Kids)',
    category: 'blend',
    benefits: ['集中力向上', '精神的な明晰さ', '学習サポート'],
    symptoms: ['集中力不足', '宿題への取り組み困難', '注意散漫'],
    aroma: '集中、明晰、落ち着き',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '3歳以上、既に希釈済み、追加希釈不要'
    },
    usage: ['局所塗布'],
    description: '子供の集中力向上の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'calmer-kids',
    name: 'Calmer (Kids)',
    category: 'blend',
    benefits: ['リラクゼーション', '安眠促進', '心の落ち着き'],
    symptoms: ['寝つきの悪さ', '不安', '過度の興奮'],
    aroma: '穏やか、リラックス、安心',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '3歳以上、既に希釈済み、追加希釈不要'
    },
    usage: ['局所塗布'],
    description: '子供の睡眠改善の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'stronger-kids',
    name: 'Stronger (Kids)',
    category: 'blend',
    benefits: ['免疫サポート', '回復力向上', '保護効果'],
    symptoms: ['季節的な脅威', '環境的なストレス', '免疫力低下'],
    aroma: '強さ、保護、回復力',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '3歳以上、シダーウッド含有のため妊娠中は避ける、既に希釈済み'
    },
    usage: ['局所塗布'],
    description: '子供の免疫サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'brave-kids',
    name: 'Brave (Kids)',
    category: 'blend',
    benefits: ['勇気づけ', '自信向上', '前向きな気持ち'],
    symptoms: ['恐れ', '不安', '新しい状況への対処'],
    aroma: '勇気、自信、前向き',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '3歳以上、既に希釈済み、シナモン含有だが安全な濃度'
    },
    usage: ['局所塗布'],
    description: '子供の感情サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'steady-kids',
    name: 'Steady (Kids)',
    category: 'blend',
    benefits: ['感情バランス', 'グラウンディング', '安定感'],
    symptoms: ['感情の不安定', '気分の変動', 'バランスの欠如'],
    aroma: 'バランス、安定、落ち着き',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '3歳以上、既に希釈済み、追加希釈不要'
    },
    usage: ['局所塗布'],
    description: '子供の感情バランスの研究あり（医療行為を推奨するものではありません）'
  },

  // キッズコレクション（続き）、ブレンド、季節限定
  {
    id: 'rescuer-kids',
    name: 'Rescuer (Kids)',
    category: 'blend',
    benefits: ['筋肉の快適さ', 'リラクゼーション', '回復サポート'],
    symptoms: ['成長痛', '運動後の筋肉疲労', '軽い打撲'],
    aroma: '快適、リラックス、回復',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '3歳以上、既に希釈済み、追加希釈不要'
    },
    usage: ['局所塗布'],
    description: '子供の筋肉サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'tamer-kids',
    name: 'Tamer (Kids)',
    category: 'blend',
    benefits: ['消化サポート', '胃の快適さ', '吐き気軽減'],
    symptoms: ['お腹の不快感', '車酔い', '食べ過ぎ'],
    aroma: '快適、すっきり',
    safetyInfo: {
      pregnancy: true,
      children: false,
      notes: '3歳以上、既に希釈済み、追加希釈不要'
    },
    usage: ['局所塗布'],
    description: '子供の消化サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'terrashield',
    name: 'TerraShield',
    category: 'blend',
    benefits: ['虫除け効果', '屋外活動サポート', '自然な保護'],
    symptoms: ['虫刺され', '屋外活動時の虫除け必要'],
    aroma: '保護的、アウトドア',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6ヶ月以上、タイム・レモングラス含有のため妊娠中は避ける、猫への使用は避ける'
    },
    usage: ['局所塗布'],
    description: '虫除け効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'adaptiv',
    name: 'Adaptiv',
    category: 'blend',
    benefits: ['ストレス適応', 'リラクゼーション', '気分の安定', '落ち着き'],
    symptoms: ['ストレス', '緊張', '不安', '環境への適応困難'],
    aroma: '適応的、バランス、穏やか、集中',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、適切に希釈すれば使用可能'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'ストレス管理の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'anchor',
    name: 'Anchor',
    category: 'blend',
    benefits: ['深いグラウンディング', '瞑想促進', '安定感', 'センタリング'],
    symptoms: ['瞑想困難', 'グラウンディング不足', '精神的な不安定'],
    aroma: '安定、グラウンディング、瞑想的、中心',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6歳以下使用不可、シダーウッド含有のため妊娠中は避ける、ホットオイル含有のため希釈必須'
    },
    usage: ['アロマ', '局所塗布'],
    description: '瞑想促進効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'align',
    name: 'Align',
    category: 'blend',
    benefits: ['自己受容', '内なる調和', 'センタリング', '自己認識向上'],
    symptoms: ['自己受容の欠如', '自己認識不足', '内なる調和の乱れ'],
    aroma: '調和、受容、センタリング、自己愛',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6歳以下使用不可、バジル・ジャスミン含有のため妊娠中は使用禁止、ベルガモット含有のため光毒性注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: '感情バランスの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'arise',
    name: 'Arise',
    category: 'blend',
    benefits: ['啓発', '目的意識向上', 'インスピレーション', '前向きな行動'],
    symptoms: ['やる気不足', '目的意識の欠如', 'インスピレーション不足'],
    aroma: '啓発的、目的意識、明るい、前向き',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、レモン・グレープフルーツ含有のため光毒性注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: '気分向上効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'metapwr',
    name: 'MetaPWR',
    category: 'blend',
    benefits: ['代謝サポート', 'エネルギー向上', '健康的な体重管理', '活力向上'],
    symptoms: ['代謝の低下', '体重管理の困難', 'エネルギー不足'],
    aroma: 'エネルギッシュ、活力的、前向き',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '18歳未満使用禁止、妊娠中・授乳中は使用禁止、柑橘系オイル含有のため光毒性、使用禁止'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '代謝サポートの研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'holiday-joy',
    name: 'Holiday Joy',
    category: 'blend',
    benefits: ['気分向上', '季節の喜び', '温かさ', 'お祝いムード'],
    symptoms: ['季節的な気分の落ち込み', 'ホリデーストレス'],
    aroma: '喜び、温かさ、お祝い、幸福',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6歳以下使用不可、カシア含有のため妊娠中は使用禁止、ホットオイル多数含有のため大幅希釈必須、使用禁止'
    },
    usage: ['アロマ', '局所塗布'],
    description: '気分向上効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'holiday-peace',
    name: 'Holiday Peace',
    category: 'blend',
    benefits: ['リラクゼーション', '平和な気持ち', 'グラウンディング'],
    symptoms: ['季節的なストレス', '家族の集まりでの緊張'],
    aroma: '平和、穏やか、グラウンディング、静寂',
    safetyInfo: {
      pregnancy: true,
      children: true,
      notes: '生後6ヶ月以降、グレープフルーツ含有のため光毒性注意'
    },
    usage: ['アロマ', '局所塗布'],
    description: 'リラクゼーション効果の研究あり（医療行為を推奨するものではありません）'
  },
  {
    id: 'summer-savory',
    name: 'Summer Savory',
    category: 'herbal',
    benefits: ['消化促進', '抗菌作用', '腸内環境サポート'],
    symptoms: ['消化不良', '食欲不振', '腸内環境の乱れ'],
    aroma: '活力的、スパイシー',
    safetyInfo: {
      pregnancy: false,
      children: false,
      notes: '6歳以下使用不可、妊娠中は使用禁止、皮膚刺激の可能性、使用は避ける'
    },
    usage: ['アロマ', '局所塗布', '内服'],
    description: '消化器系サポート、抗菌作用の研究あり（医療行為を推奨するものではありません）'
  }
];