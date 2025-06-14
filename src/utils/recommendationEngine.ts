import { 
  RecommendationRequest, 
  RecommendationResult, 
  RecommendationScore, 
  SymptomCategory,
  TimeOfDay,
  Season
} from '../types/Recommendation';
import { symptomMappings, timeBasedMappings, seasonalMappings } from '../data/symptomMappings';
import { enhancedOils } from '../data/enhancedOils';
import { blendRecipes } from '../data/blendRecipes';
import { blendSuggestions } from '../data/blendCompatibility';
import { RecipeSafetyEvaluator } from './recipeSafety';
import { UserPreferenceManager } from './userPreferences';

export class RecommendationEngine {
  
  static generateRecommendations(request: RecommendationRequest): RecommendationResult {
    let oilScores: Map<string, number> = new Map();
    let recipeScores: Map<string, number> = new Map();
    let blendScores: Map<string, number> = new Map();
    
    let reasons: string[] = [];
    let confidence = 50; // Base confidence

    // 症状ベースのスコアリング
    if (request.symptoms && request.symptoms.length > 0) {
      const symptomResults = this.processSymptoms(request.symptoms);
      this.mergeScores(oilScores, symptomResults.oilScores);
      this.mergeScores(recipeScores, symptomResults.recipeScores);
      this.mergeScores(blendScores, symptomResults.blendScores);
      reasons.push(...symptomResults.reasons);
      confidence += 20;
    }

    // 時間帯ベースのブースト
    if (request.timeOfDay) {
      const timeResults = this.processTimeOfDay(request.timeOfDay, oilScores, recipeScores, blendScores);
      reasons.push(timeResults.reason);
      confidence += 10;
    }

    // 季節ベースのブースト
    if (request.season) {
      const seasonResults = this.processSeason(request.season, oilScores, recipeScores, blendScores);
      reasons.push(seasonResults.reason);
      confidence += 10;
    }

    // 利用可能なオイルでブースト
    if (request.availableOils && request.availableOils.length > 0) {
      this.boostAvailableItems(oilScores, recipeScores, blendScores, request.availableOils);
      reasons.push('お持ちのオイルで作れるものを優先しました');
      confidence += 15;
    }

    // 安全性フィルタリング
    if (request.userSafetyProfile) {
      this.applySafetyFiltering(oilScores, recipeScores, blendScores, request.userSafetyProfile);
      reasons.push('あなたの安全性プロファイルに基づいて調整しました');
      confidence += 10;
    }

    // ユーザー好み学習による調整
    const preferenceResults = this.applyUserPreferences(oilScores, recipeScores, blendScores);
    if (preferenceResults.applied) {
      reasons.push(preferenceResults.reason);
      confidence += preferenceResults.confidenceBoost;
    }

    // 結果を生成
    const result: RecommendationResult = {
      oils: this.convertToRecommendationScores(oilScores, 'oil').slice(0, 5),
      recipes: this.convertToRecommendationScores(recipeScores, 'recipe').slice(0, 5),
      blends: this.convertToRecommendationScores(blendScores, 'blend').slice(0, 5),
      primaryReason: reasons.length > 0 ? reasons[0] : '総合的な推奨',
      confidence: Math.min(confidence, 100)
    };

    return result;
  }

  private static processSymptoms(symptoms: SymptomCategory[]) {
    let oilScores: Map<string, number> = new Map();
    let recipeScores: Map<string, number> = new Map();
    let blendScores: Map<string, number> = new Map();
    let reasons: string[] = [];

    symptoms.forEach(symptom => {
      const mapping = symptomMappings.find(m => m.symptom === symptom);
      if (mapping) {
        reasons.push(`${mapping.nameJa}に効果的な組み合わせを選択`);
        
        // オイルスコア
        mapping.recommendedOils.forEach(oil => {
          const currentScore = oilScores.get(oil.oilId) || 0;
          oilScores.set(oil.oilId, currentScore + oil.score);
        });

        // レシピスコア
        mapping.recommendedRecipeCategories.forEach(category => {
          const recipes = blendRecipes.filter(r => r.category === category.category);
          recipes.forEach(recipe => {
            const currentScore = recipeScores.get(recipe.id) || 0;
            recipeScores.set(recipe.id, currentScore + category.score);
          });
        });

        // ブレンドスコア
        mapping.recommendedBlendCategories.forEach(category => {
          const blends = blendSuggestions.filter(b => b.category === category.category);
          blends.forEach(blend => {
            const currentScore = blendScores.get(blend.id) || 0;
            blendScores.set(blend.id, currentScore + category.score);
          });
        });
      }
    });

    return { oilScores, recipeScores, blendScores, reasons };
  }

