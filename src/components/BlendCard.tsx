import React, { useState } from 'react';
import { CustomBlend } from '../types/CustomBlend';
import { oilsData } from '../data/oils';
import { getEnhancedOilById } from '../data/enhancedOils';
import { BlendCalculator } from '../utils/blendCalculator';
import BlendShareModal from './BlendShareModal';
import './BlendCard.css';

interface BlendCardProps {
  blend: CustomBlend;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleLike: () => void;
}

const BlendCard: React.FC<BlendCardProps> = ({
  blend,
  isOwner,
  onEdit,
  onDelete,
  onToggleLike
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const calculation = BlendCalculator.calculate(blend);
  
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      relaxation: 'リラクゼーション',
      energy: 'エネルギー',
      focus: '集中力',
      sleep: '睡眠',
      wellness: '健康',
      beauty: '美容',
      cleaning: 'お掃除',
      seasonal: '季節',
      custom: 'その他'
    };
    return labels[category] || category;
  };

  return (
    <div className="blend-card">
      <div className="blend-card-header">
        <h3>{blend.name}</h3>
        <div className="blend-card-actions">
          {isOwner && (
            <>
              <button onClick={onEdit} className="edit-btn" title="編集">
                ✏️
              </button>
              <button onClick={onDelete} className="delete-btn" title="削除">
                🗑️
              </button>
            </>
          )}
          <button onClick={onToggleLike} className="like-btn" title="いいね">
            ❤️ {blend.likes}
          </button>
          <button onClick={() => setShowShareModal(true)} className="share-btn" title="共有">
            🔗
          </button>
        </div>
      </div>

      <div className="blend-card-meta">
        <span className="category-tag">{getCategoryLabel(blend.category)}</span>
        <span className="date">{formatDate(blend.updatedAt)}</span>
      </div>

      {blend.description && (
        <p className="blend-description">{blend.description}</p>
      )}

      <div className="blend-ingredients">
        <h4>配合オイル ({blend.totalDrops}滴)</h4>
        <ul>
          {blend.ingredients.map((ing, index) => {
            const basicOil = oilsData.find(o => o.id === ing.oilId);
            const enhancedOil = !basicOil ? getEnhancedOilById(ing.oilId) : null;
            const oilName = basicOil?.name || enhancedOil?.nameJa || 'Unknown';
            const percentage = ((ing.drops / blend.totalDrops) * 100).toFixed(1);
            return (
              <li key={index}>
                <span className="oil-name">{oilName}</span>
                <span className="oil-info">
                  {ing.drops}滴 ({percentage}%)
                  {ing.note && <span className={`note-indicator ${ing.note}`}>{ing.note[0].toUpperCase()}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="blend-details">
        <div className="detail-item">
          <span className="label">希釈率:</span>
          <span className="value">{calculation.dilutionPercentage.toFixed(1)}%</span>
        </div>
        {blend.carrierOil && (
          <div className="detail-item">
            <span className="label">キャリアオイル:</span>
            <span className="value">
              {blend.carrierOil} ({blend.carrierAmount}ml)
            </span>
          </div>
        )}
      </div>

      {blend.tags.length > 0 && (
        <div className="blend-tags">
          {blend.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}

      {calculation.safetyWarnings.length > 0 && (
        <div className="safety-warnings">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">
            {calculation.safetyWarnings.length}件の注意事項
          </span>
        </div>
      )}

      {blend.isPublic && (
        <div className="public-indicator">
          <span>🌍 公開中</span>
        </div>
      )}

      {showShareModal && (
        <BlendShareModal
          blend={blend}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default BlendCard;