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
import { getDailyOil, generateDailyStory, DailyOilStory } from '../data/dailyOilStories';
import { OilUsageTracker, OilUsageRecord, UsageStats } from '../utils/oilUsageTracker';
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
  
  // 新しいステート
  const [todayStory, setTodayStory] = useState<DailyOilStory | null>(null);
  const [todayOil, setTodayOil] = useState<Oil | null>(null);
  const [usageRecord, setUsageRecord] = useState<OilUsageRecord | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // 検索ロジックを関数として定義
  const performSearch = (term: string): Oil[] => {
    if (!term.trim()) return [];
    
    const searchTerms = expandSearchTerms(term.trim());
    
    return oilsData.filter(oil => 
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
  };

  // homeStateから復帰した時に検索を再実行
  useEffect(() => {
    if (homeState?.searchTerm && homeState.searchTerm.trim()) {
      const results = performSearch(homeState.searchTerm);
      setSearchResults(results);
    }
  }, []); // 初回マウント時のみ実行
  
  // 今日のオイルストーリーを読み込む
  useEffect(() => {
    const today = new Date();
    const todayStr = formatDate(today);
    
    // 今日のオイルを取得
    const dailyOilId = getDailyOil(today);
    const oil = oilsData.find(o => o.id === dailyOilId);
    
    if (oil) {
      setTodayOil(oil);
      
      // ストーリーを生成
      const story = generateDailyStory(dailyOilId, today);
      setTodayStory(story);
      
      // 既存の使用記録を取得
      const existingRecord = OilUsageTracker.getRecordByDate(todayStr);
      if (existingRecord) {
        setUsageRecord(existingRecord);
      } else {
        // 新しいレコードを作成
        const newRecord: OilUsageRecord = {
          oilId: dailyOilId,
          date: todayStr,
          missions: story.missions.map(m => ({
            missionId: m.id,
            completed: false
          }))
        };
        setUsageRecord(newRecord);
        OilUsageTracker.recordUsage(newRecord);
      }
    }
    
    // 統計情報を取得
    const stats = OilUsageTracker.getStats();
    setUsageStats(stats);
  }, []);
  
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
      
      const results = performSearch(term);
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
        availableOils: [] // myOilsが空の場合でもレシピを表示
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
        availableOils: [] // myOilsが空の場合でもレシピを表示
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
  
  // ミッション完了のハンドラー
  const handleMissionToggle = (missionId: string) => {
    if (!usageRecord || !todayStory) return;
    
    const mission = usageRecord.missions.find(m => m.missionId === missionId);
    if (mission) {
      const newCompleted = !mission.completed;
      OilUsageTracker.updateMissionStatus(usageRecord.date, missionId, newCompleted);
      
      // ローカルステートを更新
      setUsageRecord({
        ...usageRecord,
        missions: usageRecord.missions.map(m =>
          m.missionId === missionId
            ? { ...m, completed: newCompleted, completedAt: newCompleted ? new Date().toISOString() : undefined }
            : m
        )
      });
      
      // 統計情報を更新
      const stats = OilUsageTracker.getStats();
      setUsageStats(stats);
    }
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
    <div className="home daily-oil-home">
      {todayOil && todayStory && (
        <div 
          className="daily-oil-section"
          style={{
            background: `linear-gradient(180deg, ${todayStory.visualTheme.secondaryColor} 0%, #FFFFFF 100%)`
          }}
        >
          {/* ヘッダー部分 */}
          <div className="daily-header">
            <div className="date-display">
              <span className="date-day">{new Date().getDate()}</span>
              <span className="date-month">{new Date().toLocaleDateString('ja-JP', { month: 'long' })}</span>
            </div>
            <div className="streak-display">
              <span className="streak-icon">🔥</span>
              <span className="streak-number">{usageStats?.currentStreak || 0}</span>
              <span className="streak-label">日連続</span>
            </div>
          </div>
          
          {/* 今日のオイル */}
          <div className="today-oil-showcase">
            <h2 className="today-label">今日のアロマ</h2>
            <div 
              className="oil-visual"
              style={{ borderColor: todayStory.visualTheme.primaryColor }}
              onClick={() => onOilSelect(todayOil)}
            >
              <div className="oil-bottle">🌿</div>
              <h1 className="oil-name">{todayOil.name}</h1>
              <p className="oil-category">{getCategoryName(todayOil.category)}</p>
            </div>
            
            {/* ストーリー */}
            <div className="oil-story">
              <p>{todayStory.story}</p>
              <p className="affirmation">"{todayStory.affirmation}"</p>
            </div>
          </div>
          
          {/* デイリーミッション */}
          <div className="daily-missions">
            <h3><span className="mission-icon">💫</span> 今日のミッション</h3>
            <div className="missions-list">
              {todayStory.missions.map((mission, index) => {
                const missionRecord = usageRecord?.missions.find(m => m.missionId === mission.id);
                const isCompleted = missionRecord?.completed || false;
                
                return (
                  <div 
                    key={mission.id}
                    className={`mission-item ${isCompleted ? 'completed' : ''} ${mission.timing}`}
                    onClick={() => handleMissionToggle(mission.id)}
                  >
                    <input 
                      type="checkbox" 
                      checked={isCompleted}
                      onChange={() => {}}
                      className="mission-checkbox"
                    />
                    <div className="mission-content">
                      <span className="mission-timing">
                        {mission.timing === 'morning' ? '朝' : 
                         mission.timing === 'afternoon' ? '午後' : '夜'}
                      </span>
                      <span className="mission-description">{mission.description}</span>
                    </div>
                    {isCompleted && <span className="mission-check">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 今日のレシピ */}
          <div className="daily-recipe">
            <h3><span className="recipe-icon">🎁</span> 今日のレシピ</h3>
            <div 
              className="recipe-card"
              style={{ borderColor: todayStory.visualTheme.primaryColor }}
            >
              <h4>{todayStory.recipe.name}</h4>
              <p>{todayStory.recipe.description}</p>
              <div className="recipe-oils">
                {todayStory.recipe.oils.map((oil, index) => (
                  <span key={index} className="recipe-oil">
                    {oil.oilId} {oil.drops}滴
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* 豆知識 */}
          <div className="oil-trivia">
            <h3><span className="trivia-icon">📖</span> 豆知識</h3>
            <p>{todayStory.trivia}</p>
          </div>
          
          {/* コレクション進捗 */}
          <div className="collection-progress">
            <h3><span className="collection-icon">🏆</span> コレクション</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(usageStats ? (OilUsageTracker.getCollectionProgress().percentage) : 0)}%`,
                  backgroundColor: todayStory.visualTheme.primaryColor
                }}
              />
            </div>
            <p className="progress-text">
              {OilUsageTracker.getCollectionProgress().used} / {OilUsageTracker.getCollectionProgress().total} 種類
            </p>
          </div>
        </div>
      )}
      
      {/* 従来の検索機能（下部に配置） */}
      <div className="search-section compact">
        <h3>オイルを検索</h3>
        <div className="search-box">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="症状や気になることを入力"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="search-clear-btn"
                onClick={() => handleSearch('')}
                aria-label="検索をクリア"
              >
                ×
              </button>
            )}
          </div>
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
    </div>
  );
};

export default Home;