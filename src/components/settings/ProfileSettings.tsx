import React, { useState } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import './SettingsSection.css';

const ProfileSettings: React.FC = () => {
  const { userProfile, updateUserProfile } = useSettings();
  const { user, isAuthenticated, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setEditMode(false);
  };

  return (
    <div className="settings-section">
      <h2 className="section-title">👤 アカウント設定</h2>
      <p className="section-description">
        プロフィール情報を管理します。この情報は、より適切なオイルの推奨に使用されます。
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>お名前</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!editMode}
            placeholder="山田 太郎"
          />
        </div>

        <div className="form-group">
          <label>メールアドレス</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!editMode}
            placeholder="example@email.com"
          />
          <p className="form-help">※将来のアカウント連携機能で使用されます</p>
        </div>

        <div className="form-group">
          <label>年齢</label>
          <input
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            disabled={!editMode}
          />
          <p className="form-help">年齢に応じた安全な使用方法を提案します</p>
        </div>

        <div className="health-section">
          <h3>健康状態</h3>
          
          <div className="toggle-item">
            <div className="toggle-label">
              <span>妊娠中</span>
              <small>妊娠中の方向けの安全情報を表示します</small>
            </div>
            <input
              type="checkbox"
              checked={formData.isPregnant}
              onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
              disabled={!editMode}
            />
          </div>

          {formData.isPregnant && (
            <div className="form-group">
              <label>妊娠期間</label>
              <select
                value={formData.pregnancyTrimester || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  pregnancyTrimester: e.target.value ? parseInt(e.target.value) as 1 | 2 | 3 : undefined 
                })}
                disabled={!editMode}
              >
                <option value="">選択してください</option>
                <option value="1">第1トリメスター（1-13週）</option>
                <option value="2">第2トリメスター（14-27週）</option>
                <option value="3">第3トリメスター（28週以降）</option>
              </select>
            </div>
          )}

          <div className="toggle-item">
            <div className="toggle-label">
              <span>授乳中</span>
              <small>授乳中の方向けの安全情報を表示します</small>
            </div>
            <input
              type="checkbox"
              checked={formData.isNursing}
              onChange={(e) => setFormData({ ...formData, isNursing: e.target.checked })}
              disabled={!editMode}
            />
          </div>

          <div className="toggle-item">
            <div className="toggle-label">
              <span>ペットを飼っている</span>
              <small>ペットに安全なオイルのみを推奨します</small>
            </div>
            <input
              type="checkbox"
              checked={formData.hasPets}
              onChange={(e) => setFormData({ ...formData, hasPets: e.target.checked })}
              disabled={!editMode}
            />
          </div>

          {formData.hasPets && (
            <div className="form-group">
              <label>ペットの種類</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.petTypes.includes('dog')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, petTypes: [...formData.petTypes, 'dog'] });
                      } else {
                        setFormData({ ...formData, petTypes: formData.petTypes.filter(t => t !== 'dog') });
                      }
                    }}
                    disabled={!editMode}
                  />
                  <span>犬</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.petTypes.includes('cat')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, petTypes: [...formData.petTypes, 'cat'] });
                      } else {
                        setFormData({ ...formData, petTypes: formData.petTypes.filter(t => t !== 'cat') });
                      }
                    }}
                    disabled={!editMode}
                  />
                  <span>猫</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.petTypes.includes('other')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({ ...formData, petTypes: [...formData.petTypes, 'other'] });
                      } else {
                        setFormData({ ...formData, petTypes: formData.petTypes.filter(t => t !== 'other') });
                      }
                    }}
                    disabled={!editMode}
                  />
                  <span>その他</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          {editMode ? (
            <>
              <button type="submit" className="btn-primary">保存</button>
              <button type="button" className="btn-secondary" onClick={handleCancel}>
                キャンセル
              </button>
            </>
          ) : (
            <button type="button" className="btn-primary" onClick={() => setEditMode(true)}>
              編集
            </button>
          )}
        </div>
      </form>

      <div className="subscription-section">
        <h3>🔐 アカウント状態</h3>
        {isAuthenticated && user ? (
          <>
            <div className="subscription-card">
              <div className="plan-info">
                <h4>{user.isGuest ? 'ゲストユーザー' : 'ログイン済み'}</h4>
                <p>{user.isGuest ? 'データはこのデバイスにのみ保存されます' : user.email}</p>
              </div>
              {user.isGuest ? (
                <button className="btn-secondary" onClick={() => window.location.reload()}>
                  アカウント作成
                </button>
              ) : (
                <button className="btn-secondary" onClick={() => logout()}>
                  ログアウト
                </button>
              )}
            </div>
            
            {user.subscription && (
              <div className="subscription-section">
                <h3>📱 サブスクリプション</h3>
                <div className="subscription-card">
                  <div className="plan-info">
                    <h4>{user.subscription.plan === 'free' ? '無料プラン' : 
                         user.subscription.plan === 'basic' ? 'ベーシックプラン' : 
                         'プレミアムプラン'}</h4>
                    <p>
                      {user.subscription.status === 'trial' && '無料トライアル中'}
                      {user.subscription.expiresAt && 
                        ` (${new Date(user.subscription.expiresAt).toLocaleDateString('ja-JP')}まで)`}
                    </p>
                  </div>
                  <button 
                    className="btn-secondary"
                    onClick={() => window.location.href = '/#pricing'}
                  >
                    アップグレード
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="subscription-card">
            <div className="plan-info">
              <h4>未ログイン</h4>
              <p>ログインして全ての機能をお使いください</p>
            </div>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              ログイン
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;