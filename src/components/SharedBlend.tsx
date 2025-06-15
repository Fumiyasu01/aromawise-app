import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CustomBlend } from '../types/CustomBlend';
import { CustomBlendsManager } from '../utils/customBlendsManager';
import { oilsData } from '../data/oils';
import { getEnhancedOilById } from '../data/enhancedOils';
import { BlendCalculator } from '../utils/blendCalculator';
import './SharedBlend.css';

interface SharedBlendProps {
  encodedData: string;
  onClose: () => void;
}

const SharedBlend: React.FC<SharedBlendProps> = ({ encodedData, onClose }) => {
  const { user } = useAuth();
  const [blendData, setBlendData] = useState<Partial<CustomBlend> | null>(null);
  const [error, setError] = useState<string>('');
  const [imported, setImported] = useState(false);

  useEffect(() => {
    try {
      const decodedData = decodeURIComponent(atob(encodedData));
      const blend = JSON.parse(decodedData);
      setBlendData(blend);
    } catch (err) {
      setError('無効な共有リンクです');
      console.error('Failed to decode blend data:', err);
    }
  }, [encodedData]);

  const handleImportBlend = () => {
    if (!blendData) return;

    const newBlend = CustomBlendsManager.createBlend(
      {
        ...blendData,
        name: `${blendData.name} (インポート)`,
        isPublic: false
      },
      user?.id || 'guest'
    );

    if (newBlend) {
      setImported(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (error) {
    return (
      <div className="shared-blend-container">
        <div className="shared-blend-error">
          <h2>エラー</h2>
          <p>{error}</p>
          <button onClick={onClose} className="close-btn">閉じる</button>
        </div>
      </div>
    );
  }

  if (!blendData) {
    return (
      <div className="shared-blend-container">
        <div className="shared-blend-loading">
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  const calculation = blendData.ingredients ? BlendCalculator.calculate(blendData as CustomBlend) : null;

  return (
    <div className="shared-blend-container">
      <div className="shared-blend-card">
        <div className="shared-blend-header">
          <h2>共有されたブレンド</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="shared-blend-content">
          <h3>{blendData.name}</h3>
          {blendData.description && (
            <p className="blend-description">{blendData.description}</p>
          )}

          {blendData.ingredients && (
            <div className="ingredients-section">
              <h4>材料</h4>
              <ul className="ingredients-list">
                {blendData.ingredients.map((ing, index) => {
                  const basicOil = oilsData.find(o => o.id === ing.oilId);
                  const enhancedOil = !basicOil ? getEnhancedOilById(ing.oilId) : null;
                  const oilName = basicOil?.name || enhancedOil?.nameJa || ing.oilId;
                  
                  return (
                    <li key={index}>
                      <span className="oil-name">{oilName}</span>
                      <span className="oil-drops">{ing.drops}滴</span>
                      {ing.note && <span className="oil-note">{ing.note}</span>}
                    </li>
                  );
                })}
              </ul>
              <p className="total-drops">合計: {blendData.totalDrops || 0}滴</p>
            </div>
          )}

          {blendData.carrierOil && (
            <div className="carrier-section">
              <h4>キャリアオイル</h4>
              <p>{blendData.carrierOil} - {blendData.carrierAmount}ml</p>
              <p>希釈率: {blendData.dilutionRatio}%</p>
            </div>
          )}

          {blendData.instructions && (
            <div className="instructions-section">
              <h4>使用方法</h4>
              <p>{blendData.instructions}</p>
            </div>
          )}

          {blendData.precautions && (
            <div className="precautions-section">
              <h4>注意事項</h4>
              <p>{blendData.precautions}</p>
            </div>
          )}

          {calculation && calculation.safetyWarnings.length > 0 && (
            <div className="safety-warnings">
              <h4>⚠️ 安全性の注意</h4>
              <ul>
                {calculation.safetyWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="shared-blend-actions">
          {imported ? (
            <div className="import-success">
              ✓ マイブレンドに保存しました
            </div>
          ) : (
            <button 
              onClick={handleImportBlend}
              className="import-btn"
            >
              マイブレンドに保存
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedBlend;