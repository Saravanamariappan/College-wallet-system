interface Transaction {
  id: number;
  studentWallet: string;
  vendorWallet: string;
  amount: number;
  txHash: string;
  status: 'SUCCESS' | 'FAILED';
  createdAt: string;
}

// Mock Students
export const mockStudents = [
  {
    id: 1,
    name: 'Rahul Kumar',
    email: 'rahul.kumar@college.edu',
    studentId: 'STU001',
    walletAddress: '0x1234567890123456789012345678901234567890',
    balance: 5000,
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    studentId: 'STU002',
    walletAddress: '0x2345678901234567890123456789012345678901',
    balance: 3500,
    joinDate: '2024-02-01',
  },
  {
    id: 3,
    name: 'Amit Patel',
    email: 'amit.patel@college.edu',
    studentId: 'STU003',
    walletAddress: '0x3456789012345678901234567890123456789012',
    balance: 2800,
    joinDate: '2024-02-10',
  },
  {
    id: 4,
    name: 'Neha Singh',
    email: 'neha.singh@college.edu',
    studentId: 'STU004',
    walletAddress: '0x4567890123456789012345678901234567890123',
    balance: 4200,
    joinDate: '2024-02-15',
  },
  {
    id: 5,
    name: 'Raj Verma',
    email: 'raj.verma@college.edu',
    studentId: 'STU005',
    walletAddress: '0x5678901234567890123456789012345678901234',
    balance: 1500,
    joinDate: '2024-03-01',
  },
];

// Mock Vendors
export const mockVendors = [
  {
    id: 1,
    name: 'Book Store',
    email: 'bookstore@college.edu',
    vendorId: 'VND001',
    walletAddress: '0x6789012345678901234567890123456789012345',
    category: 'Books & Stationery',
    joinDate: '2024-01-20',
  },
  {
    id: 2,
    name: 'Cafeteria Plus',
    email: 'cafeteria@college.edu',
    vendorId: 'VND002',
    walletAddress: '0x7890123456789012345678901234567890123456',
    category: 'Food & Beverage',
    joinDate: '2024-01-25',
  },
  {
    id: 3,
    name: 'Tech Hub',
    email: 'techhub@college.edu',
    vendorId: 'VND003',
    walletAddress: '0x8901234567890123456789012345678901234567',
    category: 'Electronics',
    joinDate: '2024-02-05',
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 1,
    studentWallet: '0x1234567890123456789012345678901234567890',
    vendorWallet: '0x7890123456789012345678901234567890123456',
    amount: 150,
    txHash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx',
    status: 'SUCCESS',
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 2,
    studentWallet: '0x2345678901234567890123456789012345678901',
    vendorWallet: '0x6789012345678901234567890123456789012345',
    amount: 250,
    txHash: '0xdef456ghi789jkl012mno345pqr678stu901vwx234abc',
    status: 'SUCCESS',
    createdAt: '2024-03-15T09:15:00Z',
  },
  {
    id: 3,
    studentWallet: '0x3456789012345678901234567890123456789012',
    vendorWallet: '0x8901234567890123456789012345678901234567',
    amount: 75,
    txHash: '0xghi789jkl012mno345pqr678stu901vwx234abc567def',
    status: 'SUCCESS',
    createdAt: '2024-03-15T08:45:00Z',
  },
  {
    id: 4,
    studentWallet: '0x4567890123456789012345678901234567890123',
    vendorWallet: '0x7890123456789012345678901234567890123456',
    amount: 200,
    txHash: '0xjkl012mno345pqr678stu901vwx234abc567def890ghi',
    status: 'SUCCESS',
    createdAt: '2024-03-14T16:20:00Z',
  },
  {
    id: 5,
    studentWallet: '0x5678901234567890123456789012345678901234',
    vendorWallet: '0x6789012345678901234567890123456789012345',
    amount: 500,
    txHash: '0xmno345pqr678stu901vwx234abc567def890ghi123jkl',
    status: 'SUCCESS',
    createdAt: '2024-03-14T14:10:00Z',
  },
  {
    id: 6,
    studentWallet: '0x1234567890123456789012345678901234567890',
    vendorWallet: '0x8901234567890123456789012345678901234567',
    amount: 100,
    txHash: '0xpqr678stu901vwx234abc567def890ghi123jkl456mno',
    status: 'FAILED',
    createdAt: '2024-03-14T12:00:00Z',
  },
  {
    id: 7,
    studentWallet: '0x2345678901234567890123456789012345678901',
    vendorWallet: '0x7890123456789012345678901234567890123456',
    amount: 325,
    txHash: '0xstu901vwx234abc567def890ghi123jkl456mno789pqr',
    status: 'SUCCESS',
    createdAt: '2024-03-13T18:30:00Z',
  },
  {
    id: 8,
    studentWallet: '0x3456789012345678901234567890123456789012',
    vendorWallet: '0x6789012345678901234567890123456789012345',
    amount: 175,
    txHash: '0xvwx234abc567def890ghi123jkl456mno789pqr012stu',
    status: 'SUCCESS',
    createdAt: '2024-03-13T15:45:00Z',
  },
  {
    id: 9,
    studentWallet: '0x4567890123456789012345678901234567890123',
    vendorWallet: '0x8901234567890123456789012345678901234567',
    amount: 50,
    txHash: '0xabc567def890ghi123jkl456mno789pqr012stu345vwx',
    status: 'SUCCESS',
    createdAt: '2024-03-13T13:20:00Z',
  },
  {
    id: 10,
    studentWallet: '0x5678901234567890123456789012345678901234',
    vendorWallet: '0x7890123456789012345678901234567890123456',
    amount: 400,
    txHash: '0xdef890ghi123jkl456mno789pqr012stu345vwx678abc',
    status: 'SUCCESS',
    createdAt: '2024-03-12T11:00:00Z',
  },
];
