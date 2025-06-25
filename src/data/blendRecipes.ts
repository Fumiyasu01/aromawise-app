import { BlendRecipe } from '../types/BlendRecipe';

export const blendRecipes: BlendRecipe[] = [
  // ===== 日用品レシピ =====
  // 柔軟剤
  {
    id: 'fabric-softener',
    name: '天然柔軟剤',
    category: '洗濯',
    description: 'マイクロプラスチックフリーの環境に優しい柔軟剤です。お好みの香りでカスタマイズできます。',
    oils: [
      { oilId: 'lavender', oilName: 'Lavender', drops: 20 },
      { oilId: 'lemon', oilName: 'Lemon', drops: 10 }
    ],
    carrier: {
      type: 'クエン酸水',
      amount: '500ml'
    },
    additionalIngredients: [
      { name: 'クエン酸', amount: '大さじ2' },
      { name: '精製水', amount: '500ml' }
    ],
    instructions: [
      'ボトルに精製水500mlを入れます',
      'クエン酸大さじ2を加えてよく溶かします',
      'ラベンダーオイル20滴を加えます',
      'レモンオイル10滴を加えます',
      'よく振り混ぜて完成',
      '洗濯機の柔軟剤投入口に50ml程度入れて使用'
    ],
    benefits: [
      '衣類をふんわり仕上げる',
      '静電気を防ぐ',
      '自然な香り付け',
      '環境に優しい'
    ],
    safetyNotes: [
      '使用前によく振ってください',
      '直射日光を避けて保管',
      '作成後1ヶ月以内に使い切ってください'
    ],
    difficulty: 'easy',
    prepTime: '10分',
    usage: ['洗濯']
  },
  
  // デオドラントスプレー
  {
    id: 'deodorant-spray',
    name: 'ナチュラルデオドラントスプレー',
    category: 'ボディケア',
    description: '汗の匂いを抑え、爽やかな香りが持続する天然デオドラントです。',
    oils: [
      { oilId: 'tea-tree', oilName: 'Tea Tree', drops: 10 },
      { oilId: 'peppermint', oilName: 'Peppermint', drops: 5 },
      { oilId: 'lavender', oilName: 'Lavender', drops: 5 }
    ],
    carrier: {
      type: '精製水',
      amount: '100ml'
    },
    additionalIngredients: [
      { name: '無水エタノール', amount: '20ml' },
      { name: '精製水', amount: '80ml' }
    ],
    instructions: [
      'スプレーボトルに無水エタノール20mlを入れます',
      'ティーツリーオイル10滴を加えます',
      'ペパーミントオイル5滴を加えます',
      'ラベンダーオイル5滴を加えます',
      '精製水80mlを加えます',
      'よく振り混ぜて完成'
    ],
    benefits: [
      '抗菌作用で匂いを防ぐ',
      '清涼感のある使い心地',
      '肌に優しい天然成分',
      'リフレッシュ効果'
    ],
    safetyNotes: [
      '肌に異常がある場合は使用を避けてください',
      '目に入らないよう注意',
      '敏感肌の方はパッチテストを行ってください'
    ],
    difficulty: 'easy',
    prepTime: '5分',
    usage: ['スプレー']
  },

  // ヘアオイル
  {
    id: 'hair-oil',
    name: 'ナチュラルヘアオイル',
    category: 'ボディケア',
    description: '髪に艶とまとまりを与える、天然成分100%のヘアオイルです。',
    oils: [
      { oilId: 'rosemary', oilName: 'Rosemary', drops: 5 },
      { oilId: 'ylang_ylang', oilName: 'Ylang Ylang', drops: 3 },
      { oilId: 'lavender', oilName: 'Lavender', drops: 2 }
    ],
    carrier: {
      type: 'ホホバオイル',
      amount: '30ml'
    },
    additionalIngredients: [
      { name: 'アルガンオイル', amount: '10ml' },
      { name: 'ホホバオイル', amount: '20ml' }
    ],
    instructions: [
      '遮光ボトルにホホバオイル20mlを入れます',
      'アルガンオイル10mlを加えます',
      'ローズマリーオイル5滴を加えます',
      'イランイランオイル3滴を加えます',
      'ラベンダーオイル2滴を加えます',
      'よく振り混ぜて完成'
    ],
    benefits: [
      '髪に艶を与える',
      '頭皮の健康促進',
      'くせ毛をまとめる',
      'リラックス効果'
    ],
    safetyNotes: [
      '頭皮に異常がある場合は使用を避けてください',
      '妊娠中の方はローズマリーの使用に注意',
      '少量から試してください'
    ],
    difficulty: 'easy',
    prepTime: '5分',
    usage: ['ヘアケア']
  },

  // マルチクリーナー
  {
    id: 'multi-cleaner',
    name: '万能マルチクリーナー',
    category: '掃除',
    description: '家中どこでも使える、抗菌作用のある天然クリーナーです。',
    oils: [
      { oilId: 'tea-tree', oilName: 'Tea Tree', drops: 15 },
      { oilId: 'lemon', oilName: 'Lemon', drops: 20 },
      { oilId: 'eucalyptus', oilName: 'Eucalyptus', drops: 10 }
    ],
    carrier: {
      type: '精製水',
      amount: '400ml'
    },
    additionalIngredients: [
      { name: '無水エタノール', amount: '50ml' },
      { name: '精製水', amount: '350ml' },
      { name: '重曹', amount: '大さじ1' }
    ],
    instructions: [
      'スプレーボトルに無水エタノール50mlを入れます',
      'ティーツリーオイル15滴を加えます',
      'レモンオイル20滴を加えます',
      'ユーカリオイル10滴を加えます',
      '重曹大さじ1を加えてよく混ぜます',
      '精製水350mlを加えてよく振ります'
    ],
    benefits: [
      '強力な抗菌・除菌効果',
      '油汚れに効果的',
      '爽やかな香り',
      '環境に優しい'
    ],
    safetyNotes: [
      '大理石や天然石には使用しないでください',
      '使用前によく振ってください',
      '直射日光を避けて保管'
    ],
    difficulty: 'easy',
    prepTime: '10分',
    usage: ['掃除']
  },

  // バスボム
  {
    id: 'bath-bomb',
    name: 'リラックスバスボム',
    category: 'バス',
    description: 'お風呂にポンと入れるだけで、スパのようなリラックスタイムを演出します。',
    oils: [
      { oilId: 'lavender', oilName: 'Lavender', drops: 10 },
      { oilId: 'geranium', oilName: 'Geranium', drops: 5 },
      { oilId: 'bergamot', oilName: 'Bergamot', drops: 5 }
    ],
    additionalIngredients: [
      { name: '重曹', amount: '100g' },
      { name: 'クエン酸', amount: '50g' },
      { name: 'コーンスターチ', amount: '50g' },
      { name: '塩', amount: '大さじ1' },
      { name: '水', amount: '霧吹きで適量' }
    ],
    instructions: [
      'ボウルに重曹100gを入れます',
      'クエン酸50gを加えます',
      'コーンスターチ50gを加えます',
      '塩大さじ1を加えてよく混ぜます',
      'エッセンシャルオイルを合計20滴加えます',
      '霧吹きで水を少しずつ加えながら固めます',
      '型に入れて1日乾燥させます'
    ],
    benefits: [
      '深いリラクゼーション',
      '肌をなめらかに',
      '疲労回復',
      'アロマテラピー効果'
    ],
    safetyNotes: [
      '妊娠中の方は使用前に医師に相談',
      '敏感肌の方は少量から試してください',
      '湿気を避けて保管'
    ],
    difficulty: 'medium',
    prepTime: '30分（乾燥時間除く）',
    usage: ['入浴']
  },

  // ===== アロマケアレシピ =====
  // 虫よけスプレー（日用品）
  {
    id: 'insect-repellent-spray',
    name: '天然虫よけスプレー',
    category: '虫対策',
    description: '化学薬品を使わない、天然成分100%の虫よけスプレーです。',
    oils: [
      { oilId: 'lemon', oilName: 'Lemon', drops: 10 },
      { oilId: 'eucalyptus', oilName: 'Eucalyptus', drops: 8 },
      { oilId: 'peppermint', oilName: 'Peppermint', drops: 5 }
    ],
    carrier: {
      type: '精製水',
      amount: '100ml'
    },
    instructions: [
      'スプレーボトルに精製水100mlを入れます',
      'レモンオイル10滴を加えます',
      'ユーカリオイル8滴を加えます',
      'ペパーミントオイル5滴を加えます',
      'よく振り混ぜます',
      '使用前は毎回よく振ってください'
    ],
    benefits: [
      '蚊・ハエ・アブなどの虫よけ効果',
      '爽やかな香りでリフレッシュ',
      '化学薬品不使用で安心'
    ],
    safetyNotes: [
      '妊娠中・授乳中の方は使用前に医師にご相談ください',
      '3歳未満のお子様には使用しないでください',
      '目や口に入らないよう注意してください',
      '肌に異常を感じた場合は使用を中止してください'
    ],
    difficulty: 'easy',
    prepTime: '5分',
    usage: ['スプレー', '外出前に肌に噴霧']
  },

  // 安眠ブレンド
  {
    id: 'sleep-blend',
    name: 'ぐっすり安眠ブレンド',
    category: '安眠',
    description: '深いリラックスを促し、質の良い睡眠をサポートするブレンドです。',
    oils: [
      { oilId: 'lavender', oilName: 'Lavender', drops: 8 },
      { oilId: 'roman-chamomile', oilName: 'Roman Chamomile', drops: 4 },
      { oilId: 'cedarwood', oilName: 'Cedarwood', drops: 3 }
    ],
    carrier: {
      type: 'ホホバオイル',
      amount: '10ml'
    },
    instructions: [
      '小さなガラス瓶にホホバオイル10mlを入れます',
      'ラベンダーオイル8滴を加えます',
      'ローマンカモミールオイル4滴を加えます',
      'シダーウッドオイル3滴を加えます',
      'よく混ぜ合わせます',
      '手首や首筋に少量塗布します'
    ],
    benefits: [
      '深いリラックス効果',
      '入眠をスムーズに',
      '睡眠の質向上',
      'ストレス軽減'
    ],
    safetyNotes: [
      'ローマンカモミールは妊娠中の使用を避けてください',
      'シダーウッドは妊娠中の使用を避けてください',
      'パッチテストを行ってから使用してください'
    ],
    difficulty: 'easy',
    prepTime: '3分',
    usage: ['局所塗布', '寝る30分前に使用']
  },

  // 集中力アップ
  {
    id: 'focus-blend',
    name: '集中力アップブレンド',
    category: '集中力',
    description: '頭をクリアにし、集中力と記憶力を高めるブレンドです。',
    oils: [
      { oilId: 'rosemary', oilName: 'Rosemary', drops: 6 },
      { oilId: 'peppermint', oilName: 'Peppermint', drops: 4 },
      { oilId: 'lemon', oilName: 'Lemon', drops: 5 }
    ],
    instructions: [
      'ディフューザーに水を入れます',
      'ローズマリーオイル6滴を加えます',
      'ペパーミントオイル4滴を加えます',
      'レモンオイル5滴を加えます',
      'ディフューザーを運転します',
      '勉強や仕事中に2-3時間拡散させます'
    ],
    benefits: [
      '集中力向上',
      '記憶力アップ',
      '頭がすっきり',
      'やる気向上'
    ],
    safetyNotes: [
      'ローズマリーは妊娠中・てんかんの方は使用を避けてください',
      'ペパーミントは妊娠中・授乳中・6歳未満は使用禁止',
      '長時間の使用は避けてください'
    ],
    difficulty: 'easy',
    prepTime: '2分',
    usage: ['ディフューザー', '勉強・仕事中']
  },

  // リラックスマッサージ
  {
    id: 'relaxing-massage',
    name: 'リラックスマッサージオイル',
    category: 'リラックス',
    description: '心身の緊張をほぐし、深いリラックスをもたらすマッサージオイルです。',
    oils: [
      { oilId: 'frankincense', oilName: 'Frankincense', drops: 5 },
      { oilId: 'lavender', oilName: 'Lavender', drops: 6 },
      { oilId: 'geranium', oilName: 'Geranium', drops: 3 }
    ],
    carrier: {
      type: 'ココナッツオイル（フラクショネイテッド）',
      amount: '30ml'
    },
    instructions: [
      'マッサージオイル用のボトルにココナッツオイル30mlを入れます',
      'フランキンセンスオイル5滴を加えます',
      'ラベンダーオイル6滴を加えます',
      'ゼラニウムオイル3滴を加えます',
      'よく振り混ぜます',
      '肩、首、背中を優しくマッサージします'
    ],
    benefits: [
      '筋肉の緊張緩和',
      'ストレス解消',
      '心の安定',
      '肌の調子改善'
    ],
    safetyNotes: [
      'ゼラニウムは妊娠中の使用を避けてください',
      '敏感肌の方はパッチテストを行ってください',
      '目の周りは避けてください'
    ],
    difficulty: 'medium',
    prepTime: '5分',
    usage: ['マッサージ', '入浴後やリラックスタイム']
  },

  // 空気清浄スプレー
  {
    id: 'air-purifying-spray',
    name: '天然空気清浄スプレー',
    category: '空気清浄',
    description: '抗菌・抗ウイルス作用のあるオイルで空気を浄化するスプレーです。',
    oils: [
      { oilId: 'tea-tree', oilName: 'Tea Tree', drops: 8 },
      { oilId: 'lemon', oilName: 'Lemon', drops: 6 },
      { oilId: 'eucalyptus', oilName: 'Eucalyptus', drops: 4 },
      { oilId: 'on-guard', oilName: 'On Guard', drops: 3 }
    ],
    carrier: {
      type: '精製水 + エタノール',
      amount: '100ml + 10ml'
    },
    instructions: [
      'スプレーボトルにエタノール10mlを入れます',
      'ティーツリーオイル8滴を加えます',
      'レモンオイル6滴を加えます',
      'ユーカリオイル4滴を加えます',
      'オンガードオイル3滴を加えます',
      'よく振り混ぜてから精製水100mlを加えます',
      '使用前は毎回よく振ってください'
    ],
    benefits: [
      '空気中の細菌・ウイルス対策',
      '消臭効果',
      '免疫サポート',
      '爽やかな香り'
    ],
    safetyNotes: [
      'オンガードは妊娠中の使用を避けてください',
      '3歳未満の子供がいる部屋では希釈してください',
      'ペットがいる場合は換気を十分に行ってください'
    ],
    difficulty: 'medium',
    prepTime: '7分',
    usage: ['スプレー', '部屋・車内・オフィス']
  },

  // 気分転換ディフューザー
  {
    id: 'mood-boost-diffuser',
    name: '気分転換ハッピーブレンド',
    category: '気分転換',
    description: '落ち込んだ気分を明るくし、エネルギーを与えてくれるブレンドです。',
    oils: [
      { oilId: 'wild-orange', oilName: 'Wild Orange', drops: 7 },
      { oilId: 'bergamot', oilName: 'Bergamot', drops: 5 },
      { oilId: 'ylang-ylang', oilName: 'Ylang Ylang', drops: 2 }
    ],
    instructions: [
      'ディフューザーに水を入れます',
      'ワイルドオレンジオイル7滴を加えます',
      'ベルガモットオイル5滴を加えます',
      'イランイランオイル2滴を加えます',
      'ディフューザーを運転します',
      '朝や気分を変えたい時に1-2時間拡散させます'
    ],
    benefits: [
      '気分向上',
      'ストレス軽減',
      'エネルギーアップ',
      '前向きな気持ち'
    ],
    safetyNotes: [
      'ベルガモット・オレンジは光毒性があります',
      'イランイランは子供への使用は避けてください',
      '濃度が高いと頭痛を起こす場合があります'
    ],
    difficulty: 'easy',
    prepTime: '2分',
    usage: ['ディフューザー', '朝・気分転換時']
  },

  // 新オイルを活用した季節別レシピ
  {
    id: 'winter-immunity-boost',
    name: '冬の免疫力強化ブレンド',
    category: '免疫サポート',
    description: 'オンガードとフランキンセンスで冬の免疫システムをサポートします。',
    oils: [
      { oilId: '4', oilName: 'オンガード', drops: 5 },
      { oilId: '7', oilName: 'フランキンセンス', drops: 3 },
      { oilId: '6', oilName: 'ワイルドオレンジ', drops: 4 }
    ],
    instructions: [
      'ディフューザーに水200mlを入れます',
      'オンガード5滴を加えます',
      'フランキンセンス3滴を加えます',
      'ワイルドオレンジ4滴を加えます',
      '1日2-3回、各2時間拡散させます'
    ],
    benefits: [
      '免疫システムのサポート',
      '季節の変わり目対策',
      '抗酸化作用',
      '気分向上効果'
    ],
    safetyNotes: [
      '2歳未満の乳幼児がいる部屋での使用は避けてください',
      'ワイルドオレンジは光毒性があります',
      '妊娠中の方はシナモン・クローブ成分にご注意ください'
    ],
    difficulty: 'easy',
    prepTime: '3分',
    usage: ['ディフューザー', '冬季・季節の変わり目']
  },

  {
    id: 'respiratory-clear-steam',
    name: '呼吸スッキリスチーム',
    category: '呼吸サポート',
    description: 'ブリーズとユーカリで鼻づまりや呼吸器の不調をサポートします。',
    oils: [
      { oilId: '5', oilName: 'ブリーズ', drops: 3 },
      { oilId: '9', oilName: 'ユーカリ', drops: 2 },
      { oilId: '2', oilName: 'ペパーミント', drops: 1 }
    ],
    carrier: {
      type: '熱湯',
      amount: '500ml'
    },
    instructions: [
      '洗面器に熱湯500mlを入れます',
      'ブリーズ3滴を加えます',
      'ユーカリ2滴を加えます',
      'ペパーミント1滴を加えます',
      'タオルを頭にかけて蒸気を吸入します（5-10分）'
    ],
    benefits: [
      '鼻づまり緩和',
      '呼吸の改善',
      '季節的な呼吸器トラブル対策',
      'リフレッシュ効果'
    ],
    safetyNotes: [
      '熱湯の取り扱いに注意してください',
      '妊娠中・授乳中は使用を避けてください',
      '子供は大人の監督のもとで使用してください',
      '目を閉じて蒸気を吸入してください'
    ],
    difficulty: 'medium',
    prepTime: '5分',
    usage: ['スチーム吸入', '風邪・花粉症時']
  },

  {
    id: 'natural-cleaning-spray',
    name: '天然抗菌クリーニングスプレー',
    category: 'ハウスケア',
    description: 'ティーツリーとレモンで化学薬品を使わない安全なお掃除スプレー。',
    oils: [
      { oilId: '8', oilName: 'ティーツリー', drops: 8 },
      { oilId: '3', oilName: 'レモン', drops: 10 },
      { oilId: '6', oilName: 'ワイルドオレンジ', drops: 5 }
    ],
    carrier: {
      type: '精製水 + 白酢',
      amount: '250ml水 + 50ml酢'
    },
    instructions: [
      'スプレーボトルに精製水250mlを入れます',
      '白酢50mlを加えます',
      'ティーツリー8滴を加えます',
      'レモン10滴を加えます',
      'ワイルドオレンジ5滴を加えます',
      'よく振ってから使用してください'
    ],
    benefits: [
      '天然の抗菌・除菌効果',
      '化学薬品不使用で安心',
      '爽やかな香りで快適',
      'コストパフォーマンス良好'
    ],
    safetyNotes: [
      '使用前によく振ってください',
      '天然石やデリケートな素材への使用は避けてください',
      '子供の手の届かない場所に保管してください',
      '柑橘系オイル使用後は直射日光を避けてください'
    ],
    difficulty: 'easy',
    prepTime: '5分',
    usage: ['スプレー', 'キッチン・バスルーム・リビング清掃']
  },

  {
    id: 'focus-study-blend',
    name: '集中力アップ勉強ブレンド',
    category: '集中力',
    description: 'ローズマリーとペパーミントで記憶力と集中力をサポートします。',
    oils: [
      { oilId: '10', oilName: 'ローズマリー', drops: 4 },
      { oilId: '2', oilName: 'ペパーミント', drops: 3 },
      { oilId: '7', oilName: 'フランキンセンス', drops: 2 }
    ],
    instructions: [
      'ディフューザーに水を入れます',
      'ローズマリー4滴を加えます',
      'ペパーミント3滴を加えます',
      'フランキンセンス2滴を加えます',
      '勉強・作業中に2-3時間拡散させます'
    ],
    benefits: [
      '集中力向上',
      '記憶力サポート',
      '精神的クリアさ',
      '眠気覚まし効果'
    ],
    safetyNotes: [
      '6歳未満の子供がいる部屋での使用は避けてください',
      '高血圧の方はローズマリーの使用前に医師にご相談ください',
      '就寝3時間前は使用を避けてください',
      '長時間の使用は避け、適度に換気してください'
    ],
    difficulty: 'easy',
    prepTime: '2分',
    usage: ['ディフューザー', '勉強・仕事・試験時']
  },

  {
    id: 'meditation-grounding',
    name: '瞑想グラウンディングブレンド',
    category: '瞑想・スピリチュアル',
    description: 'フランキンセンスとラベンダーで深い瞑想状態をサポートします。',
    oils: [
      { oilId: '7', oilName: 'フランキンセンス', drops: 5 },
      { oilId: '1', oilName: 'ラベンダー', drops: 3 },
      { oilId: '6', oilName: 'ワイルドオレンジ', drops: 1 }
    ],
    instructions: [
      'ディフューザーに水を入れます',
      'フランキンセンス5滴を加えます',
      'ラベンダー3滴を加えます',
      'ワイルドオレンジ1滴を加えます',
      '瞑想開始15分前から拡散させます'
    ],
    benefits: [
      '心の安定とグラウンディング',
      '深いリラクゼーション',
      '精神的な集中',
      'スピリチュアルな体験の促進'
    ],
    safetyNotes: [
      '運転前や運転中は使用しないでください',
      '深いリラックス状態になるため安全な環境で使用してください',
      '光毒性のあるオレンジが少量含まれています',
      '初心者は香りの強さを調整してください'
    ],
    difficulty: 'easy',
    prepTime: '3分',
    usage: ['ディフューザー', '瞑想・ヨガ・リラクゼーション時']
  }
];