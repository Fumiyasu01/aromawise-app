import React, { useState, useEffect } from 'react';
import { Oil } from '../types/Oil';
import { oilsData } from '../data/oils';
import { enhancedOils } from '../data/enhancedOils';
import { blendRecipes } from '../data/blendRecipes';
import { blendSuggestions } from '../data/blendCompatibility';
import { RecommendationEngine } from '../utils/recommendationEngine';
import { SymptomCategory, RecommendationResult, RecommendationScore } from '../types/Recommendation';
import { RecipeSafetyEvaluator } from '../utils/recipeSafety';
import { UserPreferenceManager } from '../utils/userPreferences';
import { analytics } from '../utils/analytics';
import MedicalDisclaimer from './MedicalDisclaimer';
import './Home.css';

interface HomeProps {
  onOilSelect: (oil: Oil) => void;
  onRecipeSelect?: (recipeId: string) => void;
  onBlendSelect?: (blendId: string) => void;
  myOils?: Oil[];
  homeState?: {
    selectedSymptoms: SymptomCategory[];
    currentRecommendations: RecommendationResult | null;
    searchTerm: string;
  };
  onHomeStateChange?: (state: {
    selectedSymptoms: SymptomCategory[];
    currentRecommendations: RecommendationResult | null;
    searchTerm: string;
  }) => void;
}

