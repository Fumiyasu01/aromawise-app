// Google Forms フィールドIDテスト

export const testGoogleFormsSubmission = async () => {
  console.log('Google Forms テスト送信を開始...');
  
  // 既知のフィールドIDで試行
  const knownFields = [
    'entry.521869119',
    'entry.1313356794'
  ];
  
  const formData = new FormData();
  
  // フィールド1（満足度）
  formData.append('entry.521869119', '4⭐ - 満足');
  
  // フィールド2（カテゴリまたはコメント）  
  formData.append('entry.1313356794', 'テスト送信');
  
  try {
    const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSfQMEwtCtjSCDvnV0_qRARQobaOxqjzC5K7_P9bP4o1_0oxxw/formResponse', {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    
    console.log('テスト送信完了:', response);
    return true;
  } catch (error) {
    console.error('テスト送信エラー:', error);
    return false;
  }
};

// フォーム送信URL（最終版）
export const GOOGLE_FORM_CONFIG = {
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSfQMEwtCtjSCDvnV0_qRARQobaOxqjzC5K7_P9bP4o1_0oxxw/formResponse',
  fields: {
    rating: 'entry.521869119',    // 満足度（推測）
    category: 'entry.1313356794', // カテゴリまたはコメント（推測）
    comment: 'entry.UNKNOWN',     // 特定が必要
    timestamp: 'timestamp'        // 自動
  }
};