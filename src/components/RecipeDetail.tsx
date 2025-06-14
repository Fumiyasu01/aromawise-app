import React, { useState, useEffect } from 'react';
import { BlendRecipe } from '../types/BlendRecipe';
import { Oil } from '../types/Oil';
import { RecipeSafetyEvaluator, UserSafetyProfile, RecipeSafetyResult } from '../utils/recipeSafety';
import BackHeader from './BackHeader';
import './RecipeDetail.css';

interface RecipeDetailProps {
  recipe: BlendRecipe;
  myOils: Oil[];
  onBack: () => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, myOils, onBack }) => {
  const [userProfile, setUserProfile] = useState<UserSafetyProfile>(
    RecipeSafetyEvaluator.getDefaultUserProfile()
  );
  const [safetyResult, setSafetyResult] = useState<RecipeSafetyResult | null>(null);
  const [showSafetyChecker, setShowSafetyChecker] = useState(false);

  const canMake = recipe.oils.every(recipeOil => 
    myOils.some(myOil => myOil.id === recipeOil.oilId)
  );

  const missingOils = recipe.oils.filter(recipeOil => 
    !myOils.some(myOil => myOil.id === recipeOil.oilId)
  );

  useEffect(() => {
    const result = RecipeSafetyEvaluator.evaluateRecipe(recipe, userProfile);
    setSafetyResult(result);
  }, [recipe, userProfile]);

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: '#4caf50',
      medium: '#ff9800',
      hard: '#f44336'
    };
    return colors[difficulty as keyof typeof colors] || '#666';
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: '簡単',
      medium: '普通',
      hard: '上級'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      '虫よけ': '🦟',
      '安眠': '😴',
      '集中力': '🧠',
      'リラックス': '🧘',
      '空気清浄': '🌿',
      '気分転換': '✨',
      '免疫サポート': '🛡️',
      '呼吸サポート': '🫁',
      'ハウスケア': '🏠',
      '瞑想・スピリチュアル': '🕉️'
    };
    return icons[category] || '🧪';
  };

  const getSafetyLevelColor = (level: string) => {
    const colors = {
      safe: '#4caf50',
      caution: '#ff9800',
      danger: '#f44336'
    };
    return colors[level as keyof typeof colors] || '#666';
  };

  const getSafetyLevelIcon = (level: string) => {
    const icons = {
      safe: '✅',
      caution: '⚠️',
      danger: '🚫'
    };
    return icons[level as keyof typeof icons] || '❓';
  };

  const getWarningTypeIcon = (type: string) => {
    const icons = {
      pregnancy: '🤰',
      baby: '👶',
      pets: '🐾',
      photosensitivity: '☀️',
      medical: '⚕️',
      age: '👶'
    };
    return icons[type as keyof typeof icons] || '⚠️';
  };

  return (
    <div className="recipe-detail">
      <BackHeader 
        title={recipe.name}
        subtitle={recipe.category}
        backLabel="レシピ"
        onBack={onBack}
      />
      <div className="recipe-detail-content">
      <div className="recipe-detail-header">
        <div className="recipe-title">
          <span className="recipe-category-icon">{getCategoryIcon(recipe.category)}</span>
          <div>
            <h1>{recipe.name}</h1>
            <p className="recipe-category">{recipe.category}</p>
          </div>
        </div>
        <div className="recipe-badges">
          <span 
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
          >
            {getDifficultyLabel(recipe.difficulty)}
          </span>
          <span className="prep-time-badge">⏱️ {recipe.prepTime}</span>
        </div>
      </div>

      <div className="recipe-status-section">
        {canMake ? (
          <div className="status-card can-make">
            <span className="status-icon">✅</span>
            <div>
              <h3>作成可能です！</h3>
              <p>必要なオイルがすべて揃っています</p>
            </div>
          </div>
        ) : (
          <div className="status-card missing-oils">
            <span className="status-icon">⚠️</span>
            <div>
              <h3>オイルが不足しています</h3>
              <p>{missingOils.length}種類のオイルが必要です</p>
            </div>
          </div>
        )}
      </div>

      <div className="recipe-description-section">
        <h3>📝 概要</h3>
        <p>{recipe.description}</p>
      </div>

      <div className="recipe-oils-section">
        <h3>🌿 必要なオイル</h3>
        <div className="oils-detail-list">
          {recipe.oils.map((oil, index) => {
            const hasOil = myOils.some(myOil => myOil.id === oil.oilId);
            return (
              <div key={index} className={`oil-detail-item ${hasOil ? 'have' : 'missing'}`}>
                <div className="oil-info">
                  <span className="oil-status">{hasOil ? '✅' : '❌'}</span>
                  <span className="oil-name">{oil.oilName}</span>
                </div>
                <span className="oil-drops">{oil.drops}滴</span>
              </div>
            );
          })}
        </div>
        
        {recipe.carrier && (
          <div className="carrier-info">
            <h4>キャリア:</h4>
            <p>{recipe.carrier.type} {recipe.carrier.amount}</p>
          </div>
        )}
      </div>

      <div className="recipe-instructions-section">
        <h3>🛠️ 作り方</h3>
        <ol className="instructions-list">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="instruction-item">
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      <div className="recipe-benefits-section">
        <h3>✨ 期待できる効果</h3>
        <div className="benefits-list">
          {recipe.benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <span className="benefit-icon">•</span>
              {benefit}
            </div>
          ))}
        </div>
      </div>

      <div className="recipe-usage-section">
        <h3>💡 使用方法</h3>
        <div className="usage-list">
          {recipe.usage.map((usage, index) => (
            <div key={index} className="usage-item">
              <span className="usage-icon">💧</span>
              {usage}
            </div>
          ))}
        </div>
      </div>

      {/* パーソナライズ安全性チェック */}
      <div className="personalized-safety-section">
        <h3>🔒 パーソナライズ安全性チェック</h3>
        {safetyResult && (
          <div className="safety-summary">
            <button 
              className="safety-check-btn"
              onClick={() => setShowSafetyChecker(!showSafetyChecker)}
              style={{ borderColor: getSafetyLevelColor(safetyResult.safetyLevel) }}
            >
              <span className="safety-icon">{getSafetyLevelIcon(safetyResult.safetyLevel)}</span>
              <span>安全性チェック</span>
              <span className="toggle-icon">{showSafetyChecker ? '▼' : '▶'}</span>
            </button>
            
            {safetyResult.warnings.length > 0 && (
              <div className="safety-warnings-preview">
                <span className="warning-count">{safetyResult.warnings.length}件の注意事項</span>
              </div>
            )}
          </div>
        )}

        {showSafetyChecker && (
          <div className="safety-checker-form">
            <h4>あなたの状況を教えてください</h4>
            
            <div className="condition-section">
              <label className="condition-item">
                <input
                  type="checkbox"
                  checked={userProfile.isPregnant}
                  onChange={(e) => setUserProfile(prev => ({
                    ...prev,
                    isPregnant: e.target.checked,
                    pregnancyTrimester: e.target.checked ? 2 : null
                  }))}
                />
                <span>妊娠中です</span>
              </label>
              
              {userProfile.isPregnant && (
                <div className="trimester-selector">
                  <label>妊娠期間:</label>
                  {[1, 2, 3].map(trimester => (
                    <label key={trimester} className="radio-item">
                      <input
                        type="radio"
                        name="trimester"
                        checked={userProfile.pregnancyTrimester === trimester}
                        onChange={() => setUserProfile(prev => ({
                          ...prev,
                          pregnancyTrimester: trimester as 1 | 2 | 3
                        }))}
                      />
                      <span>第{trimester}トリメスター</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="condition-section">
              <label className="condition-item">
                <input
                  type="checkbox"
                  checked={userProfile.hasBaby}
                  onChange={(e) => setUserProfile(prev => ({
                    ...prev,
                    hasBaby: e.target.checked
                  }))}
                />
                <span>赤ちゃんがいます</span>
              </label>
              
              {userProfile.hasBaby && (
                <div className="baby-age-selector">
                  <label>赤ちゃんの月齢:</label>
                  <select
                    value={userProfile.babyAgeMonths}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      babyAgeMonths: parseInt(e.target.value)
                    }))}
                  >
                    {Array.from({length: 36}, (_, i) => (
                      <option key={i} value={i}>{i}ヶ月</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="condition-section">
              <label className="condition-item">
                <input
                  type="checkbox"
                  checked={userProfile.hasPets}
                  onChange={(e) => setUserProfile(prev => ({
                    ...prev,
                    hasPets: e.target.checked,
                    petTypes: e.target.checked ? prev.petTypes : []
                  }))}
                />
                <span>ペットがいます</span>
              </label>
              
              {userProfile.hasPets && (
                <div className="pet-types">
                  {['cat', 'dog'].map(petType => (
                    <label key={petType} className="condition-item">
                      <input
                        type="checkbox"
                        checked={userProfile.petTypes.includes(petType as 'cat' | 'dog')}
                        onChange={(e) => {
                          const updatedPetTypes = e.target.checked
                            ? [...userProfile.petTypes, petType as 'cat' | 'dog']
                            : userProfile.petTypes.filter(p => p !== petType);
                          setUserProfile(prev => ({
                            ...prev,
                            petTypes: updatedPetTypes
                          }));
                        }}
                      />
                      <span>{petType === 'cat' ? '🐱 猫' : '🐕 犬'}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="condition-section">
              <label className="condition-item">
                <input
                  type="checkbox"
                  checked={userProfile.willExposeToSun}
                  onChange={(e) => setUserProfile(prev => ({
                    ...prev,
                    willExposeToSun: e.target.checked
                  }))}
                />
                <span>使用後に日光に当たる予定があります</span>
              </label>
            </div>

            <div className="condition-section">
              <label className="condition-item">
                <input
                  type="checkbox"
                  checked={userProfile.hasHighBloodPressure}
                  onChange={(e) => setUserProfile(prev => ({
                    ...prev,
                    hasHighBloodPressure: e.target.checked
                  }))}
                />
                <span>高血圧です</span>
              </label>
            </div>
          </div>
        )}

        {safetyResult && safetyResult.warnings.length > 0 && (
          <div className="safety-warnings">
            <h4>⚠️ 安全性に関する注意事項</h4>
            <div className="warnings-list">
              {safetyResult.warnings.map((warning, index) => (
                <div key={index} className={`warning-item ${warning.type}`}>
                  <span className="warning-type-icon">{getWarningTypeIcon(warning.category)}</span>
                  <span className="warning-oil">{warning.oilName}: </span>
                  <span className="warning-message">{warning.message}</span>
                </div>
              ))}
            </div>
            
            {safetyResult.recommendedAlternatives && safetyResult.recommendedAlternatives.length > 0 && (
              <div className="alternatives-section">
                <h5>💡 推奨される代替案</h5>
                <div className="alternatives-list">
                  {safetyResult.recommendedAlternatives.map((alt, index) => (
                    <div key={index} className="alternative-item">
                      {alt}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {safetyResult && safetyResult.warnings.length === 0 && showSafetyChecker && (
          <div className="safety-all-clear">
            <div className="all-clear-message">
              <span className="all-clear-icon">✅</span>
              <span>現在の条件では安全に使用できます</span>
            </div>
          </div>
        )}
      </div>

      <div className="recipe-safety-section">
        <h3>⚠️ 一般的な安全性注意事項</h3>
        <div className="safety-notes">
          {recipe.safetyNotes.map((note, index) => (
            <div key={index} className="safety-note">
              <span className="safety-icon">⚠️</span>
              {note}
            </div>
          ))}
        </div>
      </div>

      {missingOils.length > 0 && (
        <div className="missing-oils-section">
          <h3>🛒 不足しているオイル</h3>
          <div className="missing-oils-list">
            {missingOils.map((oil, index) => (
              <div key={index} className="missing-oil-item">
                <span className="oil-name">{oil.oilName}</span>
                <span className="oil-drops">{oil.drops}滴必要</span>
              </div>
            ))}
          </div>
          <p className="missing-tip">
            💡 オイル一覧からこれらのオイルを確認して、マイオイルに追加してみましょう！
          </p>
        </div>
      )}

      <div className="disclaimer">
        <p>※ この情報は教育目的のものです。医療上の問題については医師にご相談ください。</p>
      </div>
      </div>
    </div>
  );
};

export default RecipeDetail;