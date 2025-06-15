import React, { useState } from 'react';
import { MyOilData, MyOilUsage } from '../types/MyOil';
import './UsageModal.css';

interface UsageModalProps {
  myOil: MyOilData;
  onAddUsage: (myOilId: string, usage: Omit<MyOilUsage, 'id'>) => void;
  onClose: () => void;
}

const UsageModal: React.FC<UsageModalProps> = ({ myOil, onAddUsage, onClose }) => {
  const [usage, setUsage] = useState<Partial<Omit<MyOilUsage, 'id'>>>({
    date: new Date(),
    purpose: '',
    amount: 'few_drops',
    method: 'aromatic',
    effectiveness: 3,
    notes: ''
  });

  const purposes = [
    'リラックス',
    'ストレス緩和',
    '睡眠改善',
    '頭痛緩和',
    '消化促進',
    '免疫サポート',
    '集中力向上',
    '筋肉痛緩和',
    '気分転換',
    'スキンケア',
    '風邪予防',
    'その他'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usage.date && usage.purpose && usage.amount && usage.method && usage.effectiveness) {
      onAddUsage(myOil.id, {
        date: usage.date,
        purpose: usage.purpose,
        amount: usage.amount as 'few_drops' | 'moderate' | 'generous',
        method: usage.method as 'aromatic' | 'topical' | 'internal',
        effectiveness: usage.effectiveness as 1 | 2 | 3 | 4 | 5,
        notes: usage.notes
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content usage-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{myOil.oil?.name}の使用記録</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="usage-form">
          <div className="form-section">
            <div className="form-group">
              <label>使用日時 *</label>
              <input
                type="datetime-local"
                value={usage.date ? 
                  new Date(usage.date).toISOString().slice(0, 16) : ''
                }
                onChange={(e) => setUsage({
                  ...usage,
                  date: new Date(e.target.value)
                })}
                required
              />
            </div>

            <div className="form-group">
              <label>使用目的 *</label>
              <select
                value={usage.purpose}
                onChange={(e) => setUsage({
                  ...usage,
                  purpose: e.target.value
                })}
                required
              >
                <option value="">選択してください</option>
                {purposes.map(purpose => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>使用方法 *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="method"
                    value="aromatic"
                    checked={usage.method === 'aromatic'}
                    onChange={(e) => setUsage({
                      ...usage,
                      method: e.target.value as 'aromatic' | 'topical' | 'internal'
                    })}
                  />
                  <span>💨 アロマ</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="method"
                    value="topical"
                    checked={usage.method === 'topical'}
                    onChange={(e) => setUsage({
                      ...usage,
                      method: e.target.value as 'aromatic' | 'topical' | 'internal'
                    })}
                  />
                  <span>🤲 局所塗布</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="method"
                    value="internal"
                    checked={usage.method === 'internal'}
                    onChange={(e) => setUsage({
                      ...usage,
                      method: e.target.value as 'aromatic' | 'topical' | 'internal'
                    })}
                  />
                  <span>💧 内服</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>使用量 *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="amount"
                    value="few_drops"
                    checked={usage.amount === 'few_drops'}
                    onChange={(e) => setUsage({
                      ...usage,
                      amount: e.target.value as 'few_drops' | 'moderate' | 'generous'
                    })}
                  />
                  <span>少量（1-2滴）</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="amount"
                    value="moderate"
                    checked={usage.amount === 'moderate'}
                    onChange={(e) => setUsage({
                      ...usage,
                      amount: e.target.value as 'few_drops' | 'moderate' | 'generous'
                    })}
                  />
                  <span>適量（3-5滴）</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="amount"
                    value="generous"
                    checked={usage.amount === 'generous'}
                    onChange={(e) => setUsage({
                      ...usage,
                      amount: e.target.value as 'few_drops' | 'moderate' | 'generous'
                    })}
                  />
                  <span>多め（6滴以上）</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>効果の評価 *</label>
              <div className="effectiveness-rating">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    className={`star-btn ${usage.effectiveness && usage.effectiveness >= rating ? 'active' : ''}`}
                    onClick={() => setUsage({
                      ...usage,
                      effectiveness: rating as 1 | 2 | 3 | 4 | 5
                    })}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <small>1: 効果なし、5: とても効果的</small>
            </div>

            <div className="form-group">
              <label>メモ</label>
              <textarea
                rows={3}
                placeholder="使用感や気づいたことなど..."
                value={usage.notes || ''}
                onChange={(e) => setUsage({
                  ...usage,
                  notes: e.target.value
                })}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="submit-btn">
              記録
            </button>
          </div>
        </form>

        {myOil.usageHistory.length > 0 && (
          <div className="usage-history">
            <h3>📊 最近の使用履歴</h3>
            <div className="history-list">
              {myOil.usageHistory.slice(-5).reverse().map(history => (
                <div key={history.id} className="history-item">
                  <div className="history-date">
                    {new Date(history.date).toLocaleDateString('ja-JP')}
                  </div>
                  <div className="history-details">
                    <span>{history.purpose}</span>
                    <span className="method-tag">
                      {history.method === 'aromatic' ? '💨' : 
                       history.method === 'topical' ? '🤲' : '💧'}
                    </span>
                    <span className="effectiveness">
                      {'⭐'.repeat(history.effectiveness)}
                    </span>
                  </div>
                  {history.notes && (
                    <div className="history-notes">{history.notes}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageModal;