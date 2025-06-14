import { BlendRecipe } from '../types/BlendRecipe';
import { BlendSuggestion } from '../types/FragranceBlend';
import { getEnhancedOilById } from '../data/enhancedOils';

export interface UserSafetyProfile {
  isPregnant: boolean;
  pregnancyTrimester: 1 | 2 | 3 | null;
  hasBaby: boolean;
  babyAgeMonths: number;
  hasPets: boolean;
  petTypes: ('cat' | 'dog')[];
  willExposeToSun: boolean;
  hasHighBloodPressure: boolean;
  age: number;
}

export interface SafetyWarning {
  type: 'danger' | 'warning' | 'info';
  category: 'pregnancy' | 'baby' | 'pets' | 'photosensitivity' | 'medical' | 'age';
  message: string;
  oilId: string;
  oilName: string;
}

export interface RecipeSafetyResult {
  isSafe: boolean;
  safetyLevel: 'safe' | 'caution' | 'danger';
  warnings: SafetyWarning[];
  recommendedAlternatives?: string[];
}

export class RecipeSafetyEvaluator {
  static evaluateRecipe(recipe: BlendRecipe, userProfile: UserSafetyProfile): RecipeSafetyResult {
    const warnings: SafetyWarning[] = [];
    let highestRiskLevel: 'safe' | 'caution' | 'danger' = 'safe';

    for (const oilInRecipe of recipe.oils) {
      const enhancedOil = getEnhancedOilById(oilInRecipe.oilId);
      if (enhancedOil) {
        const oilWarnings = this.evaluateOilSafety(enhancedOil.id, enhancedOil.nameJa, enhancedOil.safety, userProfile);
        warnings.push(...oilWarnings);
        
        // リスクレベルの更新
        for (const warning of oilWarnings) {
          if (warning.type === 'danger' && highestRiskLevel !== 'danger') {
            highestRiskLevel = 'danger';
          } else if (warning.type === 'warning' && highestRiskLevel === 'safe') {
            highestRiskLevel = 'caution';
          }
        }
      }
    }

    return {
      isSafe: highestRiskLevel === 'safe',
      safetyLevel: highestRiskLevel,
      warnings,
      recommendedAlternatives: this.getAlternatives(recipe, warnings)
    };
  }

  static evaluateBlendSuggestion(blend: BlendSuggestion, userProfile: UserSafetyProfile): RecipeSafetyResult {
    const warnings: SafetyWarning[] = [];
    let highestRiskLevel: 'safe' | 'caution' | 'danger' = 'safe';

    for (const oilInBlend of blend.oils) {
      const enhancedOil = getEnhancedOilById(oilInBlend.oilId);
      if (enhancedOil) {
        const oilWarnings = this.evaluateOilSafety(enhancedOil.id, enhancedOil.nameJa, enhancedOil.safety, userProfile);
        warnings.push(...oilWarnings);
        
        // リスクレベルの更新
        for (const warning of oilWarnings) {
          if (warning.type === 'danger' && highestRiskLevel !== 'danger') {
            highestRiskLevel = 'danger';
          } else if (warning.type === 'warning' && highestRiskLevel === 'safe') {
            highestRiskLevel = 'caution';
          }
        }
      }
    }

    return {
      isSafe: highestRiskLevel === 'safe',
      safetyLevel: highestRiskLevel,
      warnings,
      recommendedAlternatives: this.getBlendAlternatives(blend, warnings)
    };
  }

