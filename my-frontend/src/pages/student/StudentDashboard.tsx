import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Wallet, Send, History, Settings, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const StudentDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed lg:static z-50
        w-64 h-screen
        bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900
        text-white flex flex-col p-6 shadow-xl
        transform transition-transform duration-300

        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10">
          <img
            src="/logo.png"
            alt="KGiSL Logo"
            className="h-8 w-8 object-contain"
          />
          <h2 className="text-lg font-semibold tracking-wide">
            Student Wallet
          </h2>
        </div>

        {/* NAV LINKS */}
        <nav className="space-y-3 flex-1">
          <SidebarLink to="/student" icon={<Wallet size={18} />} label="My Wallet" />
          <SidebarLink to="/student/pay" icon={<Send size={18} />} label="Pay Vendor" />
          <SidebarLink to="/student/history" icon={<History size={18} />} label="Transactions" />
          <SidebarLink to="/student/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>

        {/* Divider */}
        <div className="border-t border-white/10 my-4" />

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl 
                     text-red-300 hover:bg-red-500/20 hover:text-red-200 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

        <p className="text-xs text-center text-purple-200 mt-6">
          © KGISL Wallet System
        </p>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* MOBILE HEADER */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="font-semibold">Student Wallet</h1>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">

          {/* TOP HEADER */}
          <div className="mb-8 flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">
                Welcome back 👋
              </h1>
              <p className="text-sm text-slate-500">
                Manage your wallet and transactions here
              </p>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <Outlet />

        </main>
      </div>

    </div>
  );
};

export default StudentDashboard;


/* ---------------- Sidebar Link ---------------- */

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
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${
          isActive
            ? "bg-white/20 text-white font-medium shadow"
            : "text-purple-100 hover:bg-white/15 hover:text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};