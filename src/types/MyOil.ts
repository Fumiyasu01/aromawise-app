import { Oil } from './Oil';

export interface MyOilUsage {
  id: string;
  date: Date;
  purpose: string;
  amount: 'few_drops' | 'moderate' | 'generous';
  method: 'aromatic' | 'topical' | 'internal';
  effectiveness: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface MyOilInventory {
  quantity: number;
  unit: 'ml' | 'bottles';
  purchaseDate: Date;
  openedDate?: Date;
  expirationDate?: Date;
  purchasePrice?: number;
  supplier?: string;
  lotNumber?: string;
}

export interface MyOilData {
  id: string;
  oilId: string;
  oil?: Oil; // 参照用
  inventory: MyOilInventory;
  customTags: string[];
  personalNotes: string;
  isFavorite: boolean;
  usageHistory: MyOilUsage[];
  lastUsed?: Date;
  totalUsageCount: number;
  averageEffectiveness?: number;
  customBlends?: string[]; // ブレンドレシピのID
}

export interface CustomBlendRecipe {
  id: string;
  name: string;
  description: string;
  oils: {
    oilId: string;
    drops: number;
  }[];
  purpose: string;
  instructions: string;
  createdDate: Date;
  lastUsed?: Date;
  effectiveness?: number;
  tags: string[];
}