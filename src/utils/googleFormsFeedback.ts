// Google Forms経由でのフィードバック送信

interface FeedbackData {
  rating: number;
  comment: string;
  category: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

export class GoogleFormsFeedbackService {
  // Google Formsにフィードバック送信
  static async submitToGoogleForms(feedback: FeedbackData): Promise<boolean> {
    try {
      // まずローカルに保存
      const existingFeedback = JSON.parse(localStorage.getItem('aromawise_feedback') || '[]');
      existingFeedback.push({ ...feedback, id: Date.now().toString() });
      localStorage.setItem('aromawise_feedback', JSON.stringify(existingFeedback));

      // Google Formsエンドポイント（あなたが作成するフォームのURL）
      const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf_YOUR_FORM_ID/formResponse';
      
      // フォームデータを準備
      const formData = new FormData();
      formData.append('entry.RATING_FIELD_ID', feedback.rating.toString());
      formData.append('entry.CATEGORY_FIELD_ID', feedback.category);
      formData.append('entry.COMMENT_FIELD_ID', feedback.comment);
      formData.append('entry.TIMESTAMP_FIELD_ID', feedback.timestamp);
      formData.append('entry.BROWSER_FIELD_ID', feedback.userAgent);

      // Google Formsに送信
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors', // CORSエラーを回避
        body: formData
      });

      console.log('Google Formsにフィードバックを送信しました');
      return true;
    } catch (error) {
      console.error('Google Forms送信エラー:', error);
      return false;
    }
  }

  // メール形式でのフィードバック（mailto:リンク）
  static openEmailFeedback(feedback: FeedbackData): void {
    const subject = `[AromaWise フィードバック] ${this.getCategoryLabel(feedback.category)} - ${feedback.rating}⭐`;
    const body = `フィードバック詳細：

評価: ${feedback.rating}/5 ⭐
カテゴリ: ${this.getCategoryLabel(feedback.category)}
日時: ${new Date(feedback.timestamp).toLocaleString('ja-JP')}

コメント:
${feedback.comment || 'コメントなし'}

技術情報:
- URL: ${feedback.url}
- ブラウザ: ${feedback.userAgent}
- タイムスタンプ: ${feedback.timestamp}

このフィードバックはAromaWiseアプリから送信されました。`;

    const mailtoLink = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  }

  private static getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'general': '全般的な感想',
      'usability': '使いやすさ',
      'content': 'コンテンツ',
      'features': '機能について',
      'bug': 'バグ報告',
      'suggestion': '改善提案'
    };
    return labels[category] || category;
  }
}