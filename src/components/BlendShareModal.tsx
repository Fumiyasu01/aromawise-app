import React, { useState, useEffect } from 'react';
import { CustomBlend } from '../types/CustomBlend';
import QRCode from 'qrcode';
import './BlendShareModal.css';

interface BlendShareModalProps {
  blend: CustomBlend;
  onClose: () => void;
}

const BlendShareModal: React.FC<BlendShareModalProps> = ({ blend, onClose }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'url' | 'qr' | 'recipe'>('url');

  useEffect(() => {
    // ブレンドデータをBase64エンコード
    const blendData = {
      name: blend.name,
      description: blend.description,
      ingredients: blend.ingredients,
      dilutionRatio: blend.dilutionRatio,
      carrierOil: blend.carrierOil,
      carrierAmount: blend.carrierAmount,
      instructions: blend.instructions,
      precautions: blend.precautions
    };
    
    const encodedData = btoa(encodeURIComponent(JSON.stringify(blendData)));
    const url = `${window.location.origin}/shared-blend/${encodedData}`;
    setShareUrl(url);

    // QRコード生成
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#2d5a3d',
        light: '#ffffff'
      }
    }).then(setQrCodeUrl).catch(console.error);
  }, [blend]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.download = `${blend.name.replace(/\s+/g, '_')}_QR.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleExportRecipe = () => {
    const recipeText = generateRecipeText(blend);
    const blob = new Blob([recipeText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `${blend.name.replace(/\s+/g, '_')}_recipe.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const generateRecipeText = (blend: CustomBlend): string => {
    let text = `=== ${blend.name} ===\n\n`;
    
    if (blend.description) {
      text += `説明: ${blend.description}\n\n`;
    }

    text += `【材料】\n`;
    blend.ingredients.forEach(ing => {
      text += `- ${ing.oilId}: ${ing.drops}滴`;
      if (ing.note) text += ` (${ing.note}ノート)`;
      text += '\n';
    });

    text += `\n合計: ${blend.totalDrops}滴\n\n`;

    if (blend.carrierOil && blend.carrierAmount) {
      text += `【キャリアオイル】\n`;
      text += `- ${blend.carrierOil}: ${blend.carrierAmount}ml\n`;
      text += `- 希釈率: ${blend.dilutionRatio}%\n\n`;
    }

    if (blend.instructions) {
      text += `【使用方法】\n${blend.instructions}\n\n`;
    }

    if (blend.precautions) {
      text += `【注意事項】\n${blend.precautions}\n\n`;
    }

    text += `作成日: ${new Date(blend.createdAt).toLocaleDateString('ja-JP')}\n`;
    text += `AromaWiseで作成\n`;

    return text;
  };

  const handleShareSocial = (platform: string) => {
    const text = `「${blend.name}」のブレンドレシピをシェアします！`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`);
        break;
      case 'line':
        window.open(`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
        break;
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="share-modal-header">
          <h2>ブレンドを共有</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="share-tabs">
          <button 
            className={shareMethod === 'url' ? 'active' : ''}
            onClick={() => setShareMethod('url')}
          >
            URL共有
          </button>
          <button 
            className={shareMethod === 'qr' ? 'active' : ''}
            onClick={() => setShareMethod('qr')}
          >
            QRコード
          </button>
          <button 
            className={shareMethod === 'recipe' ? 'active' : ''}
            onClick={() => setShareMethod('recipe')}
          >
            レシピ
          </button>
        </div>

        <div className="share-content">
          {shareMethod === 'url' && (
            <div className="url-share">
              <div className="share-url-container">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="share-url-input"
                />
                <button 
                  onClick={handleCopyUrl}
                  className="copy-btn"
                >
                  {copied ? '✓ コピー済' : 'コピー'}
                </button>
              </div>

              <div className="social-share">
                <p>SNSでシェア:</p>
                <div className="social-buttons">
                  <button 
                    onClick={() => handleShareSocial('twitter')}
                    className="social-btn twitter"
                  >
                    Twitter
                  </button>
                  <button 
                    onClick={() => handleShareSocial('line')}
                    className="social-btn line"
                  >
                    LINE
                  </button>
                  <button 
                    onClick={() => handleShareSocial('facebook')}
                    className="social-btn facebook"
                  >
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          )}

          {shareMethod === 'qr' && (
            <div className="qr-share">
              {qrCodeUrl && (
                <>
                  <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
                  <p className="qr-instructions">
                    このQRコードをスキャンすると、ブレンドレシピにアクセスできます
                  </p>
                  <button onClick={handleDownloadQR} className="download-btn">
                    QRコードをダウンロード
                  </button>
                </>
              )}
            </div>
          )}

          {shareMethod === 'recipe' && (
            <div className="recipe-export">
              <div className="recipe-preview">
                <h3>{blend.name}</h3>
                {blend.description && <p>{blend.description}</p>}
                
                <div className="ingredients-preview">
                  <h4>材料:</h4>
                  <ul>
                    {blend.ingredients.map((ing, index) => (
                      <li key={index}>
                        {ing.oilId}: {ing.drops}滴
                        {ing.note && ` (${ing.note})`}
                      </li>
                    ))}
                  </ul>
                </div>

                {blend.instructions && (
                  <div className="instructions-preview">
                    <h4>使用方法:</h4>
                    <p>{blend.instructions}</p>
                  </div>
                )}
              </div>

              <button onClick={handleExportRecipe} className="export-btn">
                レシピをテキストでダウンロード
              </button>
            </div>
          )}
        </div>

        <div className="share-notice">
          <p>
            ⚠️ 共有されたブレンドレシピは誰でもアクセスできます。
            個人情報を含めないようご注意ください。
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlendShareModal;