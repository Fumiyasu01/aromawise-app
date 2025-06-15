import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DataIntegrityManager } from '../utils/dataIntegrityManager';
import { DataCorruptionHandler } from '../utils/dataCorruptionHandler';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRecovering: boolean;
  recoveryAttempts: number;
}

class ErrorBoundary extends Component<Props, State> {
  private maxRecoveryAttempts = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRecovering: false,
      recoveryAttempts: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // カスタムエラーハンドラを実行
    this.props.onError?.(error, errorInfo);

    // データ破損の検出と処理
    const corruptionAnalysis = DataCorruptionHandler.detectCorruption(error);
    if (corruptionAnalysis.isCorrupted) {
      console.warn('Data corruption detected:', corruptionAnalysis);
      DataCorruptionHandler.logCorruption(error, errorInfo.componentStack || '');
      this.handleDataCorruption(corruptionAnalysis.severity);
    }

    // エラー情報をローカルストレージに保存（デバッグ用）
    this.saveErrorLog(error, errorInfo);
  }

  private async handleDataCorruption(severity: 'low' | 'medium' | 'high' | 'critical') {
    console.log(`Data corruption detected (severity: ${severity}), attempting recovery...`);
    
    this.setState({ isRecovering: true });
    
    try {
      // 重大度に応じた復旧オプション
      const recoveryOptions = {
        autoBackup: true,
        clearCorruptedData: severity === 'high' || severity === 'critical',
        preserveUserSettings: severity !== 'critical',
        showUserNotification: true
      };

      const recoveryResult = await DataCorruptionHandler.attemptRecovery(
        this.state.error!,
        recoveryOptions
      );

      console.log('Recovery result:', recoveryResult);

      if (recoveryResult.success || recoveryResult.actions.length > 0) {
        // 復旧に成功した場合、コンポーネントの再レンダリングを試行
        setTimeout(() => {
          this.handleRecovery();
        }, 1500);
      } else {
        // 復旧に失敗した場合
        this.setState({ isRecovering: false });
        console.error('Data recovery failed:', recoveryResult.errors);
      }
    } catch (recoveryError) {
      console.error('Recovery process failed:', recoveryError);
      this.setState({ isRecovering: false });
    }
  }

  private saveErrorLog(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      const existingLogs = JSON.parse(localStorage.getItem('aromawise_error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // 最新10件のみ保持
      if (existingLogs.length > 10) {
        existingLogs.splice(0, existingLogs.length - 10);
      }
      
      localStorage.setItem('aromawise_error_logs', JSON.stringify(existingLogs));
    } catch (logError) {
      console.error('Failed to save error log:', logError);
    }
  }

  private handleRecovery = () => {
    const { recoveryAttempts } = this.state;
    
    if (recoveryAttempts < this.maxRecoveryAttempts) {
      console.log(`Recovery attempt ${recoveryAttempts + 1}/${this.maxRecoveryAttempts}`);
      
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRecovering: false,
        recoveryAttempts: recoveryAttempts + 1
      });
    } else {
      console.log('Max recovery attempts reached');
      this.setState({ isRecovering: false });
    }
  };

  private handleManualRecovery = () => {
    // 手動復旧 - ページリロード
    window.location.reload();
  };

  private handleDataReset = () => {
    if (window.confirm('すべてのデータをリセットしてアプリを再起動しますか？この操作は取り消せません。')) {
      const resetSuccess = DataCorruptionHandler.emergencyReset();
      
      if (resetSuccess) {
        // ページリロード
        window.location.reload();
      } else {
        alert('データリセットに失敗しました。ブラウザの設定からサイトデータを手動で削除してください。');
      }
    }
  };

  render() {
    const { hasError, error, isRecovering, recoveryAttempts } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (isRecovering) {
        return (
          <div className="error-boundary recovering">
            <div className="recovery-spinner">
              <div className="spinner"></div>
              <p>データを修復中...</p>
            </div>
          </div>
        );
      }

      if (fallback) {
        return fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h2>申し訳ございません</h2>
            <p>アプリでエラーが発生しました</p>
            
            {recoveryAttempts < this.maxRecoveryAttempts && (
              <button 
                className="recovery-btn primary"
                onClick={this.handleRecovery}
              >
                自動復旧を試行 ({this.maxRecoveryAttempts - recoveryAttempts}回残り)
              </button>
            )}
            
            <div className="recovery-options">
              <button 
                className="recovery-btn secondary"
                onClick={this.handleManualRecovery}
              >
                ページを再読み込み
              </button>
              
              <button 
                className="recovery-btn danger"
                onClick={this.handleDataReset}
              >
                データをリセット
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>エラーの詳細 (開発用)</summary>
                <pre className="error-stack">
                  {error?.message}
                  {'\n\n'}
                  {error?.stack}
                </pre>
              </details>
            )}
            
            <p className="error-support">
              問題が続く場合は、設定 → サポートからお問い合わせください。
            </p>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;