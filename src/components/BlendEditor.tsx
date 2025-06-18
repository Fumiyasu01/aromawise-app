import React, { useState, useEffect } from 'react';
import { 
  CustomBlend, 
  BlendIngredient, 
  BlendCategory,
  CARRIER_OILS,
  DILUTION_GUIDELINES
} from '../types/CustomBlend';
import { BlendCalculator } from '../utils/blendCalculator';
import { oilsData } from '../data/oils';
import { enhancedOilsData } from '../data/enhancedOils';
import { EffectsAnalyzer } from './EffectsAnalyzer';
import './BlendEditor.css';

interface BlendEditorProps {
  blend?: CustomBlend | null;
  onSave: (blend: CustomBlend) => void;
  onClose: () => void;
}

const BlendEditor: React.FC<BlendEditorProps> = ({ blend, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<CustomBlend>>({
    name: '',
    description: '',
    purpose: '',
    ingredients: [],
    totalDrops: 0,
    dilutionRatio: 2,
    carrierOil: 'jojoba',
    carrierAmount: 10,
    category: 'custom' as BlendCategory,
    tags: [],
    isPublic: false,
    instructions: '',
    precautions: ''
  });

  const [currentTag, setCurrentTag] = useState('');
  const [selectedOil, setSelectedOil] = useState('');
  const [selectedDrops, setSelectedDrops] = useState(1);
  const [selectedNote, setSelectedNote] = useState<'top' | 'middle' | 'base'>('middle');
  const [errors, setErrors] = useState<string[]>([]);
  const [showCalculation, setShowCalculation] = useState(false);

  useEffect(() => {
    if (blend) {
      setFormData(blend);
    }
  }, [blend]);

  useEffect(() => {
    // 合計滴数を計算
    const total = formData.ingredients?.reduce((sum, ing) => sum + ing.drops, 0) || 0;
    setFormData(prev => ({ ...prev, totalDrops: total }));
  }, [formData.ingredients]);

  const handleAddIngredient = () => {
    if (!selectedOil) return;
    
    const existingIndex = formData.ingredients?.findIndex(ing => ing.oilId === selectedOil);
    if (existingIndex !== undefined && existingIndex >= 0) {
      // 既存のオイルの場合は滴数を更新
      const newIngredients = [...(formData.ingredients || [])];
      newIngredients[existingIndex].drops += selectedDrops;
      setFormData({ ...formData, ingredients: newIngredients });
    } else {
      // 新しいオイルを追加
      const newIngredient: BlendIngredient = {
        oilId: selectedOil,
        drops: selectedDrops,
        note: selectedNote
      };
      setFormData({
        ...formData,
        ingredients: [...(formData.ingredients || []), newIngredient]
      });
    }
    
    setSelectedOil('');
    setSelectedDrops(1);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = formData.ingredients?.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleUpdateDrops = (index: number, drops: number) => {
    const newIngredients = [...(formData.ingredients || [])];
    newIngredients[index].drops = drops;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleAddTag = () => {
    if (!currentTag || formData.tags?.includes(currentTag)) return;
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), currentTag]
    });
    setCurrentTag('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || []
    });
  };

  const handleCarrierAmountChange = (amount: number) => {
    setFormData({ ...formData, carrierAmount: amount });
  };

  const handleDilutionChange = (ratio: number) => {
    const carrierAmount = BlendCalculator.calculateCarrierAmount(
      formData.totalDrops || 0,
      ratio
    );
    setFormData({ 
      ...formData, 
      dilutionRatio: ratio,
      carrierAmount 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = BlendCalculator.validateBlend(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const blendToSave: CustomBlend = {
      id: blend?.id || Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      purpose: formData.purpose || '',
      ingredients: formData.ingredients || [],
      totalDrops: formData.totalDrops || 0,
      dilutionRatio: formData.dilutionRatio || 2,
      carrierOil: formData.carrierOil || 'jojoba',
      carrierAmount: formData.carrierAmount || 10,
      category: formData.category || 'custom',
      tags: formData.tags || [],
      createdAt: blend?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: blend?.createdBy || 'guest',
      isPublic: formData.isPublic || false,
      likes: blend?.likes || 0,
      instructions: formData.instructions,
      precautions: formData.precautions
    };

    console.log('BlendEditor: Saving blend:', blendToSave);
    onSave(blendToSave);
  };

  const calculation = formData.ingredients && formData.ingredients.length > 0
    ? BlendCalculator.calculate(formData as CustomBlend)
    : null;

  const balance = formData.ingredients && formData.ingredients.length > 0
    ? BlendCalculator.checkBlendBalance(formData as CustomBlend)
    : null;

  return (
    <div className="blend-editor-overlay">
      <div className="blend-editor">
        <div className="editor-header">
          <h2>{blend ? 'ブレンドを編集' : '新しいブレンドを作成'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 基本情報 */}
          <div className="form-section">
            <h3>基本情報</h3>
            
            <div className="form-group">
              <label>ブレンド名 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: リラックスブレンド"
                required
              />
            </div>

            <div className="form-group">
              <label>説明</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="このブレンドの特徴や効果"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>用途</label>
              <input
                type="text"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="例: ストレス解消、リラクゼーション"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>カテゴリー</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as BlendCategory })}
                >
                  <option value="relaxation">リラクゼーション</option>
                  <option value="energy">エネルギー</option>
                  <option value="focus">集中力</option>
                  <option value="sleep">睡眠</option>
                  <option value="wellness">健康</option>
                  <option value="beauty">美容</option>
                  <option value="cleaning">お掃除</option>
                  <option value="seasonal">季節</option>
                  <option value="custom">その他</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  />
                  <span>このブレンドを公開する</span>
                </label>
              </div>
            </div>
          </div>

          {/* オイル配合 */}
          <div className="form-section">
            <h3>エッセンシャルオイル配合</h3>
            
            <div className="ingredient-add">
              <select
                value={selectedOil}
                onChange={(e) => setSelectedOil(e.target.value)}
              >
                <option value="">オイルを選択</option>
                {oilsData.map(oil => (
                  <option key={oil.id} value={oil.id}>{oil.name}</option>
                ))}
              </select>
              
              <input
                type="number"
                min="1"
                max="10"
                value={selectedDrops}
                onChange={(e) => setSelectedDrops(parseInt(e.target.value))}
              />
              <span>滴</span>
              
              <select
                value={selectedNote}
                onChange={(e) => setSelectedNote(e.target.value as 'top' | 'middle' | 'base')}
              >
                <option value="top">トップ</option>
                <option value="middle">ミドル</option>
                <option value="base">ベース</option>
              </select>
              
              <button 
                type="button"
                onClick={handleAddIngredient}
                disabled={!selectedOil}
                className="add-btn"
              >
                追加
              </button>
            </div>

            <div className="ingredients-list">
              {formData.ingredients?.map((ing, index) => {
                const oil = oilsData.find(o => o.id === ing.oilId);
                return (
                  <div key={index} className="ingredient-item">
                    <span className="oil-name">{oil?.name}</span>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={ing.drops}
                      onChange={(e) => handleUpdateDrops(index, parseInt(e.target.value))}
                      className="drops-input"
                    />
                    <span>滴</span>
                    <span className={`note-badge ${ing.note}`}>{ing.note}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="total-drops">
              合計: {formData.totalDrops} 滴
            </div>

            {balance && !balance.balanced && (
              <div className="balance-warning">
                {balance.recommendation}
              </div>
            )}

            {/* 効果分析 */}
            {formData.ingredients && formData.ingredients.length > 0 && (
              <div className="effects-analysis-section" style={{ marginTop: '20px' }}>
                <EffectsAnalyzer 
                  selectedOils={formData.ingredients.map(ing => {
                    const enhancedOil = enhancedOilsData.find(o => o.id === ing.oilId);
                    return enhancedOil;
                  }).filter(oil => oil !== undefined) as any[]}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* キャリアオイルと希釈 */}
          <div className="form-section">
            <h3>キャリアオイルと希釈</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>キャリアオイル</label>
                <select
                  value={formData.carrierOil}
                  onChange={(e) => setFormData({ ...formData, carrierOil: e.target.value })}
                >
                  {CARRIER_OILS.map(oil => (
                    <option key={oil.id} value={oil.id}>
                      {oil.name} - {oil.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>キャリアオイルの量 (ml)</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="5"
                  value={formData.carrierAmount}
                  onChange={(e) => handleCarrierAmountChange(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group">
              <label>希釈率 (%)</label>
              <div className="dilution-presets">
                {Object.entries(DILUTION_GUIDELINES).map(([key, guide]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleDilutionChange((guide.min + guide.max) / 2)}
                    className="preset-btn"
                  >
                    {guide.label} ({guide.min}-{guide.max}%)
                  </button>
                ))}
              </div>
            </div>

            {calculation && (
              <div className="calculation-info">
                実際の希釈率: {calculation.dilutionPercentage.toFixed(1)}%
              </div>
            )}
          </div>

          {/* 使用方法と注意事項 */}
          <div className="form-section">
            <h3>使用方法と注意事項</h3>
            
            <div className="form-group">
              <label>使用方法</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="このブレンドの使い方を説明してください"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>注意事項</label>
              <textarea
                value={formData.precautions}
                onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                placeholder="使用上の注意点があれば記入してください"
                rows={3}
              />
            </div>
          </div>

          {/* タグ */}
          <div className="form-section">
            <h3>タグ</h3>
            
            <div className="tag-input">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="タグを追加"
              />
              <button type="button" onClick={handleAddTag}>追加</button>
            </div>

            <div className="tags-list">
              {formData.tags?.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* 安全性チェック */}
          {calculation && calculation.safetyWarnings.length > 0 && (
            <div className="safety-warnings">
              <h3>⚠️ 安全性の注意</h3>
              <ul>
                {calculation.safetyWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

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
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              キャンセル
            </button>
            <button type="submit" className="save-btn">
              {blend ? '更新' : '作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlendEditor;