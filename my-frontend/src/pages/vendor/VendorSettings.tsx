import React, { useEffect, useState } from 'react';
import { Store, Key, Eye, EyeOff, Copy, Check, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { getVendorSettings } from '@/services/vendorApi';

const VendorSettings: React.FC = () => {
  const { user, logout } = useAuth();

  const [vendor, setVendor] = useState<any>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadVendor();
    }
  }, [user?.id]);

  const loadVendor = async () => {
    try {
      const res = await getVendorSettings(user!.id);
      setVendor(res.data);
    } catch (err) {
      toast.error("Failed to load vendor data");
    }
  };

  const copyToClipboard = async (text: string, type: 'key' | 'address') => {
    await navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your vendor account</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-pink-500 flex items-center justify-center">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{vendor?.name}</h3>
            <p className="text-muted-foreground">{vendor?.email}</p>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium capitalize">
              Verified Vendor
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-secondary/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Vendor ID</p>
            <p className="font-mono">{vendor?.id}</p>
          </div>
        </div>
      </div>

      {/* Wallet Details */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Wallet Details
        </h3>

        <div className="space-y-4">
          {/* Wallet Address */}
          <div className="p-4 bg-secondary/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Wallet Address</p>
              <button
                onClick={() => copyToClipboard(vendor?.wallet_address || '', 'address')}
                className="copy-btn"
              >
                {copiedAddress ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="font-mono text-sm break-all">
              {vendor?.wallet_address}
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
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(vendor?.private_key || '', 'key')}
                  className="copy-btn"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="font-mono text-sm break-all">
              {showPrivateKey
                ? vendor?.private_key
                : '••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
            </p>

            <p className="text-xs text-destructive mt-2">
              ⚠️ Never share your private key with anyone!
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
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

export default VendorSettings;