  private static evaluateOilSafety(oilId: string, oilName: string, safety: any, userProfile: UserSafetyProfile): SafetyWarning[] {
    const warnings: SafetyWarning[] = [];

    // 妊娠中の安全性チェック
    if (userProfile.isPregnant) {
      if (!safety.pregnancy.safe) {
        warnings.push({
          type: 'danger',
          category: 'pregnancy',
          message: `妊娠中は使用できません`,
          oilId,
          oilName
        });
      } else if (userProfile.pregnancyTrimester === 1 && safety.pregnancy.notes.includes('第2・3トリメスター')) {
        warnings.push({
          type: 'warning',
          category: 'pregnancy',
          message: `第1トリメスターでの使用は推奨されません`,
          oilId,
          oilName
        });
      }
    }

    // 赤ちゃんの安全性チェック
    if (userProfile.hasBaby) {
      if (!safety.baby.safe) {
        warnings.push({
          type: 'danger',
          category: 'baby',
          message: `赤ちゃんには使用できません: ${safety.baby.ageRestriction}`,
          oilId,
          oilName
        });
      } else {
        const ageRestriction = this.extractAgeFromRestriction(safety.baby.ageRestriction);
        if (userProfile.babyAgeMonths < ageRestriction) {
          warnings.push({
            type: 'warning',
            category: 'baby',
            message: `赤ちゃんの月齢が不足: ${safety.baby.ageRestriction}`,
            oilId,
            oilName
          });
        }
      }
    }

    // 光毒性チェック
    if (userProfile.willExposeToSun && safety.photosensitivity.sensitive) {
      warnings.push({
        type: 'warning',
        category: 'photosensitivity',
        message: `使用後${safety.photosensitivity.hours}時間は日光を避けてください`,
        oilId,
        oilName
      });
    }

    // ペット安全性チェック
    if (userProfile.hasPets) {
      if (userProfile.petTypes.includes('cat') && safety.petSafety.includes('猫への使用は避ける')) {
        warnings.push({
          type: 'warning',
          category: 'pets',
          message: `猫がいる環境では使用を避けてください`,
          oilId,
          oilName
        });
      }
      if (userProfile.petTypes.includes('dog') && safety.petSafety.includes('犬への使用も注意')) {
        warnings.push({
          type: 'info',
          category: 'pets',
          message: `犬がいる場合は十分に希釈してください`,
          oilId,
          oilName
        });
      }
    }

    // 高血圧チェック（ローズマリー用）
    if (userProfile.hasHighBloodPressure && oilName === 'ローズマリー') {
      warnings.push({
        type: 'warning',
        category: 'medical',
        message: `高血圧の方は使用前に医師にご相談ください`,
        oilId,
        oilName
      });
    }

    // 年齢制限チェック
    if (userProfile.age < 6 && (oilName === 'ペパーミント' || oilName === 'ローズマリー')) {
      warnings.push({
        type: 'danger',
        category: 'age',
        message: `6歳未満の方は使用できません`,
        oilId,
        oilName
      });
    }

    return warnings;
  }

  private static extractAgeFromRestriction(restriction: string): number {
    const monthMatch = restriction.match(/(\d+)ヶ月/);
    if (monthMatch) return parseInt(monthMatch[1]);
    
    const yearMatch = restriction.match(/(\d+)歳/);
    if (yearMatch) return parseInt(yearMatch[1]) * 12;
    
    return 0;
  }

  private static getAlternatives(recipe: BlendRecipe, warnings: SafetyWarning[]): string[] {
    const alternatives: string[] = [];
    const dangerousOils = warnings.filter(w => w.type === 'danger').map(w => w.oilName);
    
    if (dangerousOils.includes('ペパーミント')) {
      alternatives.push('ペパーミントの代わりにスペアミントを使用してください');
    }
    if (dangerousOils.includes('ユーカリ')) {
      alternatives.push('ユーカリの代わりにティーツリーを少量使用してください');
    }
    if (dangerousOils.includes('ローズマリー')) {
      alternatives.push('ローズマリーの代わりにラベンダーを使用してください');
    }

    return alternatives;
  }

  private static getBlendAlternatives(blend: BlendSuggestion, warnings: SafetyWarning[]): string[] {
    const alternatives: string[] = [];
    const dangerousOils = warnings.filter(w => w.type === 'danger').map(w => w.oilName);
    
    if (dangerousOils.length > 0) {
      alternatives.push('より安全なブレンドを「安全な香りブレンド」カテゴリから選択してください');
      alternatives.push('危険なオイルを除いた部分的なブレンドをお試しください');
    }

    return alternatives;
  }

  // 安全なレシピフィルタリング
  static filterSafeRecipes(recipes: BlendRecipe[], userProfile: UserSafetyProfile): BlendRecipe[] {
    return recipes.filter(recipe => {
      const result = this.evaluateRecipe(recipe, userProfile);
      return result.safetyLevel !== 'danger';
    });
  }

  // 安全なブレンドフィルタリング
  static filterSafeBlends(blends: BlendSuggestion[], userProfile: UserSafetyProfile): BlendSuggestion[] {
    return blends.filter(blend => {
      const result = this.evaluateBlendSuggestion(blend, userProfile);
      return result.safetyLevel !== 'danger';
    });
  }

  // ユーザープロファイルのデフォルト値
  static getDefaultUserProfile(): UserSafetyProfile {
    return {
      isPregnant: false,
      pregnancyTrimester: null,
      hasBaby: false,
      babyAgeMonths: 0,
      hasPets: false,
      petTypes: [],
      willExposeToSun: false,
      hasHighBloodPressure: false,
      age: 25
    };
  }
}