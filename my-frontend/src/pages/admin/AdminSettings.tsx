import React, { useState } from 'react';
import { Key, Eye, EyeOff, Copy, Check, Shield, History, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AdminSettingsProps {
  onNavigate: (tab: string) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyToClipboard = async (text: string, type: 'key' | 'address') => {
    await navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
    toast.success('Copied!');
  };

  const menuItems = [
    { id: 'transactions', label: 'Transaction History', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Admin Settings</h1>
        <p className="text-muted-foreground">System configuration</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warning to-orange-500 flex items-center justify-center text-2xl font-bold text-white">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user?.name}</h3>
            <p className="text-muted-foreground">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-warning/20 text-warning text-xs font-medium">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass-card p-4 lg:p-6 lg:hidden">
        <h3 className="font-semibold mb-4">Quick Links</h3>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary transition-colors"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wallet Details */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Admin Wallet
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Wallet Address</p>
              <button onClick={() => copyToClipboard(user?.walletAddress || '', 'address')} className="copy-btn">
                {copiedAddress ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="font-mono text-sm break-all">{user?.walletAddress}</p>
          </div>

          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-destructive font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Private Key (Keep Secret!)
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowPrivateKey(!showPrivateKey)} className="p-2 rounded-lg bg-secondary/50">
                  {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => copyToClipboard(user?.privateKey || '', 'key')} className="copy-btn">
                  {copiedKey ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <p className="font-mono text-sm break-all">
              {showPrivateKey ? user?.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
            </p>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-semibold mb-4">System Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-muted-foreground">Network</span>
            <span className="font-medium">Polygon Amoy Testnet</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-muted-foreground">Contract Version</span>
            <span className="font-medium">v1.0.0</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
            <span className="text-muted-foreground">Status</span>
            <span className="text-success font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              Active
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default AdminSettings;
