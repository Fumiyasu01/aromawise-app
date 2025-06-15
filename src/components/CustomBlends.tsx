import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CustomBlend, BLEND_TEMPLATES, BlendCategory } from '../types/CustomBlend';
import { CustomBlendsManager } from '../utils/customBlendsManager';
import BlendEditor from './BlendEditor';
import BlendCard from './BlendCard';
import VirtualizedList from './VirtualizedList';
import { useDebounce, PerformanceMonitor } from '../utils/performanceOptimizer';
import './CustomBlends.css';

const CustomBlends: React.FC = () => {
  const { user } = useAuth();
  const [myBlends, setMyBlends] = useState<CustomBlend[]>([]);
  const [publicBlends, setPublicBlends] = useState<CustomBlend[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingBlend, setEditingBlend] = useState<CustomBlend | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BlendCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'my' | 'public' | 'templates'>('my');
  const [useVirtualization, setUseVirtualization] = useState(false);
  
  // 検索クエリのデバウンス
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadBlends();
    // 初回の場合、テンプレートを表示
    if (myBlends.length === 0 && publicBlends.length === 0) {
      setViewMode('templates');
    }
  }, []);

  useEffect(() => {
    // ブレンドが作成されたら「マイブレンド」タブに切り替え
    if (myBlends.length > 0 && viewMode === 'templates') {
      setViewMode('my');
    }
  }, [myBlends.length, viewMode]);

  const loadBlends = () => {
    try {
      const userBlends = CustomBlendsManager.getUserBlends(user?.id || 'guest');
      const allPublicBlends = CustomBlendsManager.getPublicBlends();
      
      console.log('Loading blends:', { 
        userBlends: userBlends.length, 
        publicBlends: allPublicBlends.length,
        userId: user?.id || 'guest'
      });
      
      setMyBlends(userBlends);
      setPublicBlends(allPublicBlends);
    } catch (error) {
      console.error('Error loading blends:', error);
      setMyBlends([]);
      setPublicBlends([]);
    }
  };

  const handleCreateBlend = () => {
    setEditingBlend(null);
    setShowEditor(true);
  };

  const handleEditBlend = (blend: CustomBlend) => {
    setEditingBlend(blend);
    setShowEditor(true);
  };

  const handleSaveBlend = (blend: CustomBlend) => {
    if (editingBlend) {
      CustomBlendsManager.updateBlend(blend);
    } else {
      const newBlend = CustomBlendsManager.createBlend(blend, user?.id || 'guest');
      setMyBlends([...myBlends, newBlend]);
    }
    loadBlends();
    setShowEditor(false);
    setEditingBlend(null);
  };

  const handleDeleteBlend = (blendId: string) => {
    if (window.confirm('このブレンドを削除してもよろしいですか？')) {
      CustomBlendsManager.deleteBlend(blendId);
      loadBlends();
    }
  };

  const handleToggleLike = (blendId: string) => {
    CustomBlendsManager.toggleLike(blendId, user?.id || 'guest');
    loadBlends();
  };

  const handleUseTemplate = (template: typeof BLEND_TEMPLATES[0]) => {
    const newBlend: Partial<CustomBlend> = {
      ...template.baseRecipe,
      name: `${template.baseRecipe.name} (コピー)`,
      createdBy: user?.id || 'guest'
    };
    setEditingBlend(newBlend as CustomBlend);
    setShowEditor(true);
  };

  // メモ化されたフィルター処理
  const filteredBlends = useMemo(() => {
    const endMeasurement = PerformanceMonitor.startMeasurement('blend-filtering');
    
    let blends: CustomBlend[] = [];
    
    if (viewMode === 'my') {
      blends = myBlends;
    } else if (viewMode === 'public') {
      blends = publicBlends;
    }

    if (selectedCategory !== 'all') {
      blends = blends.filter(b => b.category === selectedCategory);
    }

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      blends = blends.filter(b => 
        b.name.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
        b.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    endMeasurement();
    return blends;
  }, [myBlends, publicBlends, viewMode, selectedCategory, debouncedSearchTerm]);
  
  // 大量データの場合は仮想化を自動有効化
  useEffect(() => {
    setUseVirtualization(filteredBlends.length > 20);
  }, [filteredBlends.length]);

  const categories: { value: BlendCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'すべて' },
    { value: 'relaxation', label: 'リラクゼーション' },
    { value: 'energy', label: 'エネルギー' },
    { value: 'focus', label: '集中力' },
    { value: 'sleep', label: '睡眠' },
    { value: 'wellness', label: '健康' },
    { value: 'beauty', label: '美容' },
    { value: 'cleaning', label: 'お掃除' },
    { value: 'seasonal', label: '季節' },
    { value: 'custom', label: 'その他' }
  ];

  return (
    <div className="custom-blends">
      <div className="blends-header">
        <div>
          <h1>カスタムブレンド</h1>
          <p>オリジナルのエッセンシャルオイルブレンドを作成・管理</p>
        </div>
        <button className="create-blend-btn" onClick={handleCreateBlend}>
          + 新しいブレンドを作成
        </button>
      </div>

      {/* ビューモード切り替え */}
      <div className="view-tabs">
        <button
          className={viewMode === 'my' ? 'active' : ''}
          onClick={() => setViewMode('my')}
        >
          マイブレンド ({myBlends.length})
        </button>
        <button
          className={viewMode === 'public' ? 'active' : ''}
          onClick={() => setViewMode('public')}
        >
          公開ブレンド ({publicBlends.length})
        </button>
        <button
          className={viewMode === 'templates' ? 'active' : ''}
          onClick={() => setViewMode('templates')}
        >
          テンプレート ({BLEND_TEMPLATES.length})
        </button>
      </div>

      {/* 検索・フィルター */}
      <div className="blend-filters">
        <input
          type="text"
          placeholder="ブレンドを検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as BlendCategory | 'all')}
          className="category-filter"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* デバッグ情報（開発環境のみ） */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          borderRadius: '5px', 
          fontSize: '0.8rem', 
          marginBottom: '20px' 
        }}>
          <strong>Debug Info:</strong> My: {myBlends.length}, Public: {publicBlends.length}, 
          Filtered: {filteredBlends.length}, View: {viewMode}, User: {user?.id || 'guest'}
        </div>
      )}

      {/* ブレンドリスト */}
      {viewMode === 'templates' ? (
        <div className="templates-grid">
          {BLEND_TEMPLATES.map(template => (
            <div key={template.id} className="template-card">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-meta">
                <span className="difficulty">{
                  template.difficulty === 'beginner' ? '初級' :
                  template.difficulty === 'intermediate' ? '中級' : '上級'
                }</span>
                <span className="category">{
                  categories.find(c => c.value === template.category)?.label
                }</span>
              </div>
              <button 
                className="use-template-btn"
                onClick={() => handleUseTemplate(template)}
              >
                このテンプレートを使用
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {/* 仮想化オプション（開発用） */}
          {process.env.NODE_ENV === 'development' && filteredBlends.length > 0 && (
            <div className="virtualization-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={useVirtualization}
                  onChange={(e) => setUseVirtualization(e.target.checked)}
                />
                仮想化リストを使用 ({filteredBlends.length}件)
              </label>
            </div>
          )}
        
        {useVirtualization && filteredBlends.length > 0 ? (
          <VirtualizedList
            items={filteredBlends}
            itemHeight={200}
            containerHeight={400}
            renderItem={(blend, index) => (
              <BlendCard
                key={blend.id}
                blend={blend}
                isOwner={blend.createdBy === (user?.id || 'guest')}
                onEdit={() => handleEditBlend(blend)}
                onDelete={() => handleDeleteBlend(blend.id)}
                onToggleLike={() => handleToggleLike(blend.id)}
              />
            )}
            className="blends-virtualized"
          />
        ) : (
          <div className="blends-grid">
            {filteredBlends.length > 0 ? (
              filteredBlends.map(blend => (
                <BlendCard
                  key={blend.id}
                  blend={blend}
                  isOwner={blend.createdBy === (user?.id || 'guest')}
                  onEdit={() => handleEditBlend(blend)}
                  onDelete={() => handleDeleteBlend(blend.id)}
                  onToggleLike={() => handleToggleLike(blend.id)}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🧪</div>
                {viewMode === 'my' ? (
                  <>
                    <h3>まだブレンドがありません</h3>
                    <p>オリジナルのエッセンシャルオイルブレンドを作成してみましょう</p>
                    <button className="btn-primary" onClick={handleCreateBlend}>
                      最初のブレンドを作成
                    </button>
                  </>
                ) : viewMode === 'public' ? (
                  <>
                    <h3>公開ブレンドがありません</h3>
                    <p>まだ公開されているブレンドがないようです</p>
                  </>
                ) : (
                  <>
                    <h3>条件に一致するブレンドが見つかりません</h3>
                    <p>検索条件やカテゴリーを変更してお試しください</p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        </div>
      )}

      {/* ブレンドエディター */}
      {showEditor && (
        <BlendEditor
          blend={editingBlend}
          onSave={handleSaveBlend}
          onClose={() => {
            setShowEditor(false);
            setEditingBlend(null);
          }}
        />
      )}
    </div>
  );
};

export default CustomBlends;