import { DataIntegrityManager } from './dataIntegrityManager';

export interface CorruptionRecoveryOptions {
  autoBackup?: boolean;
  clearCorruptedData?: boolean;
  preserveUserSettings?: boolean;
  showUserNotification?: boolean;
}

export class DataCorruptionHandler {
  private static readonly CORRUPTION_INDICATORS = [
    'SyntaxError',
    'Unexpected token',
    'JSON.parse',
    'Cannot read property',
    'Cannot read properties of null',
    'Cannot read properties of undefined',
    'localStorage',
    'QuotaExceededError',
    'NS_ERROR_DOM_QUOTA_REACHED'
  ];

  // データ破損の検出
  static detectCorruption(error: Error): {
    isCorrupted: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: string;
  } {
    const errorMessage = error.message || '';
    const errorStack = error.stack || '';
    const combinedText = `${errorMessage} ${errorStack}`.toLowerCase();

    // 破損の種類を判定
    if (this.CORRUPTION_INDICATORS.some(indicator => 
      combinedText.includes(indicator.toLowerCase())
    )) {
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';
      let type = 'unknown';

      // JSONパースエラー
      if (combinedText.includes('json') || combinedText.includes('syntax')) {
        severity = 'high';
        type = 'json_parse_error';
      }
      
      // ストレージ関連エラー
      if (combinedText.includes('localstorage') || combinedText.includes('quota')) {
        severity = 'critical';
        type = 'storage_error';
      }
      
      // プロパティアクセスエラー
      if (combinedText.includes('cannot read') || combinedText.includes('undefined')) {
        severity = 'medium';
        type = 'property_access_error';
      }

      return {
        isCorrupted: true,
        severity,
        type
      };
    }

    return {
      isCorrupted: false,
      severity: 'low',
      type: 'none'
    };
  }

  // 自動復旧の実行
  static async attemptRecovery(
    error: Error,
    options: CorruptionRecoveryOptions = {}
  ): Promise<{
    success: boolean;
    actions: string[];
    errors: string[];
  }> {
    const {
      autoBackup = true,
      clearCorruptedData = false,
      preserveUserSettings = true,
      showUserNotification = true
    } = options;

    const actions: string[] = [];
    const errors: string[] = [];

    try {
      // 1. バックアップの作成（オプション）
      if (autoBackup) {
        try {
          const backup = DataIntegrityManager.createBackup();
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const backupKey = `aromawise_emergency_backup_${timestamp}`;
          
          // セッションストレージに一時保存（LocalStorageが破損している可能性があるため）
          sessionStorage.setItem(backupKey, backup);
          actions.push('Emergency backup created');
        } catch (backupError) {
          errors.push(`Backup failed: ${backupError}`);
        }
      }

      // 2. データ整合性チェック
      try {
        const integrityReport = DataIntegrityManager.checkIntegrity();
        actions.push(`Integrity check completed: ${integrityReport.issues.length} issues found`);

        // 3. 自動修復の実行
        if (integrityReport.issues.length > 0) {
          const fixResult = DataIntegrityManager.autoFix();
          actions.push(`Auto-fix completed: ${fixResult.fixed} items fixed`);
          errors.push(...fixResult.errors);
        }
      } catch (integrityError) {
        errors.push(`Integrity check failed: ${integrityError}`);
      }

      // 4. 破損データのクリーンアップ（オプション）
      if (clearCorruptedData) {
        try {
          const cleanupResult = this.cleanupCorruptedData(preserveUserSettings);
          actions.push(`Corrupted data cleanup: ${cleanupResult.deletedKeys.length} keys removed`);
        } catch (cleanupError) {
          errors.push(`Cleanup failed: ${cleanupError}`);
        }
      }

      // 5. ストレージの最適化
      try {
        const optimizationResult = DataIntegrityManager.cleanupStorage();
        actions.push(`Storage optimized: ${optimizationResult.deletedItems} items, ${optimizationResult.freedSpace} bytes freed`);
      } catch (optimizationError) {
        errors.push(`Storage optimization failed: ${optimizationError}`);
      }

      // 6. ユーザー通知（オプション）
      if (showUserNotification && actions.length > 0) {
        this.showRecoveryNotification(actions, errors);
      }

      return {
        success: errors.length === 0,
        actions,
        errors
      };

    } catch (generalError) {
      errors.push(`Recovery process failed: ${generalError}`);
      return {
        success: false,
        actions,
        errors
      };
    }
  }

