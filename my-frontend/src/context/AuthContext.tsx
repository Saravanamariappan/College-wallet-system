import React, { createContext, useContext, useState, useEffect } from "react";


const API_BASE = import.meta.env.VITE_API_BASE_URL ;

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setAuth(true);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      console.log("LOGIN API RESPONSE:", data);

      const fixedUser = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          walletAddress: data.user.wallet_address
        };
      console.log("FINAL USER:", fixedUser);

      setUser(fixedUser);
      setAuth(true);
      localStorage.setItem("user", JSON.stringify(fixedUser));

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAuth(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
