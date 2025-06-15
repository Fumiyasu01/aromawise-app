import { CustomBlend, BlendCalculation, DROP_TO_ML, DILUTION_GUIDELINES } from '../types/CustomBlend';
import { oilsData } from '../data/oils';
import { getEnhancedOilById } from '../data/enhancedOils';

export class BlendCalculator {
  // ブレンドの計算
  static calculate(blend: CustomBlend): BlendCalculation {
    const totalDrops = blend.ingredients.reduce((sum, ing) => sum + ing.drops, 0);
    const totalEssentialOilVolume = totalDrops * DROP_TO_ML;
    const carrierVolume = blend.carrierAmount || 10; // デフォルト10ml
    const totalVolume = totalEssentialOilVolume + carrierVolume;
    const actualDilution = (totalEssentialOilVolume / totalVolume) * 100;

    const ingredients = blend.ingredients.map(ing => {
      const basicOil = oilsData.find(o => o.id === ing.oilId);
      const enhancedOil = !basicOil ? getEnhancedOilById(ing.oilId) : null;
      const oilName = basicOil?.name || enhancedOil?.nameJa || 'Unknown';
      return {
        oilId: ing.oilId,
        oilName: oilName,
        drops: ing.drops,
        volume: ing.drops * DROP_TO_ML,
        percentage: (ing.drops / totalDrops) * 100,
        cost: 0 // TODO: コスト計算の実装
      };
    });

    const safetyWarnings = this.checkSafety(blend);

    return {
      totalVolume,
      ingredients,
      dilutionPercentage: actualDilution,
      safetyWarnings,
      estimatedCost: 0 // TODO: コスト計算の実装
    };
  }

  // 安全性チェック
  static checkSafety(blend: CustomBlend): string[] {
    const warnings: string[] = [];
    const calculation = this.calculate(blend);

    // 希釈率チェック
    if (calculation.dilutionPercentage > 5) {
      warnings.push('希釈率が高すぎます（5%以上）。肌への刺激に注意してください。');
    }

    // 特定のオイルの組み合わせチェック
    const hasPhotosensitive = blend.ingredients.some(ing => {
      const oil = oilsData.find(o => o.id === ing.oilId);
      return oil?.name.includes('レモン') || oil?.name.includes('グレープフルーツ') || oil?.name.includes('ベルガモット');
    });

    if (hasPhotosensitive) {
      warnings.push('光毒性のあるオイルが含まれています。使用後は直射日光を避けてください。');
    }

    // 妊娠中の使用チェック
    const hasPregnancyWarning = blend.ingredients.some(ing => {
      const oil = oilsData.find(o => o.id === ing.oilId);
      return oil && !oil.safetyInfo.pregnancy;
    });

    if (hasPregnancyWarning) {
      warnings.push('妊娠中の使用に注意が必要なオイルが含まれています。');
    }

    // 子供への使用チェック
    const hasChildWarning = blend.ingredients.some(ing => {
      const oil = oilsData.find(o => o.id === ing.oilId);
      return oil && !oil.safetyInfo.children;
    });

    if (hasChildWarning) {
      warnings.push('子供への使用に注意が必要なオイルが含まれています。');
    }

    return warnings;
  }

  // 希釈率から必要なキャリアオイル量を計算
  static calculateCarrierAmount(totalDrops: number, targetDilution: number): number {
    const essentialOilVolume = totalDrops * DROP_TO_ML;
    const totalVolume = essentialOilVolume / (targetDilution / 100);
    const carrierVolume = totalVolume - essentialOilVolume;
    return Math.round(carrierVolume * 10) / 10; // 小数点1位まで
  }

  // 推奨希釈率を取得
  static getRecommendedDilution(purpose: 'baby' | 'child' | 'adult_daily' | 'adult_therapeutic' | 'adult_acute'): { min: number; max: number; label: string } {
    return DILUTION_GUIDELINES[purpose];
  }

  // ブレンドのバランスチェック（トップ・ミドル・ベースノート）
  static checkBlendBalance(blend: CustomBlend): { balanced: boolean; recommendation?: string } {
    const noteCount = { top: 0, middle: 0, base: 0 };
    
    blend.ingredients.forEach(ing => {
      if (ing.note) {
        noteCount[ing.note]++;
      }
    });

    const total = blend.ingredients.length;
    const topRatio = noteCount.top / total;
    const middleRatio = noteCount.middle / total;
    const baseRatio = noteCount.base / total;

    // 理想的なバランス: トップ 30%, ミドル 50%, ベース 20%
    if (topRatio >= 0.2 && topRatio <= 0.4 && 
        middleRatio >= 0.3 && middleRatio <= 0.6 && 
        baseRatio >= 0.1 && baseRatio <= 0.3) {
      return { balanced: true };
    }

    let recommendation = 'ブレンドのバランスを改善できます: ';
    if (topRatio < 0.2) recommendation += 'トップノートを追加、';
    if (middleRatio < 0.3) recommendation += 'ミドルノートを追加、';
    if (baseRatio < 0.1) recommendation += 'ベースノートを追加、';
    
    return { 
      balanced: false, 
      recommendation: recommendation.slice(0, -1) // 最後のカンマを削除
    };
  }

  // ブレンドの保存期間を推定
  static estimateShelfLife(blend: CustomBlend): { months: number; factors: string[] } {
    let shortestLife = 24; // デフォルト24ヶ月
    const factors: string[] = [];

    blend.ingredients.forEach(ing => {
      const oil = oilsData.find(o => o.id === ing.oilId);
      if (oil?.name.includes('柑橘') || oil?.category === 'citrus') {
        shortestLife = Math.min(shortestLife, 12);
        factors.push('柑橘系オイルは酸化しやすい');
      }
    });

    if (blend.carrierOil === 'grapeseed') {
      shortestLife = Math.min(shortestLife, 6);
      factors.push('グレープシードオイルは酸化しやすい');
    }

    return { months: shortestLife, factors };
  }

  // ブレンドレシピのバリデーション
  static validateBlend(blend: Partial<CustomBlend>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!blend.name || blend.name.trim().length === 0) {
      errors.push('ブレンド名を入力してください');
    }

    if (!blend.ingredients || blend.ingredients.length < 2) {
      errors.push('最低2種類のオイルを選択してください');
    }

    if (blend.ingredients && blend.ingredients.length > 6) {
      errors.push('オイルは最大6種類までです');
    }

    const totalDrops = blend.ingredients?.reduce((sum, ing) => sum + ing.drops, 0) || 0;
    if (totalDrops > 30) {
      errors.push('合計滴数は30滴以下にしてください');
    }

    blend.ingredients?.forEach((ing, index) => {
      if (ing.drops <= 0) {
        errors.push(`${index + 1}番目のオイルの滴数を入力してください`);
      }
      if (ing.drops > 10) {
        errors.push(`${index + 1}番目のオイルの滴数は10滴以下にしてください`);
      }
    });

    if (!blend.carrierOil) {
      errors.push('キャリアオイルを選択してください');
    }

    if (!blend.carrierAmount || blend.carrierAmount <= 0) {
      errors.push('キャリアオイルの量を入力してください');
    }

    return { valid: errors.length === 0, errors };
  }
}