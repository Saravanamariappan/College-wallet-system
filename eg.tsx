import React from 'react';
import { LogOut, Hexagon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface DesktopSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; icon: React.ReactNode }[];
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ activeTab, onTabChange, tabs }) => {
  const { user, logout } = useAuth();

  // SAFE INITIAL HANDLING
  const initial =
  
    user?.email?.charAt(0)?.toUpperCase() ||
    "S";

  return (
    <aside className="
  hidden lg:flex flex-col w-64 h-screen
  bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900
  text-white
  fixed left-0 top-0
  p-5
">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
  <img
    src="/logo.png"
    alt="KGISL Logo"
    className="h-8 w-8 object-contain"
  />
  <h2 className="text-lg font-semibold tracking-wide">
    KGISL Wallet
  </h2>
</div>
            

      {/* User Info */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-white">
              {user?.email || "User"}
            </p>
            <p className="text-xs text-purple-200 capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
  activeTab === tab.id
    ? 'bg-white/20 text-white font-medium'
    : 'text-purple-100 hover:bg-white/15 hover:text-white'
}`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-5 py-4 border-t border-white/10">
        <button
  onClick={logout}
  className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl
             text-red-300 hover:bg-red-500/10 hover:text-red-200 transition"
>
  <LogOut size={18} />
  <span>Logout</span>
</button>
                <p className="text-xs text-center text-gray-400 mt-4">
                  © KGISL Wallet System
                </p>
      </div>
    </aside>
  );
};

export default DesktopSidebar;