  private static processTimeOfDay(
    timeOfDay: TimeOfDay, 
    oilScores: Map<string, number>,
    recipeScores: Map<string, number>,
    blendScores: Map<string, number>
  ) {
    const timeMapping = timeBasedMappings.find(m => m.timeOfDay === timeOfDay);
    if (!timeMapping) {
      return { reason: '' };
    }

    // レシピカテゴリブースト
    timeMapping.boostCategories.forEach(boost => {
      const recipes = blendRecipes.filter(r => r.category === boost.category);
      recipes.forEach(recipe => {
        const currentScore = recipeScores.get(recipe.id) || 0;
        recipeScores.set(recipe.id, currentScore * boost.multiplier);
      });

      const blends = blendSuggestions.filter(b => b.category === boost.category);
      blends.forEach(blend => {
        const currentScore = blendScores.get(blend.id) || 0;
        blendScores.set(blend.id, currentScore * boost.multiplier);
      });
    });

    return { reason: `${timeMapping.nameJa}の時間帯に適した選択` };
  }

  private static processSeason(
    season: Season,
    oilScores: Map<string, number>,
    recipeScores: Map<string, number>,
    blendScores: Map<string, number>
  ) {
    const seasonMapping = seasonalMappings.find(m => m.season === season);
    if (!seasonMapping) {
      return { reason: '' };
    }

    // カテゴリブースト
    seasonMapping.boostCategories.forEach(boost => {
      const recipes = blendRecipes.filter(r => r.category === boost.category);
      recipes.forEach(recipe => {
        const currentScore = recipeScores.get(recipe.id) || 0;
        recipeScores.set(recipe.id, currentScore * boost.multiplier);
      });

      const blends = blendSuggestions.filter(b => b.category === boost.category);
      blends.forEach(blend => {
        const currentScore = blendScores.get(blend.id) || 0;
        blendScores.set(blend.id, currentScore * boost.multiplier);
      });
    });

    return { reason: `${seasonMapping.nameJa}の季節に人気の組み合わせ` };
  }

  private static boostAvailableItems(
    oilScores: Map<string, number>,
    recipeScores: Map<string, number>,
    blendScores: Map<string, number>,
    availableOils: string[]
  ) {
    // 利用可能なオイルのスコアブースト
    availableOils.forEach(oilId => {
      const currentScore = oilScores.get(oilId) || 0;
      oilScores.set(oilId, currentScore + 20);
    });

    // 作成可能なレシピのブースト
    blendRecipes.forEach(recipe => {
      const canMake = recipe.oils.every(recipeOil => 
        availableOils.includes(recipeOil.oilId)
      );
      if (canMake) {
        const currentScore = recipeScores.get(recipe.id) || 0;
        recipeScores.set(recipe.id, currentScore + 30);
      }
    });

    // 作成可能なブレンドのブースト
    blendSuggestions.forEach(blend => {
      const canMake = blend.oils.every(blendOil => 
        availableOils.includes(blendOil.oilId)
      );
      if (canMake) {
        const currentScore = blendScores.get(blend.id) || 0;
        blendScores.set(blend.id, currentScore + 30);
      }
    });
  }

  private static applySafetyFiltering(
    oilScores: Map<string, number>,
    recipeScores: Map<string, number>,
    blendScores: Map<string, number>,
    userSafetyProfile: any
  ) {
    // 危険なオイルのスコアを大幅減点
    enhancedOils.forEach(oil => {
      // 簡易的な安全性チェック（実際のevaluateOilSafetyは存在しないため）
      let isDangerous = false;
      
      if (userSafetyProfile.isPregnant && !oil.safety.pregnancy.safe) {
        isDangerous = true;
      }
      if (userSafetyProfile.hasBaby && !oil.safety.baby.safe) {
        isDangerous = true;
      }
      if (userSafetyProfile.hasPets && userSafetyProfile.petTypes.includes('cat') && 
          oil.safety.petSafety.includes('猫への使用は避ける')) {
        isDangerous = true;
      }
      
      if (isDangerous) {
        oilScores.set(oil.id, 0); // 危険なオイルは推奨しない
      }
    });

    // 危険なレシピのスコア減点
    blendRecipes.forEach(recipe => {
      const safetyResult = RecipeSafetyEvaluator.evaluateRecipe(recipe, userSafetyProfile);
      if (safetyResult.safetyLevel === 'danger') {
        recipeScores.set(recipe.id, 0);
      } else if (safetyResult.safetyLevel === 'caution') {
        const currentScore = recipeScores.get(recipe.id) || 0;
        recipeScores.set(recipe.id, currentScore * 0.3); // 注意のものは30%に減点
      }
    });

    // 危険なブレンドのスコア減点
    blendSuggestions.forEach(blend => {
      const safetyResult = RecipeSafetyEvaluator.evaluateBlendSuggestion(blend, userSafetyProfile);
      if (safetyResult.safetyLevel === 'danger') {
        blendScores.set(blend.id, 0);
      } else if (safetyResult.safetyLevel === 'caution') {
        const currentScore = blendScores.get(blend.id) || 0;
        blendScores.set(blend.id, currentScore * 0.3);
      }
    });
  }

