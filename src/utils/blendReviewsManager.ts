import { BlendReview } from '../types/CustomBlend';

const STORAGE_KEY = 'aromawise_blend_reviews';
const USER_HELPFUL_KEY = 'aromawise_review_helpful';

export class BlendReviewsManager {
  // すべてのレビューを取得
  static getAllReviews(): BlendReview[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const reviews = JSON.parse(stored);
      return reviews.map((review: any) => ({
        ...review,
        createdAt: new Date(review.createdAt),
        updatedAt: new Date(review.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading reviews:', error);
      return [];
    }
  }

  // 特定のブレンドのレビューを取得
  static getReviewsByBlend(blendId: string): BlendReview[] {
    const allReviews = this.getAllReviews();
    return allReviews.filter(review => review.blendId === blendId);
  }

  // ユーザーのレビューを取得
  static getReviewsByUser(userId: string): BlendReview[] {
    const allReviews = this.getAllReviews();
    return allReviews.filter(review => review.userId === userId);
  }

  // レビューを作成
  static createReview(reviewData: Omit<BlendReview, 'id' | 'createdAt' | 'updatedAt'>): BlendReview {
    const newReview: BlendReview = {
      ...reviewData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const allReviews = this.getAllReviews();
    allReviews.push(newReview);
    this.saveReviews(allReviews);

    // ブレンドの平均評価を更新
    this.updateBlendRating(reviewData.blendId);

    return newReview;
  }

  // レビューを更新
  static updateReview(updatedReview: BlendReview): void {
    const allReviews = this.getAllReviews();
    const index = allReviews.findIndex(r => r.id === updatedReview.id);
    
    if (index !== -1) {
      allReviews[index] = {
        ...updatedReview,
        updatedAt: new Date()
      };
      this.saveReviews(allReviews);

      // ブレンドの平均評価を更新
      this.updateBlendRating(updatedReview.blendId);
    }
  }

  // レビューを削除
  static deleteReview(reviewId: string): void {
    const allReviews = this.getAllReviews();
    const review = allReviews.find(r => r.id === reviewId);
    
    if (review) {
      const filteredReviews = allReviews.filter(r => r.id !== reviewId);
      this.saveReviews(filteredReviews);

      // ブレンドの平均評価を更新
      this.updateBlendRating(review.blendId);
    }
  }

  // レビューIDで取得
  static getReviewById(reviewId: string): BlendReview | null {
    const allReviews = this.getAllReviews();
    return allReviews.find(r => r.id === reviewId) || null;
  }

  // ユーザーが特定のブレンドにレビューを投稿済みかチェック
  static hasUserReviewed(blendId: string, userId: string): boolean {
    const allReviews = this.getAllReviews();
    return allReviews.some(r => r.blendId === blendId && r.userId === userId);
  }

  // ブレンドの平均評価を計算
  static calculateAverageRating(blendId: string): { average: number; count: number } {
    const reviews = this.getReviewsByBlend(blendId);
    
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    const average = sum / reviews.length;

    return { average, count: reviews.length };
  }

  // 「役に立った」を切り替え
  static toggleHelpful(reviewId: string, userId: string): void {
    const userHelpfulList = this.getUserHelpfulList(userId);
    const allReviews = this.getAllReviews();
    const review = allReviews.find(r => r.id === reviewId);
    
    if (!review) return;

    const helpfulIndex = userHelpfulList.indexOf(reviewId);
    
    if (helpfulIndex >= 0) {
      // 既に「役に立った」している場合は取り消し
      userHelpfulList.splice(helpfulIndex, 1);
      review.helpful = Math.max(0, review.helpful - 1);
    } else {
      // 「役に立った」を追加
      userHelpfulList.push(reviewId);
      review.helpful = review.helpful + 1;
    }

    this.saveUserHelpfulList(userId, userHelpfulList);
    this.saveReviews(allReviews);
  }

  // ユーザーが「役に立った」したレビューのリストを取得
  static getUserHelpfulList(userId: string): string[] {
    try {
      const stored = localStorage.getItem(`${USER_HELPFUL_KEY}_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // レビューの統計情報を取得
  static getReviewStatistics(blendId?: string): {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
    mostHelpfulReviews: BlendReview[];
    recentReviews: BlendReview[];
  } {
    const reviews = blendId ? this.getReviewsByBlend(blendId) : this.getAllReviews();
    
    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingDistribution[review.rating]++;
        totalRating += review.rating;
      }
    });

    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    const mostHelpfulReviews = [...reviews]
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, 5);

    const recentReviews = [...reviews]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalReviews: reviews.length,
      averageRating,
      ratingDistribution,
      mostHelpfulReviews,
      recentReviews
    };
  }

  // レビューを検索
  static searchReviews(query: string): BlendReview[] {
    const allReviews = this.getAllReviews();
    const searchTerm = query.toLowerCase();
    
    return allReviews.filter(review => 
      review.title.toLowerCase().includes(searchTerm) ||
      review.comment.toLowerCase().includes(searchTerm) ||
      review.userName.toLowerCase().includes(searchTerm)
    );
  }

  // 不適切なレビューを報告
  static reportReview(reviewId: string, userId: string, reason: string): void {
    const allReviews = this.getAllReviews();
    const review = allReviews.find(r => r.id === reviewId);
    
    if (review) {
      review.reported = true;
      this.saveReviews(allReviews);
      
      // 実際のアプリでは、ここでサーバーに報告を送信する
      console.log(`Review ${reviewId} reported by ${userId} for: ${reason}`);
    }
  }

  // レビューデータをエクスポート
  static exportUserReviews(userId: string): string {
    const userReviews = this.getReviewsByUser(userId);
    return JSON.stringify(userReviews, null, 2);
  }

  // レビューデータをインポート
  static importReviews(reviewsData: BlendReview[]): number {
    try {
      const allReviews = this.getAllReviews();
      let importedCount = 0;

      reviewsData.forEach(review => {
        // 重複チェック
        const exists = allReviews.some(r => 
          r.blendId === review.blendId && 
          r.userId === review.userId
        );

        if (!exists) {
          allReviews.push({
            ...review,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            createdAt: new Date(review.createdAt),
            updatedAt: new Date(review.updatedAt)
          });
          importedCount++;
        }
      });

      this.saveReviews(allReviews);
      return importedCount;
    } catch (error) {
      console.error('Error importing reviews:', error);
      return 0;
    }
  }

  // プライベートメソッド
  private static saveReviews(reviews: BlendReview[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  }

  private static saveUserHelpfulList(userId: string, helpfulList: string[]): void {
    try {
      localStorage.setItem(`${USER_HELPFUL_KEY}_${userId}`, JSON.stringify(helpfulList));
    } catch (error) {
      console.error('Error saving helpful list:', error);
    }
  }

  private static updateBlendRating(blendId: string): void {
    // カスタムブレンドマネージャーに評価を更新するよう通知
    // この実装は CustomBlendsManager に依存関係を作らないため、
    // CustomBlendsManager 側で評価を更新する機能を実装する必要がある
    const { average, count } = this.calculateAverageRating(blendId);
    
    // LocalStorageイベントで通知
    window.dispatchEvent(new CustomEvent('blendRatingUpdated', {
      detail: { blendId, rating: average, reviewCount: count }
    }));
  }
}