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
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-card/50 border-r border-border/50 fixed left-0 top-0">

      {/* Logo */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Hexagon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold gradient-text">CampusPay</h1>
            <p className="text-xs text-muted-foreground">Blockchain Wallet</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">
              {user?.email || "User"}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary/20 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border/30">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
