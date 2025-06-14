// フィードバック送信サービス

interface FeedbackData {
  rating: number;
  comment: string;
  category: string;
  userAgent: string;
  url: string;
  timestamp: string;
}

export class FeedbackService {
  // GitHub Issuesにフィードバックを送信
  static async submitToGitHub(feedback: FeedbackData): Promise<boolean> {
    try {
      const categoryLabels: Record<string, string> = {
        'general': '全般的な感想',
        'usability': '使いやすさ',
        'content': 'コンテンツ',
        'features': '機能について',
        'bug': 'バグ報告',
        'suggestion': '改善提案'
      };

      const title = `[フィードバック] ${categoryLabels[feedback.category] || feedback.category} - ${feedback.rating}⭐`;
      const body = `## フィードバック詳細

**評価**: ${feedback.rating}/5 ⭐
**カテゴリ**: ${categoryLabels[feedback.category] || feedback.category}
**日時**: ${new Date(feedback.timestamp).toLocaleString('ja-JP')}

## コメント
${feedback.comment || 'コメントなし'}

## 技術情報
- **URL**: ${feedback.url}
- **ブラウザ**: ${feedback.userAgent}
- **タイムスタンプ**: ${feedback.timestamp}

---
*このフィードバックはAromaWiseアプリから自動送信されました*`;

      // GitHub Issues APIを呼び出し（Vercel Functionsを使用）
      const response = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          labels: ['feedback', feedback.category]
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('フィードバック送信成功:', result.url);
        return true;
      } else {
        const error = await response.text();
        console.error('GitHub API エラー:', error);
        return false;
      }
    } catch (error) {
      console.error('フィードバック送信エラー:', error);
      return false;
    }
  }

  // メール送信（Vercel Functions使用）
  static async submitByEmail(feedback: FeedbackData): Promise<boolean> {
    try {
      const response = await fetch('/api/send-feedback-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });

      return response.ok;
    } catch (error) {
      console.error('メール送信エラー:', error);
      return false;
    }
  }

  // フォーム送信（Google Forms / Formspree等）
  static async submitToForm(feedback: FeedbackData): Promise<boolean> {
    try {
      // Google FormsやFormspreeのエンドポイントを設定
      const FORM_ENDPOINT = process.env.REACT_APP_FEEDBACK_FORM_URL;
      
      if (!FORM_ENDPOINT) {
        throw new Error('フォームエンドポイントが設定されていません');
      }

      const formData = new FormData();
      formData.append('rating', feedback.rating.toString());
      formData.append('category', feedback.category);
      formData.append('comment', feedback.comment);
      formData.append('timestamp', feedback.timestamp);
      formData.append('userAgent', feedback.userAgent);
      formData.append('url', feedback.url);

      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      return response.ok;
    } catch (error) {
      console.error('フォーム送信エラー:', error);
      return false;
    }
  }

  // メイン送信メソッド（複数の方法を試行）
  static async submitFeedback(feedback: FeedbackData): Promise<boolean> {
    // 1. まずローカルに保存（バックアップ）
    try {
      const existingFeedback = JSON.parse(localStorage.getItem('aromawise_feedback') || '[]');
      existingFeedback.push({ ...feedback, id: Date.now().toString() });
      localStorage.setItem('aromawise_feedback', JSON.stringify(existingFeedback));
    } catch (error) {
      console.error('ローカル保存エラー:', error);
    }

    // 2. 外部送信を試行（優先順位順）
    const methods = [
      () => this.submitToGitHub(feedback),
      () => this.submitToForm(feedback),
      () => this.submitByEmail(feedback)
    ];

    for (const method of methods) {
      try {
        const success = await method();
        if (success) {
          console.log('フィードバック送信成功');
          return true;
        }
      } catch (error) {
        console.error('送信方法エラー:', error);
        continue;
      }
    }

    console.warn('すべての送信方法が失敗しました。ローカルに保存されました。');
    return false;
  }
}