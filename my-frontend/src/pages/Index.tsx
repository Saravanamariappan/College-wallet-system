export type UserRole = 'STUDENT' | 'VENDOR' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  walletAddress: string;
  createdAt: string;

  name?: string;
  balance?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