  // 破損データのクリーンアップ
  private static cleanupCorruptedData(preserveUserSettings: boolean): {
    deletedKeys: string[];
    preservedKeys: string[];
  } {
    const deletedKeys: string[] = [];
    const preservedKeys: string[] = [];
    
    // 保持するキーのリスト
    const protectedKeys = preserveUserSettings ? [
      'aromawise_settings',
      'darkMode',
      'aromawise_user_profile',
      'aromawise_subscription'
    ] : [];

    // LocalStorageの全キーをチェック
    const allKeys = Object.keys(localStorage);
    
    for (const key of allKeys) {
      try {
        // 保護されたキーはスキップ
        if (protectedKeys.includes(key)) {
          preservedKeys.push(key);
          continue;
        }

        // aromawise関連のキーのみチェック
        if (key.startsWith('aromawise_')) {
          const value = localStorage.getItem(key);
          if (value) {
            // JSONパースを試行
            JSON.parse(value);
            preservedKeys.push(key);
          }
        }
      } catch (parseError) {
        // パースに失敗したキーは削除
        try {
          localStorage.removeItem(key);
          deletedKeys.push(key);
        } catch (removeError) {
          console.error(`Failed to remove corrupted key ${key}:`, removeError);
        }
      }
    }

    return { deletedKeys, preservedKeys };
  }

  // 復旧通知の表示
  private static showRecoveryNotification(actions: string[], errors: string[]) {
    const message = errors.length === 0 
      ? '✅ データの自動復旧が完了しました'
      : '⚠️ データの復旧を試行しましたが、一部問題が残っています';

    // 開発環境では詳細をコンソールに出力
    if (process.env.NODE_ENV === 'development') {
      console.group('🔧 Data Recovery Report');
      console.log('Actions taken:', actions);
      if (errors.length > 0) {
        console.error('Errors encountered:', errors);
      }
      console.groupEnd();
    }

    // ユーザー向けの簡潔な通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('AromaWise - データ復旧', {
        body: message,
        icon: '/favicon.ico'
      });
    } else {
      // フォールバック: コンソールログ
      console.info(message);
    }
  }

  // 緊急時のデータリセット
  static emergencyReset(): boolean {
    try {
      // 重要な設定のみ保持
      const criticalData = {
        darkMode: localStorage.getItem('darkMode'),
        subscription: localStorage.getItem('aromawise_subscription')
      };

      // LocalStorageをクリア
      localStorage.clear();

      // 重要なデータを復元
      Object.entries(criticalData).forEach(([key, value]) => {
        if (value !== null) {
          localStorage.setItem(key, value);
        }
      });

      // セッションストレージもクリア
      sessionStorage.clear();

      console.log('Emergency reset completed successfully');
      return true;
    } catch (error) {
      console.error('Emergency reset failed:', error);
      return false;
    }
  }

  // データ破損ログの記録
  static logCorruption(error: Error, context: string) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        },
        context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        storageInfo: this.getStorageInfo()
      };

      // エラーログをセッションストレージに保存
      const existingLogs = JSON.parse(sessionStorage.getItem('aromawise_corruption_logs') || '[]');
      existingLogs.push(logEntry);
      
      // 最新5件のみ保持
      if (existingLogs.length > 5) {
        existingLogs.splice(0, existingLogs.length - 5);
      }
      
      sessionStorage.setItem('aromawise_corruption_logs', JSON.stringify(existingLogs));
      
      // 開発環境では詳細ログを出力
      if (process.env.NODE_ENV === 'development') {
        console.error('Data corruption detected:', logEntry);
      }
    } catch (logError) {
      console.error('Failed to log corruption:', logError);
    }
  }

  // ストレージ情報の取得
  private static getStorageInfo() {
    try {
      let localStorageSize = 0;
      let sessionStorageSize = 0;

      // LocalStorageサイズ計算
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageSize += localStorage[key].length + key.length;
        }
      }

      // SessionStorageサイズ計算
      for (const key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          sessionStorageSize += sessionStorage[key].length + key.length;
        }
      }

      return {
        localStorageSize,
        sessionStorageSize,
        localStorageKeys: Object.keys(localStorage).length,
        sessionStorageKeys: Object.keys(sessionStorage).length
      };
    } catch (error) {
      return {
        error: 'Failed to get storage info',
        details: String(error)
      };
    }
  }
}