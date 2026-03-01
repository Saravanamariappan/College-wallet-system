import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, User, Building2, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles: {
    id: UserRole;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { id: 'student', label: 'Student', icon: <User className="w-5 h-5" /> },
    { id: 'vendor', label: 'Vendor', icon: <Building2 className="w-5 h-5" /> },
    { id: 'admin', label: 'Admin', icon: <Shield className="w-5 h-5" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // 🔥 Backend logic SAME as before
      const success = await login(email.trim(), password, role.toUpperCase());

      if (success) {
        toast.success('Welcome back!');
        navigate(`/${role.toLowerCase()}`);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* 🌈 Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-purple-50 to-indigo-100" />

      {/* 🖼 Optional Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-left"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-white/60" />

      {/* 🔷 Branding Left Side (From First UI) */}
      <div className="absolute left-10 top-10 flex items-center gap-4 z-10">
        <div className="w-14 h-14 rounded-2xl bg-purple-200 flex items-center justify-center">
          <Hexagon className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-purple-700">
            CampusPay
          </h1>
          <p className="text-sm text-purple-500">
            Blockchain Wallet System
          </p>
        </div>
      </div>

      {/* 🎯 Centered Login Card */}
      <div className="relative z-10 flex min-h-screen items-center justify-end px-6 md:px-20">
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl rounded-3xl w-[480px] p-8 animate-fade-in">

          <h3 className="text-2xl font-semibold mb-1 text-purple-800">
            Welcome Back
          </h3>
          <p className="text-purple-600 mb-8">
            Sign in to your account
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`p-4 rounded-xl border transition-all ${
                  role === r.id
                    ? 'border-purple-600 bg-purple-100'
                    : 'border-white/40 bg-white/20'
                }`}
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white/40 flex items-center justify-center text-purple-700">
                  {r.icon}
                </div>
                <p className="text-sm font-medium text-purple-800">
                  {r.label}
                </p>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-purple-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3 bg-white text-purple-900 focus:outline-none shadow"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-purple-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 bg-white text-purple-900 pr-12 focus:outline-none shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold
                         bg-purple-600 text-white
                         hover:bg-purple-700 transition
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;