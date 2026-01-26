// ================= USER ROLE =================
export type UserRole = 'student' | 'vendor' | 'admin';

// ================= USER ======================
export interface User {
  id: number;
  email: string;
  role: UserRole;

  // wallet related (optional – backend irundha varum)
  walletAddress?: string;
  privateKey?: string;
  balance?: number;
}

// ================= AUTH STATE =================
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