  private static mergeScores(targetMap: Map<string, number>, sourceMap: Map<string, number>) {
    sourceMap.forEach((score, key) => {
      const currentScore = targetMap.get(key) || 0;
      targetMap.set(key, currentScore + score);
    });
  }

  private static convertToRecommendationScores(
    scores: Map<string, number>, 
    itemType: 'oil' | 'recipe' | 'blend'
  ): RecommendationScore[] {
    const result: RecommendationScore[] = [];
    
    scores.forEach((score, itemId) => {
      if (score > 0) {
        result.push({
          itemId,
          itemType,
          score: Math.min(Math.round(score), 100),
          reasons: this.generateReasons(itemId, itemType, score)
        });
      }
    });

    return result.sort((a, b) => b.score - a.score);
  }

  private static generateReasons(itemId: string, itemType: string, score: number): string[] {
    const reasons: string[] = [];
    
    if (score >= 80) {
      reasons.push('高い推奨度');
    } else if (score >= 60) {
      reasons.push('おすすめ');
    } else if (score >= 40) {
      reasons.push('検討候補');
    }

    if (itemType === 'oil') {
      const oil = enhancedOils.find(o => o.id === itemId);
      if (oil) {
        reasons.push(`${oil.nameJa}の効果`);
      }
    }

    return reasons;
  }

  // 現在の時間から時間帯を自動判定
  static getCurrentTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  }

  // 現在の月から季節を自動判定
  static getCurrentSeason(): Season {
    const month = new Date().getMonth() + 1; // 0-based to 1-based
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  // ユーザー好み学習による調整
  private static applyUserPreferences(
    oilScores: Map<string, number>,
    recipeScores: Map<string, number>,
    blendScores: Map<string, number>
  ): { applied: boolean; reason: string; confidenceBoost: number } {
    let totalBoosts = 0;
    let appliedCount = 0;

    // オイルの好みブースト
    enhancedOils.forEach(oil => {
      const boostScore = UserPreferenceManager.getPreferenceBoostScore(
        oil.id, 'oil', oil.category
      );
      if (boostScore > 0) {
        const currentScore = oilScores.get(oil.id) || 0;
        oilScores.set(oil.id, currentScore + boostScore);
        totalBoosts += boostScore;
        appliedCount++;
      }
    });

    // レシピの好みブースト
    blendRecipes.forEach(recipe => {
      const boostScore = UserPreferenceManager.getPreferenceBoostScore(
        recipe.id, 'recipe', recipe.category
      );
      if (boostScore > 0) {
        const currentScore = recipeScores.get(recipe.id) || 0;
        recipeScores.set(recipe.id, currentScore + boostScore);
        totalBoosts += boostScore;
        appliedCount++;
      }
    });

    // ブレンドの好みブースト
    blendSuggestions.forEach(blend => {
      const boostScore = UserPreferenceManager.getPreferenceBoostScore(
        blend.id, 'blend', blend.category
      );
      if (boostScore > 0) {
        const currentScore = blendScores.get(blend.id) || 0;
        blendScores.set(blend.id, currentScore + boostScore);
        totalBoosts += boostScore;
        appliedCount++;
      }
    });

    if (appliedCount > 0) {
      const stats = UserPreferenceManager.getStatistics();
      let reason = 'あなたの使用履歴に基づいて調整しました';
      
      if (stats.favoriteCount > 0) {
        reason = `お気に入り${stats.favoriteCount}個と使用履歴に基づいて調整しました`;
      } else if (stats.totalOilUsage + stats.totalRecipeUsage + stats.totalBlendUsage > 10) {
        reason = '豊富な使用履歴に基づいてパーソナライズしました';
      }

      return {
        applied: true,
        reason,
        confidenceBoost: Math.min(Math.floor(totalBoosts / 10), 20) // 最大20%のconfidenceブースト
      };
    }

    return { applied: false, reason: '', confidenceBoost: 0 };
  }

  // 使用を記録するメソッド（推奨アイテムが選択された時に呼び出す）
  static recordUsage(itemId: string, itemType: 'oil' | 'recipe' | 'blend', category: string): void {
    if (itemType === 'oil') {
      UserPreferenceManager.recordOilUsage(itemId, category);
    } else if (itemType === 'recipe') {
      UserPreferenceManager.recordRecipeUsage(itemId, category);
    } else if (itemType === 'blend') {
      UserPreferenceManager.recordBlendUsage(itemId, category);
    }
  }
}