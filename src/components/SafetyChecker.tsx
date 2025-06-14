import React, { useState } from 'react';
import { EnhancedOil } from '../types/EnhancedOil';
import './SafetyChecker.css';

interface SafetyCheckerProps {
  oil: EnhancedOil;
  onSafetyChange?: (safetyWarnings: string[]) => void;
}

interface UserConditions {
  isPregnant: boolean;
  pregnancyTrimester: 1 | 2 | 3 | null;
  hasBaby: boolean;
  babyAgeMonths: number;
  hasPets: boolean;
  petTypes: ('cat' | 'dog')[];
  willExposeToSun: boolean;
}

const SafetyChecker: React.FC<SafetyCheckerProps> = ({ oil, onSafetyChange }) => {
  const [userConditions, setUserConditions] = useState<UserConditions>({
    isPregnant: false,
    pregnancyTrimester: null,
    hasBaby: false,
    babyAgeMonths: 0,
    hasPets: false,
    petTypes: [],
    willExposeToSun: false
  });

  const [showChecker, setShowChecker] = useState(false);

  const checkSafety = (): string[] => {
    const warnings: string[] = [];

    // 赤ちゃん安全性チェック
    if (userConditions.hasBaby) {
      if (!oil.safety.baby.safe) {
        warnings.push(`👶 赤ちゃんには使用できません: ${oil.safety.baby.ageRestriction}`);
      } else {
        const ageRestriction = extractAgeFromRestriction(oil.safety.baby.ageRestriction);
        if (userConditions.babyAgeMonths < ageRestriction) {
          warnings.push(`👶 赤ちゃんの月齢が不足: ${oil.safety.baby.ageRestriction}`);
        }
      }
    }

    // 妊娠中安全性チェック
    if (userConditions.isPregnant) {
      if (!oil.safety.pregnancy.safe) {
        warnings.push(`🤰 妊娠中は使用できません`);
      } else if (userConditions.pregnancyTrimester === 1 && oil.safety.pregnancy.notes.includes('第2・3トリメスター')) {
        warnings.push(`🤰 第1トリメスターでの使用は避けてください`);
      }
    }

    // 光毒性チェック
    if (userConditions.willExposeToSun && oil.safety.photosensitivity.sensitive) {
      warnings.push(`☀️ 使用後${oil.safety.photosensitivity.hours}時間は日光を避けてください`);
    }

    // ペット安全性チェック
    if (userConditions.hasPets) {
      if (userConditions.petTypes.includes('cat') && oil.safety.petSafety.includes('猫への使用は避ける')) {
        warnings.push(`🐱 猫がいる環境では使用を避けてください`);
      }
      if (userConditions.petTypes.includes('dog') && oil.safety.petSafety.includes('犬への使用も注意')) {
        warnings.push(`🐕 犬がいる場合は十分に希釈してください`);
      }
    }

    // 一般的な警告
    if (oil.safety.warnings) {
      warnings.push(`⚠️ ${oil.safety.warnings}`);
    }

    return warnings;
  };

  const extractAgeFromRestriction = (restriction: string): number => {
    const monthMatch = restriction.match(/(\d+)ヶ月/);
    if (monthMatch) return parseInt(monthMatch[1]);
    
    const yearMatch = restriction.match(/(\d+)歳/);
    if (yearMatch) return parseInt(yearMatch[1]) * 12;
    
    return 0;
  };

  const safetyWarnings = checkSafety();

  React.useEffect(() => {
    if (onSafetyChange) {
      onSafetyChange(safetyWarnings);
    }
  }, [safetyWarnings, onSafetyChange]);

  const getSafetyLevel = () => {
    if (safetyWarnings.length === 0) return 'safe';
    if (safetyWarnings.some(w => w.includes('使用できません'))) return 'danger';
    return 'warning';
  };

  const getSafetyColor = () => {
    const level = getSafetyLevel();
    switch (level) {
      case 'safe': return '#4caf50';
      case 'warning': return '#ff9800';
      case 'danger': return '#f44336';
      default: return '#666';
    }
  };

  const getSafetyIcon = () => {
    const level = getSafetyLevel();
    switch (level) {
      case 'safe': return '✅';
      case 'warning': return '⚠️';
      case 'danger': return '🚫';
      default: return '❓';
    }
  };

  return (
    <div className="safety-checker">
      <div className="safety-summary">
        <button 
          className="safety-check-btn"
          onClick={() => setShowChecker(!showChecker)}
          style={{ borderColor: getSafetyColor() }}
        >
          <span className="safety-icon">{getSafetyIcon()}</span>
          <span>安全性チェック</span>
          <span className="toggle-icon">{showChecker ? '▼' : '▶'}</span>
        </button>
        
        {safetyWarnings.length > 0 && (
          <div className="safety-warnings-preview">
            <span className="warning-count">{safetyWarnings.length}件の注意事項</span>
          </div>
        )}
      </div>

      {showChecker && (
        <div className="safety-checker-form">
          <h4>あなたの状況を教えてください</h4>
          
          <div className="condition-section">
            <label className="condition-item">
              <input
                type="checkbox"
                checked={userConditions.isPregnant}
                onChange={(e) => setUserConditions(prev => ({
                  ...prev,
                  isPregnant: e.target.checked,
                  pregnancyTrimester: e.target.checked ? 2 : null
                }))}
              />
              <span>妊娠中です</span>
            </label>
            
            {userConditions.isPregnant && (
              <div className="trimester-selector">
                <label>妊娠期間:</label>
                {[1, 2, 3].map(trimester => (
                  <label key={trimester} className="radio-item">
                    <input
                      type="radio"
                      name="trimester"
                      checked={userConditions.pregnancyTrimester === trimester}
                      onChange={() => setUserConditions(prev => ({
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
                checked={userConditions.hasBaby}
                onChange={(e) => setUserConditions(prev => ({
                  ...prev,
                  hasBaby: e.target.checked
                }))}
              />
              <span>赤ちゃんがいます</span>
            </label>
            
            {userConditions.hasBaby && (
              <div className="baby-age-selector">
                <label>赤ちゃんの月齢:</label>
                <select
                  value={userConditions.babyAgeMonths}
                  onChange={(e) => setUserConditions(prev => ({
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
                checked={userConditions.hasPets}
                onChange={(e) => setUserConditions(prev => ({
                  ...prev,
                  hasPets: e.target.checked,
                  petTypes: e.target.checked ? prev.petTypes : []
                }))}
              />
              <span>ペットがいます</span>
            </label>
            
            {userConditions.hasPets && (
              <div className="pet-types">
                {['cat', 'dog'].map(petType => (
                  <label key={petType} className="condition-item">
                    <input
                      type="checkbox"
                      checked={userConditions.petTypes.includes(petType as 'cat' | 'dog')}
                      onChange={(e) => {
                        const updatedPetTypes = e.target.checked
                          ? [...userConditions.petTypes, petType as 'cat' | 'dog']
                          : userConditions.petTypes.filter(p => p !== petType);
                        setUserConditions(prev => ({
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

          {oil.safety.photosensitivity.sensitive && (
            <div className="condition-section">
              <label className="condition-item">
                <input
                  type="checkbox"
                  checked={userConditions.willExposeToSun}
                  onChange={(e) => setUserConditions(prev => ({
                    ...prev,
                    willExposeToSun: e.target.checked
                  }))}
                />
                <span>使用後に日光に当たる予定があります</span>
              </label>
            </div>
          )}
        </div>
      )}

      {safetyWarnings.length > 0 && (
        <div className="safety-warnings">
          <h4>⚠️ 安全性に関する注意事項</h4>
          <div className="warnings-list">
            {safetyWarnings.map((warning, index) => (
              <div key={index} className="warning-item">
                {warning}
              </div>
            ))}
          </div>
        </div>
      )}

      {safetyWarnings.length === 0 && showChecker && (
        <div className="safety-all-clear">
          <div className="all-clear-message">
            <span className="all-clear-icon">✅</span>
            <span>現在の条件では安全に使用できます</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyChecker;