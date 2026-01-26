import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Wallet, Send, History, Settings, LogOut } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

const StudentDashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-5">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Student Panel
        </h2>

        {/* NAV LINKS */}
        <nav className="space-y-3 flex-1">
          <SidebarLink to="/student" icon={<Wallet size={18} />} label="My Wallet" />
          <SidebarLink to="/student/pay" icon={<Send size={18} />} label="Pay Vendor" />
          <SidebarLink to="/student/history" icon={<History size={18} />} label="Transactions" />
          <SidebarLink to="/student/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        {/* LOGOUT BUTTON (BOTTOM) */}
        <button
          onClick={logout}
          className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          © KGISL Wallet System
        </p>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashboard;

/* ---------------- Sidebar Button ---------------- */

type SidebarProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
};

const SidebarLink: React.FC<SidebarProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition
        ${isActive
          ? "bg-primary text-primary-foreground"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};
