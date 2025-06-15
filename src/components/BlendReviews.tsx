import React, { useState, useEffect } from 'react';
import { BlendReview } from '../types/CustomBlend';
import { useAuth } from '../contexts/AuthContext';
import { BlendReviewsManager } from '../utils/blendReviewsManager';
import BlendReviewModal from './BlendReviewModal';
import './BlendReviews.css';

interface BlendReviewsProps {
  blendId: string;
  blendName: string;
  isOwner: boolean;
}

const BlendReviews: React.FC<BlendReviewsProps> = ({ blendId, blendName, isOwner }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<BlendReview[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<BlendReview | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    loadReviews();
  }, [blendId]);

  const loadReviews = () => {
    const blendReviews = BlendReviewsManager.getReviewsByBlend(blendId);
    setReviews(blendReviews);
  };

  const handleSubmitReview = (reviewData: Omit<BlendReview, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingReview) {
      BlendReviewsManager.updateReview({
        ...reviewData,
        id: editingReview.id,
        createdAt: editingReview.createdAt,
        updatedAt: new Date()
      });
    } else {
      BlendReviewsManager.createReview(reviewData);
    }
    
    loadReviews();
    setShowReviewModal(false);
    setEditingReview(null);
  };

  const handleEditReview = (review: BlendReview) => {
    setEditingReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm('このレビューを削除してもよろしいですか？')) {
      BlendReviewsManager.deleteReview(reviewId);
      loadReviews();
    }
  };

  const handleToggleHelpful = (reviewId: string) => {
    BlendReviewsManager.toggleHelpful(reviewId, user?.id || 'guest');
    loadReviews();
  };

  const userReview = reviews.find(r => r.userId === (user?.id || 'guest'));
  const otherReviews = reviews.filter(r => r.userId !== (user?.id || 'guest'));

  const filteredReviews = otherReviews.filter(review => 
    filterRating ? review.rating === filterRating : true
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP');
  };

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    return (
      <div className={`stars ${size}`}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'filled' : ''}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="blend-reviews">
      {/* レビュー概要 */}
      <div className="reviews-summary">
        <h3>レビュー ({reviews.length})</h3>
        
        {reviews.length > 0 && (
          <div className="rating-overview">
            <div className="average-rating">
              <span className="rating-number">{averageRating.toFixed(1)}</span>
              {renderStars(Math.round(averageRating), 'large')}
              <span className="review-count">{reviews.length}件のレビュー</span>
            </div>
            
            <div className="rating-breakdown">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="rating-bar">
                  <span>{rating}★</span>
                  <div className="bar">
                    <div 
                      className="fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* レビュー投稿ボタン */}
      {!isOwner && (
        <div className="review-actions">
          {userReview ? (
            <div className="user-review-status">
              <span>レビュー投稿済み</span>
              <button 
                onClick={() => handleEditReview(userReview)}
                className="edit-review-btn"
              >
                編集
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowReviewModal(true)}
              className="write-review-btn"
            >
              レビューを書く
            </button>
          )}
        </div>
      )}

      {/* フィルター・ソート */}
      {reviews.length > 0 && (
        <div className="reviews-controls">
          <div className="sort-controls">
            <label>並び順:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">新しい順</option>
              <option value="oldest">古い順</option>
              <option value="highest">評価の高い順</option>
              <option value="lowest">評価の低い順</option>
              <option value="helpful">役立つ順</option>
            </select>
          </div>
          
          <div className="filter-controls">
            <label>評価で絞り込み:</label>
            <select 
              value={filterRating || ''} 
              onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">すべて</option>
              <option value="5">5★のみ</option>
              <option value="4">4★のみ</option>
              <option value="3">3★のみ</option>
              <option value="2">2★のみ</option>
              <option value="1">1★のみ</option>
            </select>
          </div>
        </div>
      )}

      {/* レビュー一覧 */}
      <div className="reviews-list">
        {sortedReviews.length > 0 ? (
          sortedReviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.userName}</span>
                  <span className="review-date">{formatDate(review.createdAt)}</span>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating, 'small')}
                </div>
                {review.userId === (user?.id || 'guest') && (
                  <div className="review-actions">
                    <button 
                      onClick={() => handleEditReview(review)}
                      className="edit-btn"
                    >
                      編集
                    </button>
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className="delete-btn"
                    >
                      削除
                    </button>
                  </div>
                )}
              </div>

              <h4 className="review-title">{review.title}</h4>
              <p className="review-comment">{review.comment}</p>

              <div className="detailed-ratings">
                <div className="rating-item">
                  <span>効果:</span>
                  {renderStars(review.effectiveness, 'small')}
                </div>
                <div className="rating-item">
                  <span>香り:</span>
                  {renderStars(review.fragrance, 'small')}
                </div>
                <div className="rating-item">
                  <span>使いやすさ:</span>
                  {renderStars(review.easeOfUse, 'small')}
                </div>
              </div>

              {review.wouldRecommend && (
                <div className="recommend-badge">
                  👍 推奨
                </div>
              )}

              <div className="review-footer">
                <button 
                  onClick={() => handleToggleHelpful(review.id)}
                  className="helpful-btn"
                >
                  👍 役に立った ({review.helpful})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">
            <p>まだレビューがありません</p>
            {!isOwner && !userReview && (
              <button 
                onClick={() => setShowReviewModal(true)}
                className="write-first-review-btn"
              >
                最初のレビューを書く
              </button>
            )}
          </div>
        )}
      </div>

      {/* レビューモーダル */}
      {showReviewModal && (
        <BlendReviewModal
          blendId={blendId}
          blendName={blendName}
          existingReview={editingReview}
          onSubmit={handleSubmitReview}
          onClose={() => {
            setShowReviewModal(false);
            setEditingReview(null);
          }}
        />
      )}
    </div>
  );
};

export default BlendReviews;