import React, { useState } from 'react';
import { analytics } from '../utils/analytics';
import './Feedback.css';

interface FeedbackProps {
  onClose: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [category, setCategory] = useState<string>('general');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'general': '全般的な感想',
      'usability': '使いやすさ',
      'content': 'コンテンツ',
      'features': '機能について',
      'bug': 'バグ報告',
      'suggestion': '改善提案'
    };
    return labels[category] || category;
  };

  const categories = [
    { value: 'general', label: '全般的な感想' },
    { value: 'usability', label: '使いやすさ' },
    { value: 'content', label: 'コンテンツ' },
    { value: 'features', label: '機能について' },
    { value: 'bug', label: 'バグ報告' },
    { value: 'suggestion', label: '改善提案' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // ローカルストレージに保存
    const feedback = {
      id: Date.now().toString(),
      rating,
      comment,
      category,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const existingFeedback = JSON.parse(localStorage.getItem('aromawise_feedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('aromawise_feedback', JSON.stringify(existingFeedback));

    try {
      // Google Forms送信
      const formData = new FormData();
      formData.append('entry.521869119', `${feedback.rating}⭐`);
      formData.append('entry.1313356794', `${getCategoryLabel(feedback.category)} - ${feedback.comment || 'コメントなし'}`);
      
      console.log('Google Formsに送信中...', {
        rating: `${feedback.rating}⭐`,
        categoryAndComment: `${getCategoryLabel(feedback.category)} - ${feedback.comment || 'コメントなし'}`
      });
      
      const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSfQMEwtCtjSCDvnV0_qRARQobaOxqjzC5K7_P9bP4o1_0oxxw/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      console.log('Google Forms送信完了:', response);
      
      // 使用統計更新
      const stats = JSON.parse(localStorage.getItem('aromawise_usage_stats') || '{}');
      stats.feedbackCount = (stats.feedbackCount || 0) + 1;
      stats.lastFeedbackDate = new Date().toISOString();
      localStorage.setItem('aromawise_usage_stats', JSON.stringify(stats));
      
      // アナリティクス記録
      analytics.trackInteraction('navigation', { 
        action: 'feedback_submit', 
        rating, 
        category, 
        sent_successfully: true,
        method: 'google_forms'
      }, 'feedback');

      setSubmitted(true);
      
      // 3秒後に自動で閉じる
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Google Forms送信エラー:', error);
      
      // エラーでもローカルには保存済みなので成功扱い
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-overlay">
        <div className="feedback-modal feedback-success">
          <div className="feedback-success-content">
            <div className="success-icon">✨</div>
            <h3>フィードバックありがとうございます！</h3>
            <p>あなたのご意見を参考に、より良いアプリにしていきます。</p>
            <button onClick={onClose} className="feedback-close-btn">
              閉じる
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <div className="feedback-header">
          <h3>📝 フィードバック</h3>
          <button onClick={onClose} className="feedback-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-section">
            <label className="feedback-label">📊 満足度を教えてください</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= rating ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
            <div className="rating-text">
              {rating === 0 && '評価を選択してください'}
              {rating === 1 && '不満'}
              {rating === 2 && 'やや不満'}
              {rating === 3 && '普通'}
              {rating === 4 && '満足'}
              {rating === 5 && '大変満足'}
            </div>
          </div>

          <div className="feedback-section">
            <label className="feedback-label">🏷️ カテゴリ</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="feedback-select"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="feedback-section">
            <label className="feedback-label">💬 ご意見・ご感想 (任意)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="良かった点、改善してほしい点、ご要望など何でもお聞かせください..."
              className="feedback-textarea"
              rows={4}
            />
          </div>

          <div className="feedback-actions">
            <button type="button" onClick={onClose} className="feedback-cancel">
              キャンセル
            </button>
            <button 
              type="submit" 
              className="feedback-submit"
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? '送信中...' : '送信'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;