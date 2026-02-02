import React, { useEffect, useState } from 'react';
import { User, Key, Eye, EyeOff, Copy, Check, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getStudentPrivateKey } from '@/services/studentApi';
import { toast } from 'sonner';

const StudentSettings: React.FC = () => {
  const { user, logout } = useAuth();

  const [privateKey, setPrivateKey] = useState<string>('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    getStudentPrivateKey(user.id)
      .then(res => setPrivateKey(res.data.privateKey))
      .catch(() => toast.error("Failed to load private key"));
  }, [user?.id]);

  const safeName = user?.name || user?.email?.split('@')[0] || 'Student';

  const copyToClipboard = async (text?: string, type?: 'key' | 'address') => {
    if (!text) return toast.error('Nothing to copy');

    await navigator.clipboard.writeText(text);

    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }

    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }

    toast.success('Copied!');
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* PROFILE */}
      <div className="glass-card p-4">
        <h3 className="text-xl font-semibold mb-1">{safeName}</h3>
        <p className="text-muted-foreground">{user?.email}</p>
        <p className="text-xs mt-1">ID: {user?.id}</p>
      </div>

      {/* WALLET */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Wallet
        </h3>

        {/* ADDRESS */}
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs mb-1">Wallet Address</p>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-sm break-all">
              {user?.walletAddress}
            </p>
            <button onClick={() => copyToClipboard(user?.walletAddress, 'address')}>
              {copiedAddress ? <Check /> : <Copy />}
            </button>
          </div>
        </div>

        {/* PRIVATE KEY */}
        <div className="p-3 mt-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-xs text-destructive mb-1 flex items-center gap-1">
            <Shield size={14} /> Private Key
          </p>

          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-sm break-all">
              {showPrivateKey ? privateKey : "••••••••••••••••••••••••••••••••"}
            </p>

            <div className="flex gap-2">
              <button onClick={() => setShowPrivateKey(!showPrivateKey)}>
                {showPrivateKey ? <EyeOff /> : <Eye />}
              </button>
              <button onClick={() => copyToClipboard(privateKey, 'key')}>
                {copiedKey ? <Check /> : <Copy />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECURITY INFO */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-2">Security Tips</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          <li>Never share your private key</li>
          <li>Do not store screenshots of private key</li>
          <li>Use wallet only on trusted devices</li>
        </ul>
      </div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="w-full glass-card p-4 flex items-center justify-center gap-2 text-destructive"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

export default StudentSettings;
