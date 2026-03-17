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
      await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/students/change-password/${user?.id}`,{
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
      <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg flex items-center gap-4 hover:shadow-xl transition">

  {/* Avatar */}
  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
    {safeName?.charAt(0).toUpperCase()}
  </div>

  {/* User Info */}
  <div className="flex flex-col">
    <h3 className="text-xl font-semibold text-slate-800 leading-tight">
      {safeName}
    </h3>

    <p className="text-sm text-slate-500">
      {user?.email}
    </p>

    <p className="text-xs text-slate-400 mt-1">
      ID: {user?.id}
    </p>
  </div>

</div>

      {/* WALLET */}
      <div className="bg-white/20 
                backdrop-blur-md 
                border border-white/30 
                rounded-2xl 
                p-6 
                shadow-lg">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Wallet
        </h3>

        {/* ADDRESS */}
        <div className="p-3 bg-secondary/50 rounded-lg">
          <p className="text-xs mb-1">Wallet Address (Public Key)</p>
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
     {/* CHANGE PASSWORD */}
<div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition space-y-5">

  {/* Header */}
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
      <Key className="w-5 h-5" />
    </div>
    <h3 className="font-semibold text-lg text-slate-800">
      Change Password
    </h3>
  </div>

  {/* Inputs */}
  <div className="flex flex-col gap-4">

    <input
      type="password"
      placeholder="Old Password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
    />

    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white/60 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
    />

  </div>

  {/* Button */}
  <button
    onClick={handleChangePassword}
    disabled={updatingPassword}
    className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md hover:scale-[1.02] hover:shadow-lg transition disabled:opacity-60"
  >
    {updatingPassword ? "Updating..." : "Update Password"}
  </button>

</div>

      
    </div>
  );
};

export default StudentSettings;