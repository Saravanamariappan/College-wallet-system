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
    color: string;
  }[] = [
    { id: 'student', label: 'Student', icon: <User className="w-5 h-5" />, color: 'from-primary to-cyan-400' },
    { id: 'vendor', label: 'Vendor', icon: <Building2 className="w-5 h-5" />, color: 'from-accent to-pink-500' },
    { id: 'admin', label: 'Admin', icon: <Shield className="w-5 h-5" />, color: 'from-warning to-orange-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // 🔥 IMPORTANT: role uppercase for backend
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground">
      {/* Left Panel */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md mx-auto lg:mx-0">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center animate-float">
              <Hexagon className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary">
                CampusPay
              </h1>
              <p className="text-muted-foreground">
                Blockchain Wallet System
              </p>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Digital Payments for <br />
            <span className="text-primary">Modern Campus</span>
          </h2>

          <p className="text-muted-foreground text-lg mb-8">
            Secure, fast, and transparent transactions powered by Polygon blockchain technology.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/2 p-6 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="glass-card p-6 lg:p-8">
            <h3 className="text-2xl font-bold mb-2">Welcome Back</h3>
            <p className="text-muted-foreground mb-8">
              Sign in to your account
            </p>

            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    role === r.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  <div
                    className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/20 text-primary flex items-center justify-center text-white`}
                  >
                    {r.icon}
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      role === r.id ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {r.label}
                  </p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50"
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
    </div>
  );
};

export default Login;
