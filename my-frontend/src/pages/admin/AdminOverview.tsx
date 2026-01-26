import React from 'react';
import { Users, Store, Coins, ArrowLeftRight, TrendingUp, Activity } from 'lucide-react';
import StatCard from '@/components/common/StatCard';
import { mockStudents, mockVendors, mockTransactions } from '@/data/mockData';

const AdminOverview: React.FC = () => {
  const totalTokensMinted = mockTransactions
    .filter(tx => tx.type === 'mint')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const stats = [
    {
      title: 'Total Students',
      value: mockStudents.length,
      icon: <Users className="w-6 h-6 text-primary" />,
      trend: '+3 this week',
      trendUp: true,
    },
    {
      title: 'Total Vendors',
      value: mockVendors.length,
      icon: <Store className="w-6 h-6 text-primary" />,
      trend: '+1 this week',
      trendUp: true,
    },
    {
      title: 'Tokens Minted',
      value: `₹${totalTokensMinted.toLocaleString()}`,
      icon: <Coins className="w-6 h-6 text-primary" />,
      trend: '+15%',
      trendUp: true,
    },
    {
      title: 'Transactions',
      value: mockTransactions.length,
      icon: <ArrowLeftRight className="w-6 h-6 text-primary" />,
      trend: '+24 today',
      trendUp: true,
    },
  ];

  const recentActivity = [
    { type: 'mint', description: 'Minted 500 tokens to Rahul Kumar', time: '2 mins ago', icon: <Coins className="w-4 h-4" />, color: 'text-success' },
    { type: 'register', description: 'New student registered: Priya Sharma', time: '15 mins ago', icon: <Users className="w-4 h-4" />, color: 'text-primary' },
    { type: 'payment', description: 'Payment: 150 tokens from STU001 to VND001', time: '1 hour ago', icon: <ArrowLeftRight className="w-4 h-4" />, color: 'text-accent' },
    { type: 'vendor', description: 'New vendor registered: Book Store', time: '3 hours ago', icon: <Store className="w-4 h-4" />, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="glass-card p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-xl">
                <div className={`w-8 h-8 rounded-lg bg-secondary flex items-center justify-center ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-4 lg:p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            This Week's Performance
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Transaction Volume</span>
                <span className="text-sm font-medium">₹45,230</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-sm font-medium">89%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '89%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Vendor Engagement</span>
                <span className="text-sm font-medium">62%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Token Circulation</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="glass-card p-4 lg:p-6 bg-success/5 border-success/20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          <div>
            <p className="font-medium text-success">All Systems Operational</p>
            <p className="text-sm text-muted-foreground">Polygon Amoy Testnet connected • Last block: 2 seconds ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
