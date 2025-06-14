export interface UserPreferences {
  favoriteOils: string[]; // オイルID
  frequentSymptoms: { [symptom: string]: number }; // 症状と使用回数
  oilUsageCount: { [oilId: string]: number }; // オイル使用回数
  recipeUsageCount: { [recipeId: string]: number }; // レシピ使用回数
  blendUsageCount: { [blendId: string]: number }; // ブレンド使用回数
  lastUsedCategories: string[]; // 最近使った カテゴリ
  preferredTimeOfDay: { [timeOfDay: string]: number }; // 時間帯別使用頻度
  categoryPreferences: { [category: string]: number }; // カテゴリ好み度
}

export class UserPreferenceManager {
  private static STORAGE_KEY = 'aromawise_user_preferences';

  // デフォルトのユーザー設定
  static getDefaultPreferences(): UserPreferences {
    return {
      favoriteOils: [],
      frequentSymptoms: {},
      oilUsageCount: {},
      recipeUsageCount: {},
      blendUsageCount: {},
      lastUsedCategories: [],
      preferredTimeOfDay: {},
      categoryPreferences: {}
    };
  }

  // ユーザー設定を読み込み
  static loadPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.getDefaultPreferences(), ...parsed };
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
    return this.getDefaultPreferences();
  }

  // ユーザー設定を保存
  static savePreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  // オイル使用を記録
  static recordOilUsage(oilId: string, category: string): void {
    const preferences = this.loadPreferences();
    
    // オイル使用回数を増加
    preferences.oilUsageCount[oilId] = (preferences.oilUsageCount[oilId] || 0) + 1;
    
    // カテゴリ好みを増加
    preferences.categoryPreferences[category] = (preferences.categoryPreferences[category] || 0) + 1;
    
    // 最近使用したカテゴリを更新（最大10個）
    preferences.lastUsedCategories = [
      category,
      ...preferences.lastUsedCategories.filter(c => c !== category)
    ].slice(0, 10);
    
    // 現在の時間帯使用を記録
    const currentTimeOfDay = this.getCurrentTimeOfDay();
    preferences.preferredTimeOfDay[currentTimeOfDay] = (preferences.preferredTimeOfDay[currentTimeOfDay] || 0) + 1;
    
    this.savePreferences(preferences);
  }

  // レシピ使用を記録
  static recordRecipeUsage(recipeId: string, category: string): void {
    const preferences = this.loadPreferences();
    
    preferences.recipeUsageCount[recipeId] = (preferences.recipeUsageCount[recipeId] || 0) + 1;
    preferences.categoryPreferences[category] = (preferences.categoryPreferences[category] || 0) + 1;
    
    preferences.lastUsedCategories = [
      category,
      ...preferences.lastUsedCategories.filter(c => c !== category)
    ].slice(0, 10);
    
    const currentTimeOfDay = this.getCurrentTimeOfDay();
    preferences.preferredTimeOfDay[currentTimeOfDay] = (preferences.preferredTimeOfDay[currentTimeOfDay] || 0) + 1;
    
    this.savePreferences(preferences);
  }

  // ブレンド使用を記録
  static recordBlendUsage(blendId: string, category: string): void {
    const preferences = this.loadPreferences();
    
    preferences.blendUsageCount[blendId] = (preferences.blendUsageCount[blendId] || 0) + 1;
    preferences.categoryPreferences[category] = (preferences.categoryPreferences[category] || 0) + 1;
    
    preferences.lastUsedCategories = [
      category,
      ...preferences.lastUsedCategories.filter(c => c !== category)
    ].slice(0, 10);
    
    const currentTimeOfDay = this.getCurrentTimeOfDay();
    preferences.preferredTimeOfDay[currentTimeOfDay] = (preferences.preferredTimeOfDay[currentTimeOfDay] || 0) + 1;
    
    this.savePreferences(preferences);
  }

  // 症状検索を記録
  static recordSymptomSearch(symptom: string): void {
    const preferences = this.loadPreferences();
    preferences.frequentSymptoms[symptom] = (preferences.frequentSymptoms[symptom] || 0) + 1;
    this.savePreferences(preferences);
  }

  // お気に入りオイルを追加/削除
  static toggleFavoriteOil(oilId: string): boolean {
    const preferences = this.loadPreferences();
    const index = preferences.favoriteOils.indexOf(oilId);
    
    if (index === -1) {
      preferences.favoriteOils.push(oilId);
      this.savePreferences(preferences);
      return true; // 追加された
    } else {
      preferences.favoriteOils.splice(index, 1);
      this.savePreferences(preferences);
      return false; // 削除された
    }
  }

  // お気に入りかチェック
  static isFavoriteOil(oilId: string): boolean {
    const preferences = this.loadPreferences();
    return preferences.favoriteOils.includes(oilId);
  }

  // よく使う症状を取得
  static getFrequentSymptoms(limit: number = 5): Array<{symptom: string, count: number}> {
    const preferences = this.loadPreferences();
    return Object.entries(preferences.frequentSymptoms)
      .map(([symptom, count]) => ({ symptom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // よく使うオイルを取得
  static getFrequentOils(limit: number = 10): Array<{oilId: string, count: number}> {
    const preferences = this.loadPreferences();
    return Object.entries(preferences.oilUsageCount)
      .map(([oilId, count]) => ({ oilId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // よく使うカテゴリを取得
  static getPreferredCategories(limit: number = 5): Array<{category: string, score: number}> {
    const preferences = this.loadPreferences();
    return Object.entries(preferences.categoryPreferences)
      .map(([category, score]) => ({ category, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // 好みに基づく推奨ブーストスコアを計算
  static getPreferenceBoostScore(itemId: string, itemType: 'oil' | 'recipe' | 'blend', category?: string): number {
    const preferences = this.loadPreferences();
    let boostScore = 0;

    // 使用履歴ブースト
    if (itemType === 'oil') {
      const usageCount = preferences.oilUsageCount[itemId] || 0;
      boostScore += Math.min(usageCount * 5, 25); // 最大25点
    } else if (itemType === 'recipe') {
      const usageCount = preferences.recipeUsageCount[itemId] || 0;
      boostScore += Math.min(usageCount * 5, 25);
    } else if (itemType === 'blend') {
      const usageCount = preferences.blendUsageCount[itemId] || 0;
      boostScore += Math.min(usageCount * 5, 25);
    }

    // お気に入りブースト
    if (itemType === 'oil' && preferences.favoriteOils.includes(itemId)) {
      boostScore += 15;
    }

    // カテゴリ好みブースト
    if (category) {
      const categoryScore = preferences.categoryPreferences[category] || 0;
      boostScore += Math.min(categoryScore * 2, 20); // 最大20点
    }

    // 最近使用したカテゴリブースト
    if (category && preferences.lastUsedCategories.includes(category)) {
      const recentIndex = preferences.lastUsedCategories.indexOf(category);
      boostScore += Math.max(10 - recentIndex * 2, 2); // 最近ほど高いブースト
    }

    // 時間帯マッチングブースト
    const currentTimeOfDay = this.getCurrentTimeOfDay();
    const timeOfDayPreference = preferences.preferredTimeOfDay[currentTimeOfDay] || 0;
    if (timeOfDayPreference > 3) {
      boostScore += 10; // よく使う時間帯なら追加ブースト
    }

    return boostScore;
  }

  // 現在の時間帯を取得
  private static getCurrentTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  // 統計データを取得
  static getStatistics(): {
    totalOilUsage: number;
    totalRecipeUsage: number;
    totalBlendUsage: number;
    favoriteCount: number;
    topCategory: string | null;
  } {
    const preferences = this.loadPreferences();
    
    const totalOilUsage = Object.values(preferences.oilUsageCount).reduce((sum, count) => sum + count, 0);
    const totalRecipeUsage = Object.values(preferences.recipeUsageCount).reduce((sum, count) => sum + count, 0);
    const totalBlendUsage = Object.values(preferences.blendUsageCount).reduce((sum, count) => sum + count, 0);
    
    const topCategory = Object.entries(preferences.categoryPreferences)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    return {
      totalOilUsage,
      totalRecipeUsage,
      totalBlendUsage,
      favoriteCount: preferences.favoriteOils.length,
      topCategory
    };
  }

  // データをリセット
  static resetPreferences(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}