// Formspree経由でのフィードバック送信

interface FeedbackData {
  rating: number;
  comment: string;
  category: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

export class FormspreeService {
  // Formspreeにフィードバック送信
  static async submitToFormspree(feedback: FeedbackData): Promise<boolean> {
    try {
      // まずローカルに保存
      const existingFeedback = JSON.parse(localStorage.getItem('aromawise_feedback') || '[]');
      existingFeedback.push({ ...feedback, id: Date.now().toString() });
      localStorage.setItem('aromawise_feedback', JSON.stringify(existingFeedback));

      // Formspreeエンドポイント（あなたのフォームID）
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
      
      const formData = {
        subject: `[AromaWise フィードバック] ${this.getCategoryLabel(feedback.category)} - ${feedback.rating}⭐`,
        rating: `${feedback.rating}/5 ⭐`,
        category: this.getCategoryLabel(feedback.category),
        comment: feedback.comment || 'コメントなし',
        timestamp: new Date(feedback.timestamp).toLocaleString('ja-JP'),
        userAgent: feedback.userAgent,
        url: feedback.url,
        _replyto: 'noreply@aromawise.app', // 返信不要のダミーメール
        _subject: `[AromaWise フィードバック] ${this.getCategoryLabel(feedback.category)} - ${feedback.rating}⭐`
      };

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Formspreeにフィードバックを送信しました');
        return true;
      } else {
        console.error('Formspree送信エラー:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Formspree送信エラー:', error);
      return false;
    }
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