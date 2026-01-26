import { Transaction, User } from '@/types';

export const mockStudents: User[] = [
  {
    id: 'STU001',
    name: 'Rahul Kumar',
    email: 'rahul@college.edu',
    role: 'student',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a2E1',
    balance: 1250.50,
    createdAt: '2024-01-15',
  },
  {
    id: 'STU002',
    name: 'Priya Sharma',
    email: 'priya@college.edu',
    role: 'student',
    walletAddress: '0x53d284357ec70cE289D6D64134DfAc8E511c8a3D',
    balance: 890.25,
    createdAt: '2024-01-20',
  },
  {
    id: 'STU003',
    name: 'Amit Patel',
    email: 'amit@college.edu',
    role: 'student',
    walletAddress: '0xFe92a3C32Bc5e8d3C09D3E49C2Ba8e0C3e8a4F21',
    balance: 2100.00,
    createdAt: '2024-02-01',
  },
];

export const mockVendors: User[] = [
  {
    id: 'VND001',
    name: 'College Cafeteria',
    email: 'cafeteria@college.edu',
    role: 'vendor',
    walletAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    balance: 15420.75,
    createdAt: '2024-01-10',
  },
  {
    id: 'VND002',
    name: 'Book Store',
    email: 'bookstore@college.edu',
    role: 'vendor',
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    balance: 8750.50,
    createdAt: '2024-01-12',
  },
  {
    id: 'VND003',
    name: 'Stationery Shop',
    email: 'stationery@college.edu',
    role: 'vendor',
    walletAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    balance: 3200.25,
    createdAt: '2024-01-18',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'TX001',
    fromAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a2E1',
    toAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    amount: 150,
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    status: 'success',
    timestamp: '2024-12-28T10:30:00Z',
    type: 'payment',
  },
  {
    id: 'TX002',
    fromAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a2E1',
    toAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    amount: 250,
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'success',
    timestamp: '2024-12-27T14:45:00Z',
    type: 'payment',
  },
  {
    id: 'TX003',
    fromAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    toAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a2E1',
    amount: 500,
    txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    status: 'success',
    timestamp: '2024-12-26T09:15:00Z',
    type: 'mint',
  },
  {
    id: 'TX004',
    fromAddress: '0x53d284357ec70cE289D6D64134DfAc8E511c8a3D',
    toAddress: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    amount: 75,
    txHash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    status: 'pending',
    timestamp: '2024-12-28T11:00:00Z',
    type: 'payment',
  },
  {
    id: 'TX005',
    fromAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8a2E1',
    toAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    amount: 45,
    txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    status: 'success',
    timestamp: '2024-12-25T16:20:00Z',
    type: 'payment',
  },
];

export const generateWallet = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  let privateKey = '0x';
  
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  
  for (let i = 0; i < 64; i++) {
    privateKey += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return { address, privateKey };
};

export const generateTxHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};
