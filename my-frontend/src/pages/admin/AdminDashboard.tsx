import React, { useState } from "react";
import {
  LayoutDashboard,
  UserPlus,
  Store,
  Coins,
  History,
  Settings,
  Users,
} from "lucide-react";

import BottomNav from "@/components/layout/BottomNav";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileHeader from "@/components/layout/MobileHeader";

import AdminOverview from "./AdminOverview";
import AdminAddStudent from "./AdminAddStudent";
import AdminAddVendor from "./AdminAddVendor";
import AdminMintTokens from "./AdminMintTokens";
import AdminTransactions from "./AdminTransactions";
import AdminSettings from "./AdminSettings";
import AdminManageUsers from "./AdminManageUsers";

const AdminDashboard: React.FC = () => {

  const [activeTab, setActiveTab] = useState("overview");

  const getPageTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Admin Overview";
      case "students":
        return "Add Students";
      case "vendors":
        return "Add Vendors";
      case "manage":
        return "Manage Users";
      case "mint":
        return "Mint Tokens";
      case "transactions":
        return "Transaction History";
      case "settings":
        return "Admin Settings";
      default:
        return "Admin Dashboard";
    }
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "students",
      label: "Students",
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      id: "vendors",
      label: "Vendors",
      icon: <Store className="w-5 h-5" />,
    },
    {
      id: "manage",
      label: "Manage",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "mint",
      label: "Mint",
      icon: <Coins className="w-5 h-5" />,
    },
    {
      id: "transactions",
      label: "History",
      icon: <History className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const mobileTabs = [
    {
      id: "overview",
      label: "Home",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "manage",
      label: "Users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "mint",
      label: "Mint",
      icon: <Coins className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const renderContent = () => {
    if (activeTab === "overview") return <AdminOverview />;
    if (activeTab === "students") return <AdminAddStudent />;
    if (activeTab === "vendors") return <AdminAddVendor />;
    if (activeTab === "manage") return <AdminManageUsers />;
    if (activeTab === "mint") return <AdminMintTokens />;
    if (activeTab === "transactions") return <AdminTransactions />;
    if (activeTab === "settings") return <AdminSettings onNavigate={setActiveTab} />;
    return <AdminOverview />;
  };

  return (
    <div className="min-h-screen bg-background">

      <MobileHeader />

      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        tabs={tabs}
      />

      <main className="pt-16 pb-24 lg:pt-0 lg:pb-0 lg:ml-64">

        <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">

          <h1 className="text-3xl font-bold tracking-tight">
            {getPageTitle()}
          </h1>

          {renderContent()}

        </div>

      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        tabs={mobileTabs}
      />

    </div>
  );
};

export default AdminDashboard;