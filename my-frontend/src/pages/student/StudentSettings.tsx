import React, { useEffect, useState } from 'react';
import { User, Key, Eye, EyeOff, Copy, Check, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getStudentPrivateKey, changeStudentPassword } from '@/services/studentApi';
import { toast } from 'sonner';
import axios from 'axios';

const StudentSettings: React.FC = () => {
  const { user, logout } = useAuth();

  const [privateKey, setPrivateKey] = useState<string>('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

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

  const handleChangePassword = async () => {
    if (!newPassword) return toast.error('New password cannot be empty');
    setUpdatingPassword(true);

    try {
      await axios.put(`/api/students/change-password/${user?.id}`, {
        oldPassword,
        newPassword
      });

      setOldPassword('');
      setNewPassword('');
      toast.success('Password updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
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
            <p className="font-mono text-sm break-all">{user?.walletAddress}</p>
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

      {/* CHANGE PASSWORD */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Change Password
        </h3>

        <div className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Old Password (optional if admin)"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input input-bordered w-full"
          />
          <button
            onClick={handleChangePassword}
            className="btn btn-primary"
            disabled={updatingPassword}
          >
            {updatingPassword ? "Updating..." : "Update Password"}
          </button>
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