import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState, LoginCredentials, SignupData, AuthContextType } from '../types/Auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // 初期化時にローカルストレージから認証状態を復元
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedUser = localStorage.getItem('aromawise_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          // 保存されたユーザーがいない場合は自動的にゲストユーザーを作成
          const guestUser: User = {
            id: `guest_${Date.now()}`,
            email: '',
            name: 'ゲストユーザー',
            isGuest: true,
            createdAt: new Date(),
            lastLoginAt: new Date()
          };
          
          localStorage.setItem('aromawise_user', JSON.stringify(guestUser));
          setAuthState({
            user: guestUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        // エラーが発生してもゲストユーザーとして続行
        const guestUser: User = {
          id: `guest_${Date.now()}`,
          email: '',
          name: 'ゲストユーザー',
          isGuest: true,
          createdAt: new Date(),
          lastLoginAt: new Date()
        };
        
        localStorage.setItem('aromawise_user', JSON.stringify(guestUser));
        setAuthState({
          user: guestUser,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      }
    };

    loadAuthState();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: 実際のAPIコールに置き換える
      // const response = await api.login(credentials);
      
      // デモ用の仮実装
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
        const user: User = {
          id: '1',
          email: credentials.email,
          name: 'デモユーザー',
          isGuest: false,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          subscription: {
            status: 'trial',
            plan: 'free',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30日後
          }
        };
        
        localStorage.setItem('aromawise_user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : '認証エラーが発生しました'
      });
      throw error;
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: 実際のAPIコールに置き換える
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        isGuest: false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        subscription: {
          status: 'trial',
          plan: 'free',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      };
      
      localStorage.setItem('aromawise_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'アカウント作成エラーが発生しました'
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // TODO: 実際のAPIコールに置き換える
      await new Promise(resolve => setTimeout(resolve, 500));
      
      localStorage.removeItem('aromawise_user');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout error:', error);
      // ローカルのみクリア
      localStorage.removeItem('aromawise_user');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: 実際のAPIコールに置き換える
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // デモ用：メールが送信されたことを想定
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'パスワードリセットメールの送信に失敗しました'
      }));
      throw error;
    }
  }, []);

  const socialLogin = useCallback(async (provider: 'google' | 'apple') => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: 実際のソーシャルログイン実装
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: User = {
        id: Date.now().toString(),
        email: `user@${provider}.com`,
        name: `${provider}ユーザー`,
        isGuest: false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        subscription: {
          status: 'trial',
          plan: 'free',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      };
      
      localStorage.setItem('aromawise_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: `${provider}ログインに失敗しました`
      });
      throw error;
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    const guestUser: User = {
      id: `guest_${Date.now()}`,
      email: '',
      name: 'ゲストユーザー',
      isGuest: true,
      createdAt: new Date(),
      lastLoginAt: new Date()
    };
    
    localStorage.setItem('aromawise_user', JSON.stringify(guestUser));
    setAuthState({
      user: guestUser,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  }, []);

  const convertGuestToUser = useCallback(async (data: SignupData) => {
    if (!authState.user?.isGuest) {
      throw new Error('ゲストユーザーではありません');
    }
    
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: ゲストデータの移行を含むAPI実装
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: User = {
        ...authState.user,
        email: data.email,
        name: data.name,
        isGuest: false,
        subscription: {
          status: 'trial',
          plan: 'free',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      };
      
      localStorage.setItem('aromawise_user', JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'アカウント変換エラーが発生しました'
      }));
      throw error;
    }
  }, [authState.user]);

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    resetPassword,
    socialLogin,
    continueAsGuest,
    convertGuestToUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};