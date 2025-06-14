export type SymptomCategory = 
  | 'headache' | 'stress' | 'sleep' | 'focus' | 'energy' | 'cold' 
  | 'muscle_pain' | 'mood' | 'respiratory' | 'skin' | 'digestive' | 'immune';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface RecommendationScore {
  itemId: string;
  itemType: 'oil' | 'recipe' | 'blend';
  score: number; // 0-100
  reasons: string[]; // なぜ推奨されるかの理由
}

export interface RecommendationRequest {
  symptoms?: SymptomCategory[];
  timeOfDay?: TimeOfDay;
  season?: Season;
  userSafetyProfile?: any; // UserSafetyProfile from recipeSafety
  preferredCategories?: string[];
  availableOils?: string[]; // user's oil IDs
}

export interface RecommendationResult {
  oils: RecommendationScore[];
  recipes: RecommendationScore[];
  blends: RecommendationScore[];
  primaryReason: string;
  confidence: number; // 0-100
}

export interface SymptomMapping {
  symptom: SymptomCategory;
  nameJa: string;
  description: string;
  recommendedOils: Array<{
    oilId: string;
    score: number;
    reason: string;
  }>;
  recommendedRecipeCategories: Array<{
    category: string;
    score: number;
    reason: string;
  }>;
  recommendedBlendCategories: Array<{
    category: string;
    score: number;
    reason: string;
  }>;
}

export interface TimeBasedMapping {
  timeOfDay: TimeOfDay;
  nameJa: string;
  description: string;
  boostCategories: Array<{
    category: string;
    multiplier: number;
  }>;
  boostOilTypes: Array<{
    type: string;
    multiplier: number;
  }>;
}

export interface SeasonalMapping {
  season: Season;
  nameJa: string;
  description: string;
  boostCategories: Array<{
    category: string;
    multiplier: number;
  }>;
  featuredSymptoms: SymptomCategory[];
}