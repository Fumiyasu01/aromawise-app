import { CustomBlend } from '../types/CustomBlend';
import { BlendReview } from '../types/CustomBlend';
import { CustomBlendsManager } from './customBlendsManager';
import { BlendReviewsManager } from './blendReviewsManager';

export interface IntegrityIssue {
  type: 'orphaned_review' | 'missing_blend' | 'invalid_user' | 'storage_full' | 'corrupted_data';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  data?: any;
  fixable: boolean;
}

export interface IntegrityReport {
  timestamp: Date;
  issues: IntegrityIssue[];
  storageUsage: {
    used: number;
    available: number;
    percentage: number;
  };
  totalRecords: {
    blends: number;
    reviews: number;
  };
}

export class DataIntegrityManager {
  private static readonly STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB (LocalStorageの一般的な制限)
  
  // データ整合性の総合チェック
  static checkIntegrity(): IntegrityReport {
    const issues: IntegrityIssue[] = [];
    
    // 1. 孤児レビューのチェック
    issues.push(...this.checkOrphanedReviews());
    
    // 2. 存在しないブレンドへの参照チェック
    issues.push(...this.checkMissingBlendReferences());
    
    // 3. 無効なユーザー参照チェック
    issues.push(...this.checkInvalidUserReferences());
    
    // 4. ストレージ使用量チェック
    issues.push(...this.checkStorageUsage());
    
    // 5. データ破損チェック
    issues.push(...this.checkDataCorruption());
    
    const storageUsage = this.getStorageUsage();
    const totalRecords = this.getTotalRecords();
    
    return {
      timestamp: new Date(),
      issues,
      storageUsage,
      totalRecords
    };
  }
  
  // 孤児レビュー（対応するブレンドが存在しないレビュー）をチェック
  private static checkOrphanedReviews(): IntegrityIssue[] {
    const issues: IntegrityIssue[] = [];
    const allReviews = BlendReviewsManager.getAllReviews();
    const allBlends = CustomBlendsManager.getAllBlends();
    const blendIds = new Set(allBlends.map(b => b.id));
    
    const orphanedReviews = allReviews.filter(review => !blendIds.has(review.blendId));
    
    orphanedReviews.forEach(review => {
      issues.push({
        type: 'orphaned_review',
        severity: 'medium',
        description: `レビュー「${review.title}」の対象ブレンド（ID: ${review.blendId}）が存在しません`,
        data: { reviewId: review.id, blendId: review.blendId },
        fixable: true
      });
    });
    
    return issues;
  }
  
  // 存在しないブレンドへの参照をチェック
  private static checkMissingBlendReferences(): IntegrityIssue[] {
    const issues: IntegrityIssue[] = [];
    // 将来的に他の機能でブレンド参照がある場合のためのプレースホルダー
    return issues;
  }
  
  // 無効なユーザー参照をチェック
  private static checkInvalidUserReferences(): IntegrityIssue[] {
    const issues: IntegrityIssue[] = [];
    const allReviews = BlendReviewsManager.getAllReviews();
    const allBlends = CustomBlendsManager.getAllBlends();
    
    // 空のユーザーIDをチェック
    const invalidUserReviews = allReviews.filter(review => !review.userId || review.userId.trim() === '');
    invalidUserReviews.forEach(review => {
      issues.push({
        type: 'invalid_user',
        severity: 'low',
        description: `レビュー「${review.title}」にユーザーIDが設定されていません`,
        data: { reviewId: review.id },
        fixable: true
      });
    });
    
    const invalidUserBlends = allBlends.filter(blend => !blend.createdBy || blend.createdBy.trim() === '');
    invalidUserBlends.forEach(blend => {
      issues.push({
        type: 'invalid_user',
        severity: 'low',
        description: `ブレンド「${blend.name}」にユーザーIDが設定されていません`,
        data: { blendId: blend.id },
        fixable: true
      });
    });
    
    return issues;
  }
  
  // ストレージ使用量をチェック
  private static checkStorageUsage(): IntegrityIssue[] {
    const issues: IntegrityIssue[] = [];
    const usage = this.getStorageUsage();
    
    if (usage.percentage > 90) {
      issues.push({
        type: 'storage_full',
        severity: 'critical',
        description: `ストレージ使用量が${usage.percentage.toFixed(1)}%に達しています（${(usage.used / 1024 / 1024).toFixed(2)}MB使用）`,
        data: usage,
        fixable: true
      });
    } else if (usage.percentage > 75) {
      issues.push({
        type: 'storage_full',
        severity: 'high',
        description: `ストレージ使用量が${usage.percentage.toFixed(1)}%です。データの整理を検討してください`,
        data: usage,
        fixable: true
      });
    }
    
    return issues;
  }
  
  // データ破損をチェック
  private static checkDataCorruption(): IntegrityIssue[] {
    const issues: IntegrityIssue[] = [];
    
    try {
      // ブレンドデータの整合性チェック
      const allBlends = CustomBlendsManager.getAllBlends();
      allBlends.forEach(blend => {
        if (!blend.id || !blend.name || !Array.isArray(blend.ingredients)) {
          issues.push({
            type: 'corrupted_data',
            severity: 'high',
            description: `ブレンド「${blend.name || 'Unknown'}」のデータが破損しています`,
            data: { blendId: blend.id },
            fixable: false
          });
        }
      });
      
      // レビューデータの整合性チェック
      const allReviews = BlendReviewsManager.getAllReviews();
      allReviews.forEach(review => {
        if (!review.id || !review.blendId || typeof review.rating !== 'number' || review.rating < 1 || review.rating > 5) {
          issues.push({
            type: 'corrupted_data',
            severity: 'high',
            description: `レビュー「${review.title || 'Unknown'}」のデータが破損しています`,
            data: { reviewId: review.id },
            fixable: false
          });
        }
      });
    } catch (error) {
      issues.push({
        type: 'corrupted_data',
        severity: 'critical',
        description: `データの読み込み中にエラーが発生しました: ${error}`,
        data: { error: String(error) },
        fixable: false
      });
    }
    
    return issues;
  }
  
  // ストレージ使用量を取得
  private static getStorageUsage() {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    return {
      used,
      available: this.STORAGE_LIMIT - used,
      percentage: (used / this.STORAGE_LIMIT) * 100
    };
  }
  
  // 総レコード数を取得
  private static getTotalRecords() {
    return {
      blends: CustomBlendsManager.getAllBlends().length,
      reviews: BlendReviewsManager.getAllReviews().length
    };
  }
  
  // 自動修復の実行
  static autoFix(): { fixed: number; errors: string[] } {
    const report = this.checkIntegrity();
    let fixed = 0;
    const errors: string[] = [];
    
    for (const issue of report.issues) {
      if (!issue.fixable) continue;
      
      try {
        switch (issue.type) {
          case 'orphaned_review':
            this.fixOrphanedReview(issue.data.reviewId);
            fixed++;
            break;
          case 'invalid_user':
            this.fixInvalidUser(issue.data);
            fixed++;
            break;
          case 'storage_full':
            // ストレージ整理は手動での対応が必要
            break;
        }
      } catch (error) {
        errors.push(`${issue.description}: ${error}`);
      }
    }
    
    return { fixed, errors };
  }
  
  // 孤児レビューを削除
  private static fixOrphanedReview(reviewId: string): void {
    BlendReviewsManager.deleteReview(reviewId);
  }
  
  // 無効なユーザー参照を修正
  private static fixInvalidUser(data: any): void {
    if (data.reviewId) {
      const review = BlendReviewsManager.getReviewById(data.reviewId);
      if (review) {
        review.userId = 'guest';
        review.userName = 'ゲストユーザー';
        BlendReviewsManager.updateReview(review);
      }
    }
    
    if (data.blendId) {
      const blend = CustomBlendsManager.getBlendById(data.blendId);
      if (blend) {
        blend.createdBy = 'guest';
        CustomBlendsManager.updateBlend(blend);
      }
    }
  }
  
  // ストレージをクリーンアップ
  static cleanupStorage(): { deletedItems: number; freedSpace: number } {
    const beforeUsage = this.getStorageUsage();
    let deletedItems = 0;
    
    // 古い一時データや不要なキーを削除
    const keysToCheck = Object.keys(localStorage);
    keysToCheck.forEach(key => {
      // 一時的なデータや古いキーをクリーンアップ
      if (key.startsWith('temp_') || key.startsWith('cache_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          const age = Date.now() - (data.timestamp || 0);
          // 24時間以上古い一時データは削除
          if (age > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
            deletedItems++;
          }
        } catch {
          // 破損したデータは削除
          localStorage.removeItem(key);
          deletedItems++;
        }
      }
    });
    
    const afterUsage = this.getStorageUsage();
    const freedSpace = beforeUsage.used - afterUsage.used;
    
    return { deletedItems, freedSpace };
  }
  
  // データのバックアップ作成
  static createBackup(): string {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {
        blends: CustomBlendsManager.getAllBlends(),
        reviews: BlendReviewsManager.getAllReviews()
      },
      integrity: this.checkIntegrity()
    };
    
    return JSON.stringify(backup, null, 2);
  }
  
  // バックアップからの復元
  static restoreFromBackup(backupJson: string): { success: boolean; error?: string } {
    try {
      const backup = JSON.parse(backupJson);
      
      if (!backup.data || !backup.data.blends || !backup.data.reviews) {
        return { success: false, error: '無効なバックアップファイルです' };
      }
      
      // 現在のデータをクリア
      localStorage.removeItem('aromawise_custom_blends');
      localStorage.removeItem('aromawise_blend_reviews');
      
      // バックアップデータを復元
      const blends = backup.data.blends.map((blend: any) => ({
        ...blend,
        createdAt: new Date(blend.createdAt),
        updatedAt: new Date(blend.updatedAt)
      }));
      
      const reviews = backup.data.reviews.map((review: any) => ({
        ...review,
        createdAt: new Date(review.createdAt),
        updatedAt: new Date(review.updatedAt)
      }));
      
      localStorage.setItem('aromawise_custom_blends', JSON.stringify(blends));
      localStorage.setItem('aromawise_blend_reviews', JSON.stringify(reviews));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: `復元に失敗しました: ${error}` };
    }
  }
}