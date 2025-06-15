import React, { useState } from 'react';
import { Oil } from '../types/Oil';
import { MyOilInventory } from '../types/MyOil';
import { oilsData } from '../data/oils';
import AdvancedSearch from './AdvancedSearch';
import './AddOilModal.css';

interface AddOilModalProps {
  onAdd: (oil: Oil, inventory: MyOilInventory) => void;
  onClose: () => void;
  existingOilIds: string[];
}

const AddOilModal: React.FC<AddOilModalProps> = ({ onAdd, onClose, existingOilIds }) => {
  const [selectedOil, setSelectedOil] = useState<Oil | null>(null);
  const [searchResults, setSearchResults] = useState<Oil[]>(oilsData);
  const [inventory, setInventory] = useState<Partial<MyOilInventory>>({
    quantity: 1,
    unit: 'bottles',
    purchaseDate: new Date()
  });

  // 既に追加されているオイルを除外
  const availableOils = oilsData.filter(oil => !existingOilIds.includes(oil.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOil && inventory.quantity && inventory.unit && inventory.purchaseDate) {
      onAdd(selectedOil, {
        quantity: inventory.quantity,
        unit: inventory.unit as 'ml' | 'bottles',
        purchaseDate: new Date(inventory.purchaseDate),
        openedDate: inventory.openedDate ? new Date(inventory.openedDate) : undefined,
        expirationDate: inventory.expirationDate ? new Date(inventory.expirationDate) : undefined,
        purchasePrice: inventory.purchasePrice,
        supplier: inventory.supplier,
        lotNumber: inventory.lotNumber
      });
    }
  };

  const calculateExpirationDate = (purchaseDate: Date, isOpened: boolean) => {
    const date = new Date(purchaseDate);
    // 開封済みの場合は1年、未開封の場合は3年
    const years = isOpened ? 1 : 3;
    date.setFullYear(date.getFullYear() + years);
    return date;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-oil-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>オイルを追加</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {!selectedOil ? (
            <div className="oil-selection">
              <h3>オイルを選択</h3>
              <AdvancedSearch 
                oils={availableOils}
                onSearchResults={setSearchResults}
              />
              
              <div className="oil-selection-grid">
                {searchResults.map(oil => (
                  <div 
                    key={oil.id} 
                    className="oil-option"
                    onClick={() => setSelectedOil(oil)}
                  >
                    <h4>{oil.name}</h4>
                    <p>{oil.category}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="selected-oil">
                <h3>選択中: {selectedOil.name}</h3>
                <button 
                  type="button" 
                  className="change-oil-btn"
                  onClick={() => setSelectedOil(null)}
                >
                  変更
                </button>
              </div>

              <div className="form-section">
                <h4>在庫情報</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>数量 *</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={inventory.quantity || ''}
                      onChange={(e) => setInventory({
                        ...inventory,
                        quantity: parseFloat(e.target.value)
                      })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>単位 *</label>
                    <select
                      value={inventory.unit || 'bottles'}
                      onChange={(e) => setInventory({
                        ...inventory,
                        unit: e.target.value as 'ml' | 'bottles'
                      })}
                    >
                      <option value="bottles">本</option>
                      <option value="ml">ml</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>購入日 *</label>
                    <input
                      type="date"
                      value={inventory.purchaseDate ? 
                        new Date(inventory.purchaseDate).toISOString().split('T')[0] : ''
                      }
                      onChange={(e) => setInventory({
                        ...inventory,
                        purchaseDate: new Date(e.target.value)
                      })}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>開封日</label>
                    <input
                      type="date"
                      value={inventory.openedDate ? 
                        new Date(inventory.openedDate).toISOString().split('T')[0] : ''
                      }
                      onChange={(e) => {
                        const openedDate = e.target.value ? new Date(e.target.value) : undefined;
                        setInventory({
                          ...inventory,
                          openedDate,
                          expirationDate: openedDate ? 
                            calculateExpirationDate(openedDate, true) : 
                            inventory.purchaseDate ? 
                              calculateExpirationDate(new Date(inventory.purchaseDate), false) : 
                              undefined
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>使用期限</label>
                    <input
                      type="date"
                      value={inventory.expirationDate ? 
                        new Date(inventory.expirationDate).toISOString().split('T')[0] : ''
                      }
                      onChange={(e) => setInventory({
                        ...inventory,
                        expirationDate: e.target.value ? new Date(e.target.value) : undefined
                      })}
                    />
                    <small>自動計算: 開封後1年、未開封3年</small>
                  </div>
                  
                  <div className="form-group">
                    <label>購入価格</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="¥"
                      value={inventory.purchasePrice || ''}
                      onChange={(e) => setInventory({
                        ...inventory,
                        purchasePrice: parseFloat(e.target.value)
                      })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>購入先</label>
                  <input
                    type="text"
                    placeholder="例: 公式サイト、Amazon"
                    value={inventory.supplier || ''}
                    onChange={(e) => setInventory({
                      ...inventory,
                      supplier: e.target.value
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>ロット番号</label>
                  <input
                    type="text"
                    placeholder="ボトルに記載の番号"
                    value={inventory.lotNumber || ''}
                    onChange={(e) => setInventory({
                      ...inventory,
                      lotNumber: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  キャンセル
                </button>
                <button type="submit" className="submit-btn">
                  追加
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddOilModal;