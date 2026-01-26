export type TransactionStatus = 'SUCCESS' | 'FAILED';

export interface Transaction {
  id: number;
  studentWallet: string;
  vendorWallet: string;
  amount: number;
  txHash: string;
  status: TransactionStatus;
  createdAt: string;
}