const Home: React.FC<HomeProps> = ({ 
  onOilSelect, 
  onRecipeSelect, 
  onBlendSelect, 
  myOils = [],
  homeState,
  onHomeStateChange
}) => {
  const [searchTerm, setSearchTerm] = useState(homeState?.searchTerm || '');
  const [searchResults, setSearchResults] = useState<Oil[]>([]);
  const [currentRecommendations, setCurrentRecommendations] = useState<RecommendationResult | null>(homeState?.currentRecommendations || null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomCategory[]>(homeState?.selectedSymptoms || []);

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      citrus: '柑橘系',
      floral: 'フローラル',
      herbal: 'ハーブ',
      blend: 'ブレンド',
      popular: '人気'
    };
    return names[category] || category;
  };

  const expandSearchTerms = (term: string): string[] => {
    const synonyms: Record<string, string[]> = {
      '頭痛': ['頭が痛い', '頭の痛み', 'ずつう'],
      '不眠': ['眠れない', '寝付けない', '寝れない', '睡眠不足'],
      'ストレス': ['イライラ', 'いらいら', '緊張', 'プレッシャー'],
      '疲労': ['疲れ', 'つかれ', 'だるい', 'やる気がない', '元気がない'],
      '不安': ['心配', '不安感', 'あんしん'],
      '消化不良': ['胃もたれ', 'お腹の調子', '胃腸', '消化'],
      '筋肉痛': ['筋肉の痛み', '体が痛い', '肩こり'],
      '集中力': ['集中', '集中できない', '注意力'],
      '免疫': ['免疫力', '体調', '風邪'],
      '肌荒れ': ['肌トラブル', '肌の調子', '美肌'],
      'リラックス': ['リラクゼーション', 'くつろぎ', '癒し'],
      '気分': ['気持ち', 'きぶん', 'メンタル'],
      '香り': ['匂い', 'におい', 'かおり', 'アロマ']
    };

    const expandedTerms = [term];
    const lowerTerm = term.toLowerCase();
    
    Object.entries(synonyms).forEach(([key, values]) => {
      if (key.toLowerCase().includes(lowerTerm) || values.some(v => v.toLowerCase().includes(lowerTerm))) {
        expandedTerms.push(key, ...values);
      }
    });

    return Array.from(new Set(expandedTerms));
  };

  const updateHomeState = (updates: Partial<{
    selectedSymptoms: SymptomCategory[];
    currentRecommendations: RecommendationResult | null;
    searchTerm: string;
  }>) => {
    if (onHomeStateChange) {
      onHomeStateChange({
        selectedSymptoms,
        currentRecommendations,
        searchTerm,
        ...updates
      });
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateHomeState({ searchTerm: term });
    if (term.trim()) {
      // アナリティクス記録
      analytics.trackSearch(term.trim(), 0, 'home');
      
      // 検索実行時に上部にスクロール
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      const searchTerms = expandSearchTerms(term.trim());
      
      const results = oilsData.filter(oil => 
        searchTerms.some(searchTerm => {
          const lowerSearchTerm = searchTerm.toLowerCase();
          return (
            oil.symptoms.some(symptom => 
              symptom.toLowerCase().includes(lowerSearchTerm)
            ) ||
            oil.benefits.some(benefit => 
              benefit.toLowerCase().includes(lowerSearchTerm)
            ) ||
            oil.name.toLowerCase().includes(lowerSearchTerm) ||
            oil.aroma.toLowerCase().includes(lowerSearchTerm) ||
            oil.description.toLowerCase().includes(lowerSearchTerm) ||
            getCategoryName(oil.category).toLowerCase().includes(lowerSearchTerm)
          );
        })
      );
      setSearchResults(results);
      
      // 検索結果数をアナリティクスに記録
      analytics.trackSearch(term.trim(), results.length, 'home');
    } else {
      setSearchResults([]);
    }
  };

  const popularSymptoms = [
    { symptom: 'stress' as SymptomCategory, nameJa: 'ストレス', icon: '😰' },
    { symptom: 'sleep' as SymptomCategory, nameJa: '不眠', icon: '😴' },
    { symptom: 'headache' as SymptomCategory, nameJa: '頭痛', icon: '🤕' },
    { symptom: 'energy' as SymptomCategory, nameJa: '疲労', icon: '😫' },
    { symptom: 'focus' as SymptomCategory, nameJa: '集中力', icon: '🧠' },
    { symptom: 'cold' as SymptomCategory, nameJa: '風邪症状', icon: '🤧' },
    { symptom: 'muscle_pain' as SymptomCategory, nameJa: '筋肉痛', icon: '💪' },
    { symptom: 'mood' as SymptomCategory, nameJa: '気分', icon: '😔' },
    { symptom: 'respiratory' as SymptomCategory, nameJa: '呼吸器', icon: '🫁' },
    { symptom: 'immune' as SymptomCategory, nameJa: '免疫力', icon: '🛡️' }
  ];

  // 自動推奨の生成
  useEffect(() => {
    const userProfile = RecipeSafetyEvaluator.getDefaultUserProfile();
    const recommendations = RecommendationEngine.generateRecommendations({
      timeOfDay: RecommendationEngine.getCurrentTimeOfDay(),
      season: RecommendationEngine.getCurrentSeason(),
      userSafetyProfile: userProfile,
      availableOils: myOils.map(oil => oil.id)
    });
    setCurrentRecommendations(recommendations);
    updateHomeState({ currentRecommendations: recommendations });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myOils]);

  const handleSymptomSelect = (symptom: SymptomCategory) => {
    const newSymptoms = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter(s => s !== symptom)
      : [...selectedSymptoms, symptom];
    
    setSelectedSymptoms(newSymptoms);
    
    if (newSymptoms.length > 0) {
      const userProfile = RecipeSafetyEvaluator.getDefaultUserProfile();
      const recommendations = RecommendationEngine.generateRecommendations({
        symptoms: newSymptoms,
        timeOfDay: RecommendationEngine.getCurrentTimeOfDay(),
        season: RecommendationEngine.getCurrentSeason(),
        userSafetyProfile: userProfile,
        availableOils: myOils.map(oil => oil.id)
      });
      setCurrentRecommendations(recommendations);
      updateHomeState({ selectedSymptoms: newSymptoms, currentRecommendations: recommendations });
    } else {
      // 症状が選択されていない場合は基本推奨に戻す
      const userProfile = RecipeSafetyEvaluator.getDefaultUserProfile();
      const recommendations = RecommendationEngine.generateRecommendations({
        timeOfDay: RecommendationEngine.getCurrentTimeOfDay(),
        season: RecommendationEngine.getCurrentSeason(),
        userSafetyProfile: userProfile,
        availableOils: myOils.map(oil => oil.id)
      });
      setCurrentRecommendations(recommendations);
      updateHomeState({ selectedSymptoms: newSymptoms, currentRecommendations: recommendations });
    }
  };

  const getOilById = (oilId: string) => {
    return enhancedOils.find(oil => oil.id === oilId);
  };

  const getRecipeById = (recipeId: string) => {
    return blendRecipes.find(recipe => recipe.id === recipeId);
  };

  const getBlendById = (blendId: string) => {
    return blendSuggestions.find(blend => blend.id === blendId);
  };

  const getTimeOfDayLabel = (timeOfDay: string) => {
    const labels = {
      morning: '朝 (6:00-12:00)',
      afternoon: '午後 (12:00-17:00)',
      evening: '夕方 (17:00-22:00)',
      night: '夜 (22:00-6:00)'
    };
    return labels[timeOfDay as keyof typeof labels] || timeOfDay;
  };

  const getSeasonLabel = (season: string) => {
    const labels = {
      spring: '春 (3-5月)',
      summer: '夏 (6-8月)',
      autumn: '秋 (9-11月)',
      winter: '冬 (12-2月)'
    };
    return labels[season as keyof typeof labels] || season;
  };

  const handleItemClick = (rec: RecommendationScore) => {
    // 使用履歴を記録
    let category = '';
    
    // アナリティクス記録
    analytics.trackRecommendationClick(rec.itemType, rec.itemId, rec.score, 'home');
    
    if (rec.itemType === 'oil') {
      const oil = getOilById(rec.itemId);
      if (oil) {
        category = oil.category;
        RecommendationEngine.recordUsage(rec.itemId, rec.itemType, category);
        analytics.trackOilView(rec.itemId, oil.nameJa, 'home');
        
        // EnhancedOilをOil型に変換
        const legacyOil = {
          id: oil.id,
          name: oil.nameEn,
          category: oil.category === 'フローラル系' ? 'floral' as const :
                   oil.category === '柑橘系' ? 'citrus' as const :
                   oil.category === 'ハーブ系' ? 'herbal' as const :
                   oil.category === 'ブレンド' ? 'blend' as const : 'popular' as const,
          benefits: oil.effects,
          symptoms: oil.symptoms,
          aroma: oil.aroma,
          safetyInfo: oil.safetyInfo,
          usage: oil.usage.methods.map(method => 
            method === 'aromatic' ? 'アロマ' :
            method === 'topical' ? '局所塗布' :
            method === 'internal' ? '内服' : method
          ),
          description: oil.description
        };
        onOilSelect(legacyOil);
      }
    } else if (rec.itemType === 'recipe' && onRecipeSelect) {
      const recipe = getRecipeById(rec.itemId);
      if (recipe) {
        category = recipe.category;
        RecommendationEngine.recordUsage(rec.itemId, rec.itemType, category);
        onRecipeSelect(rec.itemId);
      }
    } else if (rec.itemType === 'blend' && onBlendSelect) {
      const blend = getBlendById(rec.itemId);
      if (blend) {
        category = blend.category;
        RecommendationEngine.recordUsage(rec.itemId, rec.itemType, category);
        onBlendSelect(rec.itemId);
      }
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent, oilId: string) => {
    e.stopPropagation(); // カードクリックイベントを防ぐ
    const wasFavorite = UserPreferenceManager.isFavoriteOil(oilId);
    UserPreferenceManager.toggleFavoriteOil(oilId);
    
    // アナリティクス記録
    analytics.trackFavoriteToggle(oilId, wasFavorite ? 'remove' : 'add', 'home');
    
    // 推奨を再生成してお気に入り変更を反映
    const userProfile = RecipeSafetyEvaluator.getDefaultUserProfile();
    const recommendations = RecommendationEngine.generateRecommendations({
      symptoms: selectedSymptoms,
      timeOfDay: RecommendationEngine.getCurrentTimeOfDay(),
      season: RecommendationEngine.getCurrentSeason(),
      userSafetyProfile: userProfile,
      availableOils: myOils.map(oil => oil.id)
    });
    setCurrentRecommendations(recommendations);
    updateHomeState({ currentRecommendations: recommendations });
  };

  const renderRecommendationCard = (rec: RecommendationScore) => {
    if (rec.itemType === 'oil') {
      const oil = getOilById(rec.itemId);
      if (oil) {
        const isFavorite = UserPreferenceManager.isFavoriteOil(rec.itemId);
        return (
          <div key={rec.itemId} className="recommendation-card" onClick={() => handleItemClick(rec)}>
            <div className="rec-header">
              <h4>{oil.nameJa}</h4>
              <div className="rec-actions">
                <button 
                  className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                  onClick={(e) => handleFavoriteToggle(e, rec.itemId)}
                  title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
                <span className="rec-score">{rec.score}%</span>
              </div>
            </div>
            <p className="rec-category">{oil.category}</p>
            <div className="rec-reasons">
              {rec.reasons.slice(0, 2).map((reason, idx) => (
                <span key={idx} className="reason-tag">{reason}</span>
              ))}
            </div>
          </div>
        );
      }
    } else if (rec.itemType === 'recipe' && onRecipeSelect) {
      const recipe = getRecipeById(rec.itemId);
      if (recipe) {
        return (
          <div key={rec.itemId} className="recommendation-card" onClick={() => handleItemClick(rec)}>
            <div className="rec-header">
              <h4>{recipe.name}</h4>
              <span className="rec-score">{rec.score}%</span>
            </div>
            <p className="rec-category">{recipe.category}</p>
            <div className="rec-reasons">
              {rec.reasons.slice(0, 2).map((reason, idx) => (
                <span key={idx} className="reason-tag">{reason}</span>
              ))}
            </div>
          </div>
        );
      }
    } else if (rec.itemType === 'blend' && onBlendSelect) {
      const blend = getBlendById(rec.itemId);
      if (blend) {
        return (
          <div key={rec.itemId} className="recommendation-card" onClick={() => handleItemClick(rec)}>
            <div className="rec-header">
              <h4>{blend.name}</h4>
              <span className="rec-score">{rec.score}%</span>
            </div>
            <p className="rec-category">{blend.category}</p>
            <div className="rec-reasons">
              {rec.reasons.slice(0, 2).map((reason, idx) => (
                <span key={idx} className="reason-tag">{reason}</span>
              ))}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="home">
      <div className="decorative-leaf"></div>
      <header className="home-header">
        <h1>AromaWise</h1>
        <p className="subtitle">あなたのアロマセラピーガイド</p>
      </header>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="症状や気になることを入力してください"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {searchTerm && searchResults.length > 0 && (
          <div className="search-results">
            <h3>検索結果 ({searchResults.length}件)</h3>
            <div className="oil-cards">
              {searchResults.map(oil => (
                <div key={oil.id} className="oil-card" onClick={() => {
                  analytics.trackOilView(oil.id, oil.name, 'home');
                  onOilSelect(oil);
                }}>
                  <h4>{oil.name}</h4>
                  <p className="oil-aroma">{oil.aroma}</p>
                  <div className="oil-benefits">
                    {oil.benefits.slice(0, 2).map((benefit, index) => (
                      <span key={index} className="benefit-tag">{benefit}</span>
                    ))}
                  </div>
                  {(!oil.safetyInfo.pregnancy || !oil.safetyInfo.children) && (
                    <div className="safety-warning">⚠️ 使用注意</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {searchTerm && searchResults.length === 0 && (
          <div className="no-results">
            <span style={{fontSize: '2rem', marginBottom: '10px', display: 'block'}}>🔍</span>
            <p>「{searchTerm}」に該当するオイルが見つかりませんでした。</p>
            <p>他のキーワードでお試しください。</p>
          </div>
        )}
      </div>

      {!searchTerm && (
        <div className="recommendations-section">
          <h3>🎯 あなたへのおすすめ</h3>
          
          <div className="symptom-selector">
            <h4>気になる症状を選択してください</h4>
            <div className="symptom-tags">
              {popularSymptoms.map((item, index) => (
                <button
                  key={index}
                  className={`symptom-tag ${selectedSymptoms.includes(item.symptom) ? 'selected' : ''}`}
                  onClick={() => handleSymptomSelect(item.symptom)}
                >
                  <span className="symptom-icon">{item.icon}</span>
                  {item.nameJa}
                </button>
              ))}
            </div>
          </div>

          {currentRecommendations && (
            <div className="recommendation-results">
              <div className="current-context">
                <div className="context-item">
                  <span className="context-icon">🕐</span>
                  <div className="context-info">
                    <span className="context-label">現在の時間帯</span>
                    <span className="context-value">{getTimeOfDayLabel(RecommendationEngine.getCurrentTimeOfDay())}</span>
                  </div>
                </div>
                <div className="context-item">
                  <span className="context-icon">🍂</span>
                  <div className="context-info">
                    <span className="context-label">季節</span>
                    <span className="context-value">{getSeasonLabel(RecommendationEngine.getCurrentSeason())}</span>
                  </div>
                </div>
              </div>
              
              <div className="rec-confidence">
                <span>推奨度: {currentRecommendations.confidence}%</span>
                <span className="rec-reason">{currentRecommendations.primaryReason}</span>
              </div>
              
              {currentRecommendations.oils.length > 0 && (
                <div className="rec-section">
                  <h4>🌿 おすすめオイル</h4>
                  <div className="recommendation-cards">
                    {currentRecommendations.oils.slice(0, 3).map(renderRecommendationCard)}
                  </div>
                </div>
              )}
              
              {currentRecommendations.recipes.length > 0 && onRecipeSelect && (
                <div className="rec-section">
                  <h4>📝 おすすめレシピ</h4>
                  <div className="recommendation-cards">
                    {currentRecommendations.recipes.slice(0, 3).map(renderRecommendationCard)}
                  </div>
                </div>
              )}
              
              {currentRecommendations.blends.length > 0 && onBlendSelect && (
                <div className="rec-section">
                  <h4>🌸 おすすめブレンド</h4>
                  <div className="recommendation-cards">
                    {currentRecommendations.blends.slice(0, 3).map(renderRecommendationCard)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!searchTerm && (
        <div className="info-section">
          <MedicalDisclaimer variant="banner" />
          
          <div className="info-card">
            <h3>🌿 エッセンシャルオイルについて</h3>
            <p>厳選された127種類のプレミアムエッセンシャルオイルの情報を検索できます。</p>
          </div>
          <div className="info-card">
            <h3>🎯 パーソナライズ機能</h3>
            <p>あなたの使用履歴と安全性プロファイルに基づいて、最適なオイル・レシピ・ブレンドを推奨します。</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;