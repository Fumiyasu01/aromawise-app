import React, { useState, useEffect } from 'react';
import { Oil } from '../types/Oil';
import { MyOilData, MyOilInventory, MyOilUsage } from '../types/MyOil';
import { MyOilsManager } from '../utils/myOilsManager';
import { oilsData } from '../data/oils';
import { enhancedOilsData } from '../data/enhancedOils';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import AddOilModal from './AddOilModal';
import UsageModal from './UsageModal';
import './MyOilsEnhanced.css';

interface MyOilsEnhancedProps {
  onOilSelect: (oil: Oil) => void;
}

type ViewMode = 'grid' | 'list' | 'stats';
type TabMode = 'inventory' | 'usage' | 'favorites' | 'alerts';

const MyOilsEnhanced: React.FC<MyOilsEnhancedProps> = ({ onOilSelect }) => {
  const { checkFeatureAccess, getPlanLimitation, getCurrentPlan } = useSubscription();
  const { isAuthenticated, user } = useAuth();
  const [myOils, setMyOils] = useState<MyOilData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [tabMode, setTabMode] = useState<TabMode>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedOil, setSelectedOil] = useState<MyOilData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string>('');

  useEffect(() => {
    loadMyOils();
  }, []);

  const loadMyOils = () => {
    const oils = MyOilsManager.getMyOils();
    // オイルデータを紐付け（enhancedOilsから優先的に取得）
    const oilsWithData = oils.map(myOil => {
      const enhancedOil = enhancedOilsData.find(o => o.id === myOil.oilId);
      const basicOil = oilsData.find(o => o.id === myOil.oilId);
      
      // enhancedOilがあればそれを基本のOil形式に変換
      const oil = enhancedOil ? {
        id: enhancedOil.id,
        name: enhancedOil.nameJa,
        category: enhancedOil.category as any,
        aroma: enhancedOil.aroma,
        benefits: enhancedOil.benefits,
        symptoms: enhancedOil.symptoms,
        usage: enhancedOil.usage.methods,
        description: enhancedOil.description,
        safetyInfo: enhancedOil.safetyInfo
      } : basicOil;
      
      return {
        ...myOil,
        oil
      };
    });
    setMyOils(oilsWithData);
  };

  const handleAddOil = (oil: Oil, inventory: MyOilInventory) => {
    // 無料プランの制限チェック
    const oilLimit = getPlanLimitation('oilsPerMonth');
    if (oilLimit && myOils.length >= oilLimit) {
      alert(`無料プランでは${oilLimit}個までのオイルしか登録できません。プランをアップグレードしてください。`);
      window.location.href = '/#pricing';
      return;
    }
    
    MyOilsManager.addOil(oil, inventory);
    loadMyOils();
    setShowAddModal(false);
  };

  const handleRemoveOil = (id: string) => {
    if (window.confirm('このオイルをマイオイルから削除しますか？')) {
      MyOilsManager.removeOil(id);
      loadMyOils();
    }
  };

  const handleToggleFavorite = (id: string) => {
    MyOilsManager.toggleFavorite(id);
    loadMyOils();
  };

  const handleAddUsage = (myOilId: string, usage: Omit<MyOilUsage, 'id'>) => {
    MyOilsManager.addUsage(myOilId, usage);
    loadMyOils();
    setShowUsageModal(false);
    setSelectedOil(null);
  };

  const handleUpdateInventory = (myOilId: string, updates: Partial<MyOilInventory>) => {
    MyOilsManager.updateInventory(myOilId, updates);
    loadMyOils();
  };

  // フィルタリング
  const filteredOils = myOils.filter(myOil => {
    if (!myOil.oil) return false;
    
    const matchesSearch = searchTerm === '' || 
      myOil.oil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      myOil.personalNotes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = filterTag === '' || myOil.customTags.includes(filterTag);
    
    const matchesTab = 
      (tabMode === 'inventory') ||
      (tabMode === 'favorites' && myOil.isFavorite) ||
      (tabMode === 'usage' && myOil.usageHistory.length > 0) ||
      (tabMode === 'alerts' && (
        MyOilsManager.getExpiringOils().some(o => o.id === myOil.id) ||
        MyOilsManager.getLowStockOils().some(o => o.id === myOil.id)
      ));
    
    return matchesSearch && matchesTag && matchesTab;
  });

  const statistics = MyOilsManager.getStatistics();
  const allTags = Array.from(new Set(myOils.flatMap(oil => oil.customTags)));

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      citrus: '🍋',
      floral: '🌸',
      herbal: '🌿',
      blend: '🧪',
      popular: '⭐',
      'ウッディ系': '🌲',
      'スパイス系': '🌶️',
      'カンファー系': '🌬️',
      'アーシー系': '🌍',
      '感情アロマセラピー': '💝',
      'キッズコレクション': '👶',
      '季節限定': '🎄'
    };
    return icons[category] || '🌿';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP');
  };

  const getStockStatusColor = (quantity: number) => {
    if (quantity <= 5) return 'low';
    if (quantity <= 10) return 'medium';
    return 'good';
  };

  const getDaysUntilExpiration = (expirationDate?: Date) => {
    if (!expirationDate) return null;
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="my-oils-enhanced">
      <header className="my-oils-header">
        <div>
          <h1>マイオイル管理</h1>
          <p>{myOils.length}種類のオイル | 総在庫価値: ¥{statistics.totalValue.toLocaleString()}</p>
        </div>
        <button className="add-oil-btn" onClick={() => setShowAddModal(true)}>
          + オイルを追加
        </button>
      </header>

      {/* タブナビゲーション */}
      <div className="tab-navigation">
        <button 
          className={`tab ${tabMode === 'inventory' ? 'active' : ''}`}
          onClick={() => setTabMode('inventory')}
        >
          📦 在庫管理
        </button>
        <button 
          className={`tab ${tabMode === 'usage' ? 'active' : ''}`}
          onClick={() => setTabMode('usage')}
        >
          📊 使用履歴
        </button>
        <button 
          className={`tab ${tabMode === 'favorites' ? 'active' : ''}`}
          onClick={() => setTabMode('favorites')}
        >
          ⭐ お気に入り
          {statistics.favoriteOils > 0 && (
            <span className="badge">{statistics.favoriteOils}</span>
          )}
        </button>
        <button 
          className={`tab ${tabMode === 'alerts' ? 'active' : ''}`}
          onClick={() => setTabMode('alerts')}
        >
          🔔 アラート
          {(statistics.expiringOils + statistics.lowStockOils) > 0 && (
            <span className="badge alert">{statistics.expiringOils + statistics.lowStockOils}</span>
          )}
        </button>
      </div>

      {/* 検索・フィルター */}
      <div className="search-filter-bar">
        <input
          type="text"
          placeholder="オイル名やメモで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        {allTags.length > 0 && (
          <select 
            value={filterTag} 
            onChange={(e) => setFilterTag(e.target.value)}
            className="tag-filter"
          >
            <option value="">すべてのタグ</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        )}
        
        <div className="view-mode-toggle">
          <button 
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            <span>📱</span>
          </button>
          <button 
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            <span>📋</span>
          </button>
          <button 
            className={viewMode === 'stats' ? 'active' : ''}
            onClick={() => setViewMode('stats')}
          >
            <span>📊</span>
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      {viewMode === 'stats' ? (
        getCurrentPlan() === 'free' ? (
          <div className="premium-feature-gate">
            <h3>📊 統計機能はベーシックプラン以上でご利用いただけます</h3>
            <p>使用履歴の分析、効果測定、在庫管理などの高度な機能をお使いいただけます。</p>
            <button className="btn-primary" onClick={() => window.location.href = '/#pricing'}>
              プランをアップグレード
            </button>
          </div>
        ) : (
        <div className="statistics-view">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>総オイル数</h3>
              <p className="stat-value">{statistics.totalOils}</p>
            </div>
            <div className="stat-card">
              <h3>総使用回数</h3>
              <p className="stat-value">{statistics.totalUsage}</p>
            </div>
            <div className="stat-card">
              <h3>平均効果</h3>
              <p className="stat-value">⭐ {statistics.averageEffectiveness.toFixed(1)}</p>
            </div>
            <div className="stat-card alert">
              <h3>要注意</h3>
              <p className="stat-value">
                期限切れ: {statistics.expiringOils}<br />
                在庫少: {statistics.lowStockOils}
              </p>
            </div>
          </div>
          
          {/* 使用頻度ランキング */}
          <div className="usage-ranking">
            <h3>🏆 使用頻度ランキング</h3>
            <ol>
              {myOils
                .sort((a, b) => b.totalUsageCount - a.totalUsageCount)
                .slice(0, 5)
                .map(myOil => (
                  <li key={myOil.id}>
                    {myOil.oil?.name} - {myOil.totalUsageCount}回
                    {myOil.averageEffectiveness && (
                      <span className="effectiveness">
                        ⭐ {myOil.averageEffectiveness.toFixed(1)}
                      </span>
                    )}
                  </li>
                ))}
            </ol>
          </div>
        </div>
        )
      ) : (
        <div className={`oils-container ${viewMode}`}>
          {filteredOils.length === 0 ? (
            <div className="empty-state">
              <p>該当するオイルがありません</p>
            </div>
          ) : (
            filteredOils.map(myOil => (
              <div key={myOil.id} className="my-oil-card">
                <div className="oil-header">
                  <div className="oil-title" onClick={() => myOil.oil && onOilSelect(myOil.oil)}>
                    <span className="category-icon">{getCategoryIcon(myOil.oil?.category || '')}</span>
                    <h3>{myOil.oil?.name}</h3>
                  </div>
                  <div className="oil-actions">
                    <button 
                      className={`favorite-btn ${myOil.isFavorite ? 'active' : ''}`}
                      onClick={() => handleToggleFavorite(myOil.id)}
                    >
                      {myOil.isFavorite ? '⭐' : '☆'}
                    </button>
                    <button 
                      className="usage-btn"
                      onClick={() => {
                        setSelectedOil(myOil);
                        setShowUsageModal(true);
                      }}
                    >
                      📝
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveOil(myOil.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="oil-inventory">
                  <div className="inventory-item">
                    <span className="label">在庫:</span>
                    <span className={`value stock-${getStockStatusColor(myOil.inventory.quantity)}`}>
                      {myOil.inventory.quantity} {myOil.inventory.unit}
                    </span>
                  </div>
                  
                  {myOil.inventory.expirationDate && (
                    <div className="inventory-item">
                      <span className="label">期限:</span>
                      <span className={`value ${getDaysUntilExpiration(myOil.inventory.expirationDate)! <= 30 ? 'alert' : ''}`}>
                        {formatDate(myOil.inventory.expirationDate)}
                        {getDaysUntilExpiration(myOil.inventory.expirationDate)! <= 30 && (
                          <span className="days-left">
                            (残り{getDaysUntilExpiration(myOil.inventory.expirationDate)}日)
                          </span>
                        )}
                      </span>
                    </div>
                  )}
                  
                  {myOil.lastUsed && (
                    <div className="inventory-item">
                      <span className="label">最終使用:</span>
                      <span className="value">{formatDate(myOil.lastUsed)}</span>
                    </div>
                  )}
                </div>
                
                {myOil.customTags.length > 0 && (
                  <div className="oil-tags">
                    {myOil.customTags.map(tag => (
                      <span key={tag} className="custom-tag">{tag}</span>
                    ))}
                  </div>
                )}
                
                {myOil.personalNotes && (
                  <div className="personal-notes">
                    <p>{myOil.personalNotes}</p>
                  </div>
                )}
                
                {viewMode === 'list' && myOil.usageHistory.length > 0 && (
                  <div className="recent-usage">
                    <h4>最近の使用</h4>
                    {myOil.usageHistory.slice(-3).reverse().map(usage => (
                      <div key={usage.id} className="usage-item">
                        <span>{formatDate(usage.date)}</span>
                        <span>{usage.purpose}</span>
                        <span>⭐ {usage.effectiveness}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* モーダル */}
      {showAddModal && (
        <AddOilModal
          onAdd={handleAddOil}
          onClose={() => setShowAddModal(false)}
          existingOilIds={myOils.map(oil => oil.oilId)}
        />
      )}
      
      {showUsageModal && selectedOil && (
        <UsageModal
          myOil={selectedOil}
          onAddUsage={handleAddUsage}
          onClose={() => {
            setShowUsageModal(false);
            setSelectedOil(null);
          }}
        />
      )}
    </div>
  );
};

export default MyOilsEnhanced;