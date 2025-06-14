export interface BlendRecipe {
  id: string;
  name: string;
  category: '虫よけ' | '安眠' | '集中力' | 'リラックス' | '空気清浄' | '気分転換' | '免疫サポート' | '呼吸サポート' | 'ハウスケア' | '瞑想・スピリチュアル';
  description: string;
  oils: {
    oilId: string;
    oilName: string;
    drops: number;
  }[];
  carrier?: {
    type: string;
    amount: string;
  };
  instructions: string[];
  benefits: string[];
  safetyNotes: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: string;
  usage: string[];
}

export interface RecipeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  recipes: BlendRecipe[];
}