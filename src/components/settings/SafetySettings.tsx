import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import './SettingsSection.css';

const SafetySettings: React.FC = () => {
  const { safetySettings, updateSafetySettings, userProfile, updateUserProfile } = useSettings();
  const [newChildAge, setNewChildAge] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const addChildAge = () => {
    const age = parseInt(newChildAge);
    if (age > 0 && age < 18) {
      updateSafetySettings({
        childrenAges: [...safetySettings.childrenAges, age].sort((a, b) => a - b)
      });
      setNewChildAge('');
    }
  };

  const removeChildAge = (age: number) => {
    updateSafetySettings({
      childrenAges: safetySettings.childrenAges.filter(a => a !== age)
    });
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      updateUserProfile({
        allergies: [...userProfile.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    updateUserProfile({
      allergies: userProfile.allergies.filter(a => a !== allergy)
    });
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      updateUserProfile({
        medicalConditions: [...userProfile.medicalConditions, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    updateUserProfile({
      medicalConditions: userProfile.medicalConditions.filter(c => c !== condition)
    });
  };

  return (
    <div className="settings-section">
      <h2 className="section-title">🛡️ 安全設定</h2>
      <p className="section-description">
        あなたとご家族の安全のため、詳細な設定を行います。
        これらの情報は、より安全なオイルの推奨に使用されます。
      </p>

      <div className="safety-group">
        <h3>自動チェック設定</h3>
        
        <div className="toggle-item">
          <div className="toggle-label">
            <span>妊娠安全性を常にチェック</span>
            <small>すべてのオイル選択時に妊娠中の安全性を確認します</small>
          </div>
          <input
            type="checkbox"
            checked={safetySettings.alwaysCheckPregnancy}
            onChange={(e) => updateSafetySettings({
              alwaysCheckPregnancy: e.target.checked
            })}
          />
        </div>

        <div className="toggle-item">
          <div className="toggle-label">
            <span>子供の安全性を常にチェック</span>
            <small>お子様の年齢に応じた安全性を確認します</small>
          </div>
          <input
            type="checkbox"
            checked={safetySettings.alwaysCheckChildren}
            onChange={(e) => updateSafetySettings({
              alwaysCheckChildren: e.target.checked
            })}
          />
        </div>

        <div className="toggle-item">
          <div className="toggle-label">
            <span>ペットの安全性を常にチェック</span>
            <small>ペットに有害なオイルを警告します</small>
          </div>
          <input
            type="checkbox"
            checked={safetySettings.alwaysCheckPets}
            onChange={(e) => updateSafetySettings({
              alwaysCheckPets: e.target.checked
            })}
          />
        </div>

        <div className="toggle-item">
          <div className="toggle-label">
            <span>光毒性警告を表示</span>
            <small>日光に当たる前の使用について警告します</small>
          </div>
          <input
            type="checkbox"
            checked={safetySettings.photosensitivityWarning}
            onChange={(e) => updateSafetySettings({
              photosensitivityWarning: e.target.checked
            })}
          />
        </div>
      </div>

      <div className="safety-group">
        <h3>お子様の年齢</h3>
        <p className="form-help">お子様の年齢に応じた安全な使用方法を提案します</p>
        
        <div className="tag-input-group">
          <input
            type="number"
            min="0"
            max="17"
            placeholder="年齢を入力"
            value={newChildAge}
            onChange={(e) => setNewChildAge(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addChildAge()}
          />
          <button type="button" onClick={addChildAge} className="btn-secondary">
            追加
          </button>
        </div>

        <div className="tag-list">
          {safetySettings.childrenAges.map(age => (
            <span key={age} className="tag">
              {age}歳
              <button onClick={() => removeChildAge(age)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="safety-group">
        <h3>アレルギー</h3>
        <p className="form-help">アレルギー物質を含む可能性のあるオイルを警告します</p>
        
        <div className="tag-input-group">
          <input
            type="text"
            placeholder="アレルギー物質を入力"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
          />
          <button type="button" onClick={addAllergy} className="btn-secondary">
            追加
          </button>
        </div>

        <div className="tag-list">
          {userProfile.allergies.map(allergy => (
            <span key={allergy} className="tag">
              {allergy}
              <button onClick={() => removeAllergy(allergy)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="safety-group">
        <h3>既往症・服用中の薬</h3>
        <p className="form-help">相互作用の可能性がある場合に警告します</p>
        
        <div className="tag-input-group">
          <input
            type="text"
            placeholder="病名や薬名を入力"
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCondition()}
          />
          <button type="button" onClick={addCondition} className="btn-secondary">
            追加
          </button>
        </div>

        <div className="tag-list">
          {userProfile.medicalConditions.map(condition => (
            <span key={condition} className="tag">
              {condition}
              <button onClick={() => removeCondition(condition)}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="safety-notice">
        <p>
          <strong>⚠️ 重要:</strong> この設定は医療アドバイスに代わるものではありません。
          健康上の懸念がある場合は、必ず医療専門家にご相談ください。
        </p>
      </div>
    </div>
  );
};

export default SafetySettings;