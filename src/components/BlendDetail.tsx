import React, { useState, useEffect } from 'react';
import { BlendSuggestion } from '../types/FragranceBlend';
import { Oil } from '../types/Oil';
import { fragranceProfiles } from '../data/fragranceProfiles';
import { RecipeSafetyEvaluator, UserSafetyProfile, RecipeSafetyResult } from '../utils/recipeSafety';
import BackHeader from './BackHeader';
import './BlendDetail.css';

interface BlendDetailProps {
  blend: BlendSuggestion;
  myOils: Oil[];
  onBack: () => void;
}

const BlendDetail: React.FC<BlendDetailProps> = ({ blend, myOils, onBack }) => {
  const [userProfile, setUserProfile] = useState<UserSafetyProfile>(
    RecipeSafetyEvaluator.getDefaultUserProfile()
  );
  const [safetyResult, setSafetyResult] = useState<RecipeSafetyResult | null>(null);
  const [showSafetyChecker, setShowSafetyChecker] = useState(false);

  const canMake = blend.oils.every(blendOil => 
    myOils.some(myOil => myOil.id === blendOil.oilId)
  );

  const missingOils = blend.oils.filter(blendOil => 
    !myOils.some(myOil => myOil.id === blendOil.oilId)
  );

  useEffect(() => {
    const result = RecipeSafetyEvaluator.evaluateBlendSuggestion(blend, userProfile);
    setSafetyResult(result);
  }, [blend, userProfile]);

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 4.5) return '#4caf50';
    if (compatibility >= 4.0) return '#8bc34a';
    if (compatibility >= 3.5) return '#ff9800';
    return '#f44336';
  };

  const getCompatibilityLabel = (compatibility: number) => {
    if (compatibility >= 4.5) return '最高の相性';
    if (compatibility >= 4.0) return '相性良好';
    if (compatibility >= 3.5) return '相性普通';
    return '上級者向け';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      energizing: '⚡',
      relaxing: '🧘',
      romantic: '💕',
      fresh: '🌿',
      sophisticated: '✨'
    };
    return icons[category] || '🌸';
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      energizing: 'エナジー',
      relaxing: 'リラックス',
      romantic: 'ロマンチック',
      fresh: 'フレッシュ',
      sophisticated: '上品'
    };
    return names[category] || category;
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      primary: '🎯',
      secondary: '🔸',
      accent: '✨'
    };
    return icons[role as keyof typeof icons] || '•';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      primary: 'メインノート',
      secondary: 'サブノート',
      accent: 'アクセントノート'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      primary: 'ブレンドの中心となる香り。最も印象に残る主役の香りです。',
      secondary: 'メインを支える重要な香り。全体のバランスを整えます。',
      accent: '全体に深みと複雑さを与える隠し味の香りです。'
    };
    return descriptions[role as keyof typeof descriptions] || '';
  };

  const getOilProfile = (oilId: string) => {
    return fragranceProfiles.find(profile => profile.oilId === oilId);
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

  const totalDrops = blend.oils.reduce((sum, oil) => sum + oil.drops, 0);

  return (
    <div className="blend-detail">
      <BackHeader 
        title={blend.name}
        subtitle={getCategoryName(blend.category)}
        backLabel="香りブレンド"
        onBack={onBack}
      />
      <div className="blend-detail-content">
      <div className="blend-detail-header">
        <div className="blend-title">
          <span className="blend-category-icon">{getCategoryIcon(blend.category)}</span>
          <div>
            <h1>{blend.name}</h1>
            <p className="blend-category">{getCategoryName(blend.category)}</p>
          </div>
        </div>
        <div className="blend-rating">
          <span 
            className="compatibility-score"
            style={{ color: getCompatibilityColor(blend.compatibility) }}
          >
            ★ {blend.compatibility}
          </span>
          <span className="compatibility-label">
            {getCompatibilityLabel(blend.compatibility)}
          </span>
        </div>
      </div>

      <div className="blend-status-section">
        {canMake ? (
          <div className="status-card can-make">
            <span className="status-icon">✅</span>
            <div>
              <h3>このブレンドを作成できます！</h3>
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

      <div className="blend-description-section">
        <h3>🌸 ブレンドについて</h3>
        <p>{blend.description}</p>
        <div className="blend-mood">
          <strong>醸し出す雰囲気:</strong> {blend.mood}
        </div>
      </div>

      <div className="blend-recipe-section">
        <h3>🧪 レシピ（全{totalDrops}滴）</h3>
        <div className="recipe-oils">
          {blend.oils.map((oil, index) => {
            const hasOil = myOils.some(myOil => myOil.id === oil.oilId);
            const profile = getOilProfile(oil.oilId);
            const percentage = Math.round((oil.drops / totalDrops) * 100);

            return (
              <div key={index} className={`recipe-oil-item ${hasOil ? 'have' : 'missing'}`}>
                <div className="oil-header">
                  <div className="oil-status-name">
                    <span className="oil-status">{hasOil ? '✅' : '❌'}</span>
                    <span className="oil-name">{oil.oilName}</span>
                  </div>
                  <div className="oil-amount">
                    <span className="oil-drops">{oil.drops}滴</span>
                    <span className="oil-percentage">({percentage}%)</span>
                  </div>
                </div>
                
                <div className="oil-role-info">
                  <span className="role-icon">{getRoleIcon(oil.role)}</span>
                  <span className="role-label">{getRoleLabel(oil.role)}</span>
                </div>
                
                <p className="role-description">{getRoleDescription(oil.role)}</p>
                
                {profile && (
                  <div className="oil-profile">
                    <div className="profile-notes">
                      <div className="note-group">
                        <strong>トップ:</strong> {profile.notes.top.join(', ')}
                      </div>
                      <div className="note-group">
                        <strong>ミドル:</strong> {profile.notes.middle.join(', ')}
                      </div>
                      <div className="note-group">
                        <strong>ベース:</strong> {profile.notes.base.join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="blend-usage-section">
        <h3>💡 使用方法</h3>
        <div className="usage-methods">
          <div className="usage-method">
            <span className="usage-icon">💨</span>
            <div>
              <h4>ディフューザー</h4>
              <p>水100mlに対してレシピ通りの滴数を加えて、1-2時間拡散させます。</p>
            </div>
          </div>
          <div className="usage-method">
            <span className="usage-icon">🤲</span>
            <div>
              <h4>アロマローラー</h4>
              <p>10mlローラーボトルにキャリアオイルと一緒に入れて、手首や首筋に塗布。</p>
            </div>
          </div>
          <div className="usage-method">
            <span className="usage-icon">🛁</span>
            <div>
              <h4>アロマバス</h4>
              <p>お風呂のお湯に3-5滴加えて、リラックスバスタイムを楽しみます。</p>
            </div>
          </div>
        </div>
      </div>

      <div className="blend-tips-section">
        <h3>✨ ブレンドのコツ</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">🎯</span>
            <p>メインノートから順番に加えることで、香りのバランスが取りやすくなります。</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⏱️</span>
            <p>作成後30分ほど置くと、香りが馴染んで真の香りを確認できます。</p>
          </div>
          <div className="tip-item">
            <span className="tip-icon">📝</span>
            <p>お気に入りの配合比率をメモしておくと、再現しやすくなります。</p>
          </div>
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

      {missingOils.length > 0 && (
        <div className="missing-oils-section">
          <h3>🛒 不足しているオイル</h3>
          <div className="missing-oils-list">
            {missingOils.map((oil, index) => (
              <div key={index} className="missing-oil-item">
                <span className="oil-name">{oil.oilName}</span>
                <span className="oil-role">({getRoleLabel(oil.role)})</span>
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
        <p>※ 香りの感じ方には個人差があります。少量から試して、お好みの配合を見つけてください。</p>
      </div>
      </div>
    </div>
  );
};

export default BlendDetail;