import React, { useState } from 'react';
import { BlendReview } from '../types/CustomBlend';
import { useAuth } from '../contexts/AuthContext';
import './BlendReviewModal.css';

interface BlendReviewModalProps {
  blendId: string;
  blendName: string;
  existingReview?: BlendReview | null;
  onSubmit: (review: Omit<BlendReview, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const BlendReviewModal: React.FC<BlendReviewModalProps> = ({
  blendId,
  blendName,
  existingReview,
  onSubmit,
  onClose
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || '',
    effectiveness: existingReview?.effectiveness || 0,
    fragrance: existingReview?.fragrance || 0,
    easeOfUse: existingReview?.easeOfUse || 0,
    wouldRecommend: existingReview?.wouldRecommend || false
  });
  const [errors, setErrors] = useState<string[]>([]);

  const StarRating: React.FC<{
    value: number;
    onChange: (value: number) => void;
    label: string;
  }> = ({ value, onChange, label }) => (
    <div className="star-rating">
      <label>{label}</label>
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`star ${star <= value ? 'filled' : ''}`}
            onClick={() => onChange(star)}
          >
            ★
          </button>
        ))}
      </div>
      <span className="rating-text">
        {value > 0 ? getRatingText(value) : '未評価'}
      </span>
    </div>
  );

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1: return '悪い';
      case 2: return '良くない';
      case 3: return '普通';
      case 4: return '良い';
      case 5: return '優秀';
      default: return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (formData.rating === 0) {
      newErrors.push('総合評価を選択してください');
    }

    if (!formData.title.trim()) {
      newErrors.push('レビュータイトルを入力してください');
    }

    if (!formData.comment.trim()) {
      newErrors.push('レビューコメントを入力してください');
    }

    if (formData.effectiveness === 0) {
      newErrors.push('効果の評価を選択してください');
    }

    if (formData.fragrance === 0) {
      newErrors.push('香りの評価を選択してください');
    }

    if (formData.easeOfUse === 0) {
      newErrors.push('使いやすさの評価を選択してください');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const reviewData: Omit<BlendReview, 'id' | 'createdAt' | 'updatedAt'> = {
      blendId,
      userId: user?.id || 'guest',
      userName: user?.name || 'ゲストユーザー',
      rating: formData.rating,
      title: formData.title.trim(),
      comment: formData.comment.trim(),
      effectiveness: formData.effectiveness,
      fragrance: formData.fragrance,
      easeOfUse: formData.easeOfUse,
      wouldRecommend: formData.wouldRecommend,
      helpful: existingReview?.helpful || 0,
      reported: false
    };

    onSubmit(reviewData);
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h2>{existingReview ? 'レビューを編集' : 'レビューを投稿'}</h2>
          <p className="blend-name">{blendName}</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          {/* 総合評価 */}
          <StarRating
            value={formData.rating}
            onChange={(value) => setFormData({ ...formData, rating: value })}
            label="総合評価 *"
          />

          {/* レビュータイトル */}
          <div className="form-group">
            <label>レビュータイトル *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="このブレンドの印象を一言で"
              maxLength={100}
            />
          </div>

          {/* レビューコメント */}
          <div className="form-group">
            <label>レビューコメント *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="このブレンドの効果、香り、使用感などを詳しく教えてください"
              rows={4}
              maxLength={1000}
            />
            <small>{formData.comment.length}/1000文字</small>
          </div>

          {/* 詳細評価 */}
          <div className="detailed-ratings">
            <h3>詳細評価</h3>
            
            <StarRating
              value={formData.effectiveness}
              onChange={(value) => setFormData({ ...formData, effectiveness: value })}
              label="効果 *"
            />

            <StarRating
              value={formData.fragrance}
              onChange={(value) => setFormData({ ...formData, fragrance: value })}
              label="香り *"
            />

            <StarRating
              value={formData.easeOfUse}
              onChange={(value) => setFormData({ ...formData, easeOfUse: value })}
              label="使いやすさ *"
            />
          </div>

          {/* 推奨 */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.wouldRecommend}
                onChange={(e) => setFormData({ ...formData, wouldRecommend: e.target.checked })}
              />
              <span>このブレンドを他の人に推奨しますか？</span>
            </label>
          </div>

          {/* エラー表示 */}
          {errors.length > 0 && (
            <div className="error-messages">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* アクションボタン */}
          <div className="review-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              キャンセル
            </button>
            <button type="submit" className="submit-btn">
              {existingReview ? '更新' : '投稿'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlendReviewModal;