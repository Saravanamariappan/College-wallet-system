import React from 'react';
import { Wallet, Send, History, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; icon: React.ReactNode }[];
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, tabs }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-card/90 backdrop-blur-xl border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`nav-btn flex-1 ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
