export interface SafetyGuideline {
  category: 'age_restrictions' | 'pregnancy' | 'photosensitivity' | 'hot_oils' | 'pet_safety';
  title: string;
  description: string;
  oils: {
    name: string;
    restriction: string;
    notes?: string;
  }[];
}

export const safetyGuidelines: SafetyGuideline[] = [
  {
    category: 'age_restrictions',
    title: '年齢制限',
    description: '特定の年齢未満の方には使用を推奨しないオイル',
    oils: [
      { name: 'ペパーミント', restriction: '6歳未満使用禁止', notes: 'メントール含有量が高い' },
      { name: 'ローズマリー', restriction: '6歳未満使用禁止', notes: 'カンファー含有' },
      { name: 'ユーカリ', restriction: '2歳未満使用禁止', notes: '1,8シネオール含有' },
      { name: 'ウィンターグリーン', restriction: '10歳未満使用禁止', notes: 'サリチル酸メチル含有' },
      { name: 'バーチ', restriction: '10歳未満使用禁止', notes: 'サリチル酸メチル含有' },
      { name: 'カシア', restriction: '2歳未満使用禁止', notes: '皮膚刺激性が高い' },
      { name: 'クローブ', restriction: '2歳未満使用禁止', notes: '皮膚刺激性が高い' },
      { name: 'タイム', restriction: '2歳未満使用禁止', notes: 'フェノール含有' },
      { name: 'オレガノ', restriction: '2歳未満使用禁止', notes: 'フェノール含有' }
    ]
  },
  {
    category: 'pregnancy',
    title: '妊娠中の使用',
    description: '妊娠中は使用を避けるか、医師に相談が必要なオイル',
    oils: [
      { name: 'クラリセージ', restriction: '妊娠中使用禁止', notes: '子宮収縮作用の可能性' },
      { name: 'ローズマリー', restriction: '妊娠中使用禁止', notes: '血圧上昇の可能性' },
      { name: 'タイム', restriction: '妊娠中使用禁止', notes: '子宮刺激作用' },
      { name: 'オレガノ', restriction: '妊娠中使用禁止', notes: '子宮刺激作用' },
      { name: 'ウィンターグリーン', restriction: '妊娠中使用禁止', notes: 'サリチル酸メチル含有' },
      { name: 'バーチ', restriction: '妊娠中使用禁止', notes: 'サリチル酸メチル含有' },
      { name: 'シナモンバーク', restriction: '妊娠中使用禁止', notes: '子宮刺激作用' },
      { name: 'クローブ', restriction: '妊娠中使用禁止', notes: '子宮刺激作用' },
      { name: 'ペパーミント', restriction: '第1トリメスター使用注意', notes: '使用量に注意' },
      { name: 'ラベンダー', restriction: '使用可能', notes: '適切に希釈して使用' },
      { name: 'レモン', restriction: '使用可能', notes: '光毒性に注意' },
      { name: 'ジンジャー', restriction: '使用可能', notes: 'つわり対策に有効' }
    ]
  },
  {
    category: 'photosensitivity',
    title: '光毒性のあるオイル',
    description: '使用後は直射日光を避ける必要があるオイル',
    oils: [
      { name: 'レモン', restriction: '使用後12時間は日光を避ける', notes: '柑橘系オイル' },
      { name: 'ライム', restriction: '使用後12時間は日光を避ける', notes: '柑橘系オイル' },
      { name: 'ベルガモット', restriction: '使用後12時間は日光を避ける', notes: '最も光毒性が強い' },
      { name: 'グレープフルーツ', restriction: '使用後12時間は日光を避ける', notes: '柑橘系オイル' },
      { name: 'オレンジ', restriction: '使用後12時間は日光を避ける', notes: '柑橘系オイル' },
      { name: 'タンジェリン', restriction: '使用後12時間は日光を避ける', notes: '柑橘系オイル' },
      { name: 'ユズ', restriction: '使用後12時間は日光を避ける', notes: '柑橘系オイル' },
      { name: 'レモングラス', restriction: '光毒性は低い', notes: '敏感肌は注意' }
    ]
  },
  {
    category: 'hot_oils',
    title: 'ホットオイル',
    description: '必ず希釈して使用する必要があるオイル',
    oils: [
      { name: 'シナモンバーク', restriction: '0.1%以下に希釈', notes: '皮膚刺激性が非常に高い' },
      { name: 'クローブ', restriction: '0.5%以下に希釈', notes: '皮膚刺激性が高い' },
      { name: 'オレガノ', restriction: '1%以下に希釈', notes: 'フェノール含有量が高い' },
      { name: 'タイム', restriction: '1%以下に希釈', notes: 'フェノール含有量が高い' },
      { name: 'カシア', restriction: '0.2%以下に希釈', notes: '皮膚刺激性が高い' },
      { name: 'ウィンターグリーン', restriction: '2.5%以下に希釈', notes: 'サリチル酸メチル含有' },
      { name: 'ペパーミント', restriction: '3%以下に希釈', notes: '冷感刺激' },
      { name: 'レモングラス', restriction: '1%以下に希釈', notes: '皮膚刺激の可能性' }
    ]
  },
  {
    category: 'pet_safety',
    title: 'ペットへの安全性',
    description: 'ペット（特に猫）がいる環境での使用に注意が必要なオイル',
    oils: [
      { name: 'ティーツリー', restriction: '猫には絶対使用禁止', notes: '猫には有毒' },
      { name: 'ペパーミント', restriction: '猫には使用禁止', notes: 'メントール系は猫に有害' },
      { name: 'ユーカリ', restriction: '猫には使用禁止', notes: '1,8シネオールは猫に有害' },
      { name: 'シナモン', restriction: '猫・犬に使用禁止', notes: '肝臓への影響' },
      { name: 'クローブ', restriction: '猫・犬に使用禁止', notes: '肝臓への影響' },
      { name: 'タイム', restriction: '猫には使用禁止', notes: 'フェノール系は猫に有害' },
      { name: 'オレガノ', restriction: '猫には使用禁止', notes: 'フェノール系は猫に有害' },
      { name: 'ウィンターグリーン', restriction: '猫・犬に使用禁止', notes: 'サリチル酸は有害' },
      { name: 'ラベンダー', restriction: '少量なら使用可能', notes: '希釈して使用' },
      { name: 'フランキンセンス', restriction: '使用可能', notes: 'ペットに安全' }
    ]
  }
];

export const getSafetyGuidelinesByCategory = (category: SafetyGuideline['category']): SafetyGuideline | undefined => {
  return safetyGuidelines.find(guideline => guideline.category === category);
};

export const getOilSafetyInfo = (oilName: string): Array<{
  category: SafetyGuideline['category'];
  restriction: string;
  notes?: string;
}> => {
  const safetyInfo: Array<{
    category: SafetyGuideline['category'];
    restriction: string;
    notes?: string;
  }> = [];

  safetyGuidelines.forEach(guideline => {
    const oilInfo = guideline.oils.find(oil => oil.name === oilName);
    if (oilInfo) {
      safetyInfo.push({
        category: guideline.category,
        restriction: oilInfo.restriction,
        notes: oilInfo.notes
      });
    }
  });

  return safetyInfo;
};