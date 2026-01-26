import React, { useState } from 'react';
import {
  User,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const StudentSettings: React.FC = () => {
  const { user, logout } = useAuth();

  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const safeName = user?.name || user?.email?.split('@')[0] || 'Student';

  const copyToClipboard = async (
    text?: string,
    type?: 'key' | 'address'
  ) => {
    if (!text) {
      toast.error('Nothing to copy');
      return;
    }

    await navigator.clipboard.writeText(text);

    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }

    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }

    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account
        </p>
      </div>

      {/* Profile */}
      <div className="glass-card p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {safeName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              {safeName}
            </h3>
            <p className="text-muted-foreground">
              {user?.email}
            </p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">
              Student ID
            </p>
            <p className="font-mono">{user?.id}</p>
          </div>
        </div>
      </div>

      {/* Wallet */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Wallet Details
        </h3>

        <div className="space-y-4">
          {/* Wallet Address */}
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                Wallet Address
              </p>
              <button
                onClick={() =>
                  copyToClipboard(
                    user?.walletAddress,
                    'address'
                  )
                }
                className="copy-btn"
              >
                {copiedAddress ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="font-mono text-sm break-all">
              {user?.walletAddress || '—'}
            </p>
          </div>

          {/* Private Key */}
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-destructive font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Private Key (Keep Secret!)
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setShowPrivateKey(!showPrivateKey)
                  }
                  className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition"
                >
                  {showPrivateKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() =>
                    copyToClipboard(
                      user?.privateKey,
                      'key'
                    )
                  }
                  className="copy-btn"
                >
                  {copiedKey ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="font-mono text-sm break-all">
              {showPrivateKey
                ? user?.privateKey
                : '••••••••••••••••••••••••••••••••••••••••••••••••••'}
            </p>

            <p className="text-xs text-destructive mt-2">
              ⚠️ Never share your private key with anyone!
            </p>
          </div>
        </div>
      </div>

      {/* Preferences (UI only) */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Preferences
        </h3>

        <div className="space-y-3">
          {['Push Notifications', 'Transaction Alerts'].map(
            (label) => (
              <div
                key={label}
                className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl"
              >
                <span>{label}</span>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default StudentSettings;
