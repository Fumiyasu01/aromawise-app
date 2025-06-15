export interface User {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
  createdAt: Date;
  lastLoginAt: Date;
  subscription?: {
    status: 'active' | 'inactive' | 'trial';
    plan: 'free' | 'basic' | 'premium';
    expiresAt?: Date;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<void>;
  continueAsGuest: () => void;
  convertGuestToUser: (data: SignupData) => Promise<void>;
}