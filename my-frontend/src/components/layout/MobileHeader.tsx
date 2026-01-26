import React from 'react';
import { LogOut, Hexagon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const MobileHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
            <Hexagon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-sm gradient-text">CampusPay</h1>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
