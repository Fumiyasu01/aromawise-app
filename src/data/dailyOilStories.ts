import { EnhancedOil } from '../types/EnhancedOil';

export interface DailyOilStory {
  oilId: string;
  date: string; // YYYY-MM-DD format
  story: string;
  missions: {
    id: string;
    description: string;
    timing: 'morning' | 'afternoon' | 'evening';
    completed?: boolean;
  }[];
  recipe: {
    name: string;
    description: string;
    oils: { oilId: string; drops: number }[];
  };
  trivia: string;
  affirmation: string;
  visualTheme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundImage?: string;
  };
}

// 日付に基づいてオイルを選択するロジック
export function getDailyOil(date: Date = new Date()): string {
  // 年間を通じて127種類のオイルを循環
  const dayOfYear = getDayOfYear(date);
  const oilIndex = dayOfYear % 127;
  
  // オイルIDのリスト（enhancedOilsから取得）
  const oilIds = [
    'lavender', 'lemon', 'peppermint', 'tea-tree', 'eucalyptus',
    'frankincense', 'ylang_ylang', 'bergamot', 'rosemary', 'geranium',
    'roman-chamomile', 'ginger', 'wild-orange', 'cedarwood', 'sandalwood',
    'vetiver', 'patchouli', 'clary-sage', 'marjoram', 'cypress',
    'basil', 'fennel', 'helichrysum', 'juniper-berry', 'lime',
    'melaleuca', 'myrrh', 'oregano', 'thyme', 'wintergreen',
    'cinnamon', 'clove', 'coriander', 'grapefruit', 'jasmine',
    'lemongrass', 'melissa', 'neroli', 'rose', 'spearmint',
    'tangerine', 'arborvitae', 'black-pepper', 'blue-tansy', 'cardamom',
    'cassia', 'copaiba', 'douglas-fir', 'green-mandarin', 'magnolia',
    'petitgrain', 'pink-pepper', 'siberian-fir', 'spikenard', 'turmeric',
    'yarrow', 'hinoki', 'litsea', 'manuka', 'ravintsara',
    'camphor', 'cajeput', 'citronella', 'palmarosa', 'angelica',
    'bay', 'benzoin', 'birch', 'carrot-seed', 'dill',
    'elemi', 'galbanum', 'ho-wood', 'hyssop', 'lavandin',
    'lovage', 'myrtle', 'niaouli', 'nutmeg', 'oakmoss',
    'opoponax', 'peru-balsam', 'pine', 'ravensara', 'sage',
    'tagetes', 'tarragon', 'valerian', 'violet-leaf', 'white-fir',
    'yarrow-pom', 'yuzu', 'zendocrine', 'adaptiv', 'on-guard',
    'deep-blue', 'breathe', 'digestzen', 'purify', 'terrashield',
    'hd-clear', 'clarycalm', 'balance', 'aromatouch', 'citrus-bliss',
    'elevation', 'forgive', 'motivate', 'passion', 'peace',
    'console', 'cheer', 'brave', 'stronger', 'thinker',
    'steady', 'rescuer', 'tamer', 'calmer', 'smart-sassy',
    'past-tense', 'serenity', 'align', 'anchor', 'arise',
    'ascend', 'center', 'enlighten', 'renew', 'synergy'
  ];
  
  return oilIds[oilIndex] || 'lavender';
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// ストーリーテンプレート（季節や曜日に応じて変化）
export function generateDailyStory(oilId: string, date: Date): DailyOilStory {
  const season = getSeason(date);
  const dayOfWeek = date.getDay();
  
  // 基本的なストーリーテンプレート（実際はオイルごとに豊富なバリエーションを用意）
  const storyTemplates: Record<string, { story: string; affirmation: string; trivia: string }> = {
    'lavender': {
      story: season === 'spring' 
        ? '春の訪れとともに、ラベンダーの優しい香りがあなたを包みます。新しい始まりに向けて、心を穏やかに整えましょう。'
        : '今日はラベンダーと共に、心の平穏を見つける日。深呼吸をして、あなたの内なる静けさに耳を傾けてみましょう。',
      affirmation: '私は今、この瞬間に存在し、平和と調和に満ちています。',
      trivia: 'ラベンダーの名前は、ラテン語の"lavare"（洗う）に由来し、古代ローマ時代から入浴や洗濯に使われていました。'
    },
    'lemon': {
      story: dayOfWeek === 1 // Monday
        ? '新しい週の始まり。レモンの爽快な香りが、あなたの心と頭をクリアにし、素晴らしい一週間への扉を開きます。'
        : '太陽のように明るいレモンの香り。今日という日を、フレッシュな気持ちで満たしましょう。',
      affirmation: '私は活力に満ち、ポジティブなエネルギーで輝いています。',
      trivia: 'レモンの精油1kgを作るには、約3000個のレモンが必要です。'
    },
    'peppermint': {
      story: '爽やかなペパーミントが、あなたの感覚を研ぎ澄まします。集中力を高め、新しいアイデアが湧き出る一日に。',
      affirmation: '私の心は明晰で、創造的なエネルギーに満ちています。',
      trivia: 'ペパーミントは「世界最古の薬」の一つで、古代エジプトのピラミッドからも発見されています。'
    },
    // ... 他のオイルのストーリーも追加
  };
  
  const template = storyTemplates[oilId] || {
    story: '今日のオイルとともに、新しい発見と癒しの時間を過ごしましょう。',
    affirmation: '私は自然の恵みに感謝し、調和の中で生きています。',
    trivia: 'エッセンシャルオイルは、植物の生命力が凝縮された贈り物です。'
  };
  
  // ミッションの生成
  const missions = generateMissions(oilId, season, dayOfWeek);
  
  // レシピの生成
  const recipe = generateDailyRecipe(oilId, season);
  
  // ビジュアルテーマの生成
  const visualTheme = generateVisualTheme(oilId);
  
  return {
    oilId,
    date: formatDate(date),
    story: template.story,
    missions,
    recipe,
    trivia: template.trivia,
    affirmation: template.affirmation,
    visualTheme
  };
}

function generateMissions(oilId: string, season: string, dayOfWeek: number) {
  // オイルの特性に基づいたミッション生成
  const missionTemplates: Record<string, any[]> = {
    'lavender': [
      { id: 'morning-diffuse', description: '朝のディフューザーにラベンダーを3滴入れて、穏やかな目覚めを', timing: 'morning' },
      { id: 'afternoon-pulse', description: '午後の休憩時に、手首にラベンダーを1滴つけて深呼吸', timing: 'afternoon' },
      { id: 'evening-bath', description: '夜のバスタイムにラベンダーを5滴入れて、極上のリラックスタイムを', timing: 'evening' }
    ],
    'lemon': [
      { id: 'morning-water', description: '朝の一杯の水にレモンオイルを1滴加えて、体の内側から浄化', timing: 'morning' },
      { id: 'afternoon-clean', description: '午後のお掃除にレモンオイルを使って、空間もリフレッシュ', timing: 'afternoon' },
      { id: 'evening-diffuse', description: '夕方のディフューザーでレモンの香りを楽しみ、1日の疲れをリセット', timing: 'evening' }
    ],
    // デフォルトミッション
    'default': [
      { id: 'morning-inhale', description: '朝、手のひらに1滴落として深呼吸', timing: 'morning' },
      { id: 'afternoon-diffuse', description: '午後のディフューザーで香りを楽しむ', timing: 'afternoon' },
      { id: 'evening-apply', description: '夜、リラックスタイムに使用する', timing: 'evening' }
    ]
  };
  
  return missionTemplates[oilId] || missionTemplates['default'];
}

function generateDailyRecipe(oilId: string, season: string) {
  // 季節とオイルに応じたレシピ生成
  const recipeTemplates: Record<string, any> = {
    'spring': {
      name: '春の目覚めブレンド',
      description: '新しい季節の始まりを祝福するフレッシュなブレンド',
      oils: [
        { oilId: oilId, drops: 3 },
        { oilId: 'lemon', drops: 2 },
        { oilId: 'geranium', drops: 1 }
      ]
    },
    'summer': {
      name: '夏の涼風ブレンド',
      description: '暑い日々に爽やかな風を運ぶクールなブレンド',
      oils: [
        { oilId: oilId, drops: 3 },
        { oilId: 'peppermint', drops: 2 },
        { oilId: 'eucalyptus', drops: 1 }
      ]
    },
    'autumn': {
      name: '秋の安らぎブレンド',
      description: '実りの季節に感謝を込めた温かみのあるブレンド',
      oils: [
        { oilId: oilId, drops: 3 },
        { oilId: 'wild-orange', drops: 2 },
        { oilId: 'cinnamon', drops: 1 }
      ]
    },
    'winter': {
      name: '冬の温もりブレンド',
      description: '寒い季節に心と体を温める優しいブレンド',
      oils: [
        { oilId: oilId, drops: 3 },
        { oilId: 'frankincense', drops: 2 },
        { oilId: 'cedarwood', drops: 1 }
      ]
    }
  };
  
  return recipeTemplates[season] || recipeTemplates['spring'];
}

function generateVisualTheme(oilId: string) {
  // オイルの特性に基づいた色彩テーマ
  const themes: Record<string, any> = {
    'lavender': {
      primaryColor: '#9B7EDE',
      secondaryColor: '#E6E0F8',
      backgroundImage: 'lavender-field'
    },
    'lemon': {
      primaryColor: '#FFD93D',
      secondaryColor: '#FFF9E6',
      backgroundImage: 'lemon-grove'
    },
    'peppermint': {
      primaryColor: '#4ECDC4',
      secondaryColor: '#E6F9F8',
      backgroundImage: 'mint-leaves'
    },
    'default': {
      primaryColor: '#7A9A65',
      secondaryColor: '#F5F0E8',
      backgroundImage: 'botanical'
    }
  };
  
  return themes[oilId] || themes['default'];
}

function getSeason(date: Date): string {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}