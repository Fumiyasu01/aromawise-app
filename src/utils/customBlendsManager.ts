import { CustomBlend } from '../types/CustomBlend';

const STORAGE_KEY = 'aromawise_custom_blends';
const PUBLIC_BLENDS_KEY = 'aromawise_public_blends';
const USER_LIKES_KEY = 'aromawise_blend_likes';

export class CustomBlendsManager {
  // すべてのブレンドを取得
  static getAllBlends(): CustomBlend[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const blends = JSON.parse(stored);
      return blends.map((blend: any) => ({
        ...blend,
        createdAt: new Date(blend.createdAt),
        updatedAt: new Date(blend.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading blends:', error);
      return [];
    }
  }

  // ユーザーのブレンドを取得
  static getUserBlends(userId: string): CustomBlend[] {
    const allBlends = this.getAllBlends();
    return allBlends.filter(blend => blend.createdBy === userId);
  }

  // 公開ブレンドを取得
  static getPublicBlends(): CustomBlend[] {
    const allBlends = this.getAllBlends();
    return allBlends.filter(blend => blend.isPublic);
  }

  // ブレンドを作成
  static createBlend(blendData: Partial<CustomBlend>, userId: string): CustomBlend {
    const newBlend: CustomBlend = {
      id: Date.now().toString(),
      name: blendData.name || '',
      description: blendData.description || '',
      purpose: blendData.purpose || '',
      ingredients: blendData.ingredients || [],
      totalDrops: blendData.totalDrops || 0,
      dilutionRatio: blendData.dilutionRatio || 2,
      carrierOil: blendData.carrierOil || 'jojoba',
      carrierAmount: blendData.carrierAmount || 10,
      category: blendData.category || 'custom',
      tags: blendData.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isPublic: blendData.isPublic || false,
      likes: 0,
      instructions: blendData.instructions,
      precautions: blendData.precautions
    };

    const allBlends = this.getAllBlends();
    allBlends.push(newBlend);
    this.saveBlends(allBlends);

    return newBlend;
  }

  // ブレンドを更新
  static updateBlend(updatedBlend: CustomBlend): void {
    const allBlends = this.getAllBlends();
    const index = allBlends.findIndex(b => b.id === updatedBlend.id);
    
    if (index !== -1) {
      allBlends[index] = {
        ...updatedBlend,
        updatedAt: new Date()
      };
      this.saveBlends(allBlends);
    }
  }

  // ブレンドを削除
  static deleteBlend(blendId: string): void {
    const allBlends = this.getAllBlends();
    const filteredBlends = allBlends.filter(b => b.id !== blendId);
    this.saveBlends(filteredBlends);
  }

  // ブレンドをコピー
  static duplicateBlend(blendId: string, userId: string): CustomBlend | null {
    const originalBlend = this.getBlendById(blendId);
    if (!originalBlend) return null;

    const newBlend: CustomBlend = {
      ...originalBlend,
      id: Date.now().toString(),
      name: `${originalBlend.name} (コピー)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isPublic: false,
      likes: 0
    };

    const allBlends = this.getAllBlends();
    allBlends.push(newBlend);
    this.saveBlends(allBlends);

    return newBlend;
  }

  // IDでブレンドを取得
  static getBlendById(blendId: string): CustomBlend | null {
    const allBlends = this.getAllBlends();
    return allBlends.find(b => b.id === blendId) || null;
  }

  // カテゴリーでフィルター
  static getBlendsByCategory(category: string): CustomBlend[] {
    const allBlends = this.getAllBlends();
    return allBlends.filter(b => b.category === category);
  }

  // タグでフィルター
  static getBlendsByTag(tag: string): CustomBlend[] {
    const allBlends = this.getAllBlends();
    return allBlends.filter(b => b.tags.includes(tag));
  }

  // ブレンドを検索
  static searchBlends(query: string): CustomBlend[] {
    const allBlends = this.getAllBlends();
    const searchTerm = query.toLowerCase();
    
    return allBlends.filter(blend => 
      blend.name.toLowerCase().includes(searchTerm) ||
      blend.description.toLowerCase().includes(searchTerm) ||
      blend.purpose.toLowerCase().includes(searchTerm) ||
      blend.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // いいねを切り替え
  static toggleLike(blendId: string, userId: string): void {
    const userLikes = this.getUserLikes(userId);
    const allBlends = this.getAllBlends();
    const blend = allBlends.find(b => b.id === blendId);
    
    if (!blend) return;

    if (userLikes.includes(blendId)) {
      // いいねを取り消し
      const index = userLikes.indexOf(blendId);
      userLikes.splice(index, 1);
      blend.likes = Math.max(0, blend.likes - 1);
    } else {
      // いいねを追加
      userLikes.push(blendId);
      blend.likes = blend.likes + 1;
    }

    this.saveUserLikes(userId, userLikes);
    this.saveBlends(allBlends);
  }

  // ユーザーのいいねを取得
  static getUserLikes(userId: string): string[] {
    try {
      const stored = localStorage.getItem(`${USER_LIKES_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // 人気のブレンドを取得
  static getPopularBlends(limit: number = 10): CustomBlend[] {
    const publicBlends = this.getPublicBlends();
    return publicBlends
      .sort((a, b) => b.likes - a.likes)
      .slice(0, limit);
  }

  // 最近のブレンドを取得
  static getRecentBlends(limit: number = 10): CustomBlend[] {
    const allBlends = this.getAllBlends();
    return allBlends
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // ブレンドをインポート
  static importBlend(blendData: any, userId: string): CustomBlend | null {
    try {
      const blend: CustomBlend = {
        ...blendData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        isPublic: false,
        likes: 0
      };

      const allBlends = this.getAllBlends();
      allBlends.push(blend);
      this.saveBlends(allBlends);

      return blend;
    } catch (error) {
      console.error('Error importing blend:', error);
      return null;
    }
  }

  // ブレンドをエクスポート
  static exportBlend(blendId: string): string | null {
    const blend = this.getBlendById(blendId);
    if (!blend) return null;

    const exportData = {
      ...blend,
      id: undefined,
      createdBy: undefined,
      likes: undefined,
      isPublic: undefined
    };

    return JSON.stringify(exportData, null, 2);
  }

  // 統計情報を取得
  static getStatistics(userId?: string): {
    totalBlends: number;
    publicBlends: number;
    totalLikes: number;
    mostUsedOils: { oilId: string; count: number }[];
    popularCategories: { category: string; count: number }[];
  } {
    const blends = userId ? this.getUserBlends(userId) : this.getAllBlends();
    
    const oilUsage: { [key: string]: number } = {};
    const categoryCount: { [key: string]: number } = {};
    let totalLikes = 0;
    let publicCount = 0;

    blends.forEach(blend => {
      // オイル使用回数
      blend.ingredients.forEach(ing => {
        oilUsage[ing.oilId] = (oilUsage[ing.oilId] || 0) + 1;
      });

      // カテゴリー統計
      categoryCount[blend.category] = (categoryCount[blend.category] || 0) + 1;

      // その他の統計
      totalLikes += blend.likes;
      if (blend.isPublic) publicCount++;
    });

    const mostUsedOils = Object.entries(oilUsage)
      .map(([oilId, count]) => ({ oilId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const popularCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalBlends: blends.length,
      publicBlends: publicCount,
      totalLikes,
      mostUsedOils,
      popularCategories
    };
  }

  // プライベートメソッド
  private static saveBlends(blends: CustomBlend[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blends));
    } catch (error) {
      console.error('Error saving blends:', error);
    }
  }

  private static saveUserLikes(userId: string, likes: string[]): void {
    try {
      localStorage.setItem(`${USER_LIKES_KEY}_${userId}`, JSON.stringify(likes));
    } catch (error) {
      console.error('Error saving user likes:', error);
    }
  }
}