// USER
export type UserRole = 'student' | 'vendor' | 'admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  walletAddress?: string;
  privateKey?: string;
  balance?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// TRANSACTION
export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface Transaction {
  id: number;
  studentWallet: string;
  vendorWallet: string;
  amount: number;
  txHash: string;
  status: TransactionStatus;
  createdAt: string;
}