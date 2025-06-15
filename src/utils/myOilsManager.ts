import { MyOilData, MyOilUsage, MyOilInventory, CustomBlendRecipe } from '../types/MyOil';
import { Oil } from '../types/Oil';

const MY_OILS_STORAGE_KEY = 'aromawise_my_oils';
const CUSTOM_BLENDS_STORAGE_KEY = 'aromawise_custom_blends';

export class MyOilsManager {
  // マイオイルの取得
  static getMyOils(): MyOilData[] {
    const stored = localStorage.getItem(MY_OILS_STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const oils = JSON.parse(stored);
      // 日付の復元
      return oils.map((oil: any) => ({
        ...oil,
        inventory: {
          ...oil.inventory,
          purchaseDate: new Date(oil.inventory.purchaseDate),
          openedDate: oil.inventory.openedDate ? new Date(oil.inventory.openedDate) : undefined,
          expirationDate: oil.inventory.expirationDate ? new Date(oil.inventory.expirationDate) : undefined
        },
        usageHistory: oil.usageHistory.map((usage: any) => ({
          ...usage,
          date: new Date(usage.date)
        })),
        lastUsed: oil.lastUsed ? new Date(oil.lastUsed) : undefined
      }));
    } catch (error) {
      console.error('Error parsing my oils:', error);
      return [];
    }
  }

  // マイオイルの保存
  static saveMyOils(oils: MyOilData[]): void {
    localStorage.setItem(MY_OILS_STORAGE_KEY, JSON.stringify(oils));
  }

  // オイルの追加
  static addOil(oil: Oil, inventory: MyOilInventory): MyOilData {
    const myOils = this.getMyOils();
    
    const newMyOil: MyOilData = {
      id: `my_oil_${Date.now()}`,
      oilId: oil.id,
      oil,
      inventory,
      customTags: [],
      personalNotes: '',
      isFavorite: false,
      usageHistory: [],
      totalUsageCount: 0
    };
    
    myOils.push(newMyOil);
    this.saveMyOils(myOils);
    
    return newMyOil;
  }

  // オイルの更新
  static updateOil(id: string, updates: Partial<MyOilData>): void {
    const myOils = this.getMyOils();
    const index = myOils.findIndex(oil => oil.id === id);
    
    if (index !== -1) {
      myOils[index] = { ...myOils[index], ...updates };
      this.saveMyOils(myOils);
    }
  }

  // オイルの削除
  static removeOil(id: string): void {
    const myOils = this.getMyOils();
    const filtered = myOils.filter(oil => oil.id !== id);
    this.saveMyOils(filtered);
  }

  // 使用履歴の追加
  static addUsage(myOilId: string, usage: Omit<MyOilUsage, 'id'>): void {
    const myOils = this.getMyOils();
    const oil = myOils.find(o => o.id === myOilId);
    
    if (oil) {
      const newUsage: MyOilUsage = {
        ...usage,
        id: `usage_${Date.now()}`,
        date: new Date(usage.date)
      };
      
      oil.usageHistory.push(newUsage);
      oil.totalUsageCount++;
      oil.lastUsed = newUsage.date;
      
      // 平均効果の再計算
      const totalEffectiveness = oil.usageHistory.reduce((sum, u) => sum + u.effectiveness, 0);
      oil.averageEffectiveness = totalEffectiveness / oil.usageHistory.length;
      
      this.saveMyOils(myOils);
    }
  }

  // 在庫の更新
  static updateInventory(myOilId: string, updates: Partial<MyOilInventory>): void {
    const myOils = this.getMyOils();
    const oil = myOils.find(o => o.id === myOilId);
    
    if (oil) {
      oil.inventory = { ...oil.inventory, ...updates };
      this.saveMyOils(myOils);
    }
  }

  // タグの追加/削除
  static toggleTag(myOilId: string, tag: string): void {
    const myOils = this.getMyOils();
    const oil = myOils.find(o => o.id === myOilId);
    
    if (oil) {
      const index = oil.customTags.indexOf(tag);
      if (index === -1) {
        oil.customTags.push(tag);
      } else {
        oil.customTags.splice(index, 1);
      }
      this.saveMyOils(myOils);
    }
  }

  // お気に入りの切り替え
  static toggleFavorite(myOilId: string): void {
    const myOils = this.getMyOils();
    const oil = myOils.find(o => o.id === myOilId);
    
    if (oil) {
      oil.isFavorite = !oil.isFavorite;
      this.saveMyOils(myOils);
    }
  }

  // 期限切れのチェック
  static getExpiringOils(daysAhead: number = 30): MyOilData[] {
    const myOils = this.getMyOils();
    const today = new Date();
    const checkDate = new Date();
    checkDate.setDate(today.getDate() + daysAhead);
    
    return myOils.filter(oil => {
      if (!oil.inventory.expirationDate) return false;
      return oil.inventory.expirationDate <= checkDate;
    });
  }

  // 在庫が少ないオイル
  static getLowStockOils(threshold: number = 5): MyOilData[] {
    const myOils = this.getMyOils();
    return myOils.filter(oil => oil.inventory.quantity <= threshold);
  }

  // カスタムブレンドの管理
  static getCustomBlends(): CustomBlendRecipe[] {
    const stored = localStorage.getItem(CUSTOM_BLENDS_STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const blends = JSON.parse(stored);
      return blends.map((blend: any) => ({
        ...blend,
        createdDate: new Date(blend.createdDate),
        lastUsed: blend.lastUsed ? new Date(blend.lastUsed) : undefined
      }));
    } catch (error) {
      console.error('Error parsing custom blends:', error);
      return [];
    }
  }

  static saveCustomBlend(blend: Omit<CustomBlendRecipe, 'id' | 'createdDate'>): CustomBlendRecipe {
    const blends = this.getCustomBlends();
    const newBlend: CustomBlendRecipe = {
      ...blend,
      id: `blend_${Date.now()}`,
      createdDate: new Date()
    };
    
    blends.push(newBlend);
    localStorage.setItem(CUSTOM_BLENDS_STORAGE_KEY, JSON.stringify(blends));
    
    return newBlend;
  }

  // 統計データの取得
  static getStatistics() {
    const myOils = this.getMyOils();
    
    return {
      totalOils: myOils.length,
      totalValue: myOils.reduce((sum, oil) => sum + (oil.inventory.purchasePrice || 0), 0),
      favoriteOils: myOils.filter(oil => oil.isFavorite).length,
      expiringOils: this.getExpiringOils().length,
      lowStockOils: this.getLowStockOils().length,
      totalUsage: myOils.reduce((sum, oil) => sum + oil.totalUsageCount, 0),
      averageEffectiveness: myOils.reduce((sum, oil) => {
        return sum + (oil.averageEffectiveness || 0);
      }, 0) / myOils.filter(oil => oil.averageEffectiveness).length || 0
    };
  }

  // 既存のシンプルなオイルリストから移行
  static migrateFromSimpleOils(simpleOilIds: string[], oils: Oil[]): void {
    const existingMyOils = this.getMyOils();
    
    simpleOilIds.forEach(oilId => {
      // すでに存在する場合はスキップ
      if (existingMyOils.some(mo => mo.oilId === oilId)) return;
      
      const oil = oils.find(o => o.id === oilId);
      if (oil) {
        this.addOil(oil, {
          quantity: 1,
          unit: 'bottles',
          purchaseDate: new Date(),
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1年後
        });
      }
    });
  }
}