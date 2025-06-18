import { EnhancedOil } from '../types/EnhancedOil';
import { blendCompatibilities } from '../data/blendCompatibility';
import { symptomMappings } from '../data/symptomMappings';

export interface EffectScore {
  effect: string;
  score: number;
  contributingOils: string[];
}

export interface CombinationEffectAnalysis {
  primaryEffects: EffectScore[];
  secondaryEffects: EffectScore[];
  symptomRelief: EffectScore[];
  overallSynergy: number;
  warnings: string[];
}

export class EffectsCalculator {
  /**
   * Calculate combined effects of multiple oils
   */
  static analyzeCombination(oils: EnhancedOil[]): CombinationEffectAnalysis {
    if (oils.length === 0) {
      return {
        primaryEffects: [],
        secondaryEffects: [],
        symptomRelief: [],
        overallSynergy: 0,
        warnings: []
      };
    }

    const effectsMap = new Map<string, { count: number; oils: string[] }>();
    const symptomsMap = new Map<string, { score: number; oils: string[] }>();
    const warnings: string[] = [];

    // Collect all effects and their occurrences
    oils.forEach(oil => {
      // Effects
      oil.effects?.forEach(effect => {
        const current = effectsMap.get(effect) || { count: 0, oils: [] };
        current.count++;
        current.oils.push(oil.nameJa);
        effectsMap.set(effect, current);
      });

      // Symptoms
      oil.symptoms?.forEach(symptom => {
        const mapping = (symptomMappings as any)[symptom];
        if (mapping) {
          const oilMapping = mapping.oils.find((o: any) => o.id === oil.id);
          if (oilMapping) {
            const current = symptomsMap.get(symptom) || { score: 0, oils: [] };
            current.score += oilMapping.score;
            current.oils.push(oil.nameJa);
            symptomsMap.set(symptom, current);
          }
        }
      });
    });

    // Calculate synergy based on blend compatibility
    let totalSynergy = 0;
    let compatibilityCount = 0;
    
    for (let i = 0; i < oils.length; i++) {
      for (let j = i + 1; j < oils.length; j++) {
        const compatibility = this.getCompatibility(oils[i].id, oils[j].id);
        if (compatibility) {
          totalSynergy += compatibility.score;
          compatibilityCount++;
        }
      }
    }

    const overallSynergy = compatibilityCount > 0 ? totalSynergy / compatibilityCount : 3;

    // Convert maps to sorted arrays
    const allEffects = Array.from(effectsMap.entries())
      .map(([effect, data]) => ({
        effect,
        score: data.count * (1 + (overallSynergy - 3) * 0.2), // Synergy bonus
        contributingOils: data.oils
      }))
      .sort((a, b) => b.score - a.score);

    const symptomRelief = Array.from(symptomsMap.entries())
      .map(([effect, data]) => ({
        effect,
        score: data.score * (1 + (overallSynergy - 3) * 0.1), // Smaller synergy bonus
        contributingOils: data.oils
      }))
      .sort((a, b) => b.score - a.score);

    // Check for safety warnings
    const hasPhototoxic = oils.some(oil => oil.safety?.photosensitivity?.sensitive);
    const hasPregnancyWarning = oils.some(oil => !oil.safety?.pregnancy?.safe);
    const hasChildWarning = oils.some(oil => !oil.safety?.baby?.safe);

    if (hasPhototoxic) {
      warnings.push('光毒性のあるオイルが含まれています。使用後は直射日光を避けてください。');
    }
    if (hasPregnancyWarning) {
      warnings.push('妊娠中の使用に注意が必要なオイルが含まれています。');
    }
    if (hasChildWarning) {
      warnings.push('お子様への使用に注意が必要なオイルが含まれています。');
    }

    return {
      primaryEffects: allEffects.slice(0, 5),
      secondaryEffects: allEffects.slice(5, 10),
      symptomRelief: symptomRelief.slice(0, 5),
      overallSynergy,
      warnings
    };
  }

  /**
   * Get compatibility score between two oils
   */
  private static getCompatibility(oil1Id: string, oil2Id: string) {
    const compat = blendCompatibilities.find(
      c => 
        (c.oilId1 === oil1Id && c.oilId2 === oil2Id) ||
        (c.oilId1 === oil2Id && c.oilId2 === oil1Id)
    );
    return compat ? { score: compat.compatibility } : null;
  }

  /**
   * Find oil combinations for a specific effect
   */
  static findCombinationsForEffect(targetEffect: string, allOils: EnhancedOil[], maxOils: number = 3) {
    // Find all oils that have the target effect
    const relevantOils = allOils.filter(oil => 
      oil.effects?.includes(targetEffect) || oil.symptoms?.includes(targetEffect)
    );

    if (relevantOils.length === 0) return [];

    // Generate combinations
    const combinations: { oils: EnhancedOil[]; synergy: number; effectScore: number }[] = [];

    // Helper function to generate combinations
    const generateCombinations = (arr: EnhancedOil[], size: number): EnhancedOil[][] => {
      if (size === 1) return arr.map(oil => [oil]);
      
      const result: EnhancedOil[][] = [];
      for (let i = 0; i < arr.length - size + 1; i++) {
        const head = arr.slice(i, i + 1);
        const tailCombinations = generateCombinations(arr.slice(i + 1), size - 1);
        for (const tail of tailCombinations) {
          result.push([...head, ...tail]);
        }
      }
      return result;
    };

    // Generate combinations of different sizes
    for (let size = 2; size <= Math.min(maxOils, relevantOils.length); size++) {
      const combos = generateCombinations(relevantOils, size);
      
      for (const combo of combos) {
        const analysis = this.analyzeCombination(combo);
        const targetEffectScore = analysis.primaryEffects.find(e => e.effect === targetEffect)?.score || 0;
        
        combinations.push({
          oils: combo,
          synergy: analysis.overallSynergy,
          effectScore: targetEffectScore
        });
      }
    }

    // Sort by effect score and synergy
    return combinations
      .sort((a, b) => {
        const scoreDiff = b.effectScore - a.effectScore;
        return scoreDiff !== 0 ? scoreDiff : b.synergy - a.synergy;
      })
      .slice(0, 10); // Return top 10 combinations
  }
}