import React, { useState } from "react";
import {
  Wallet,
  History,
  Settings,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";

import BottomNav from "@/components/layout/BottomNav";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import MobileHeader from "@/components/layout/MobileHeader";

import VendorWallet from "./VendorWallet";
import VendorReceive from "./VendorReceive";
import VendorHistory from "./VendorHistory";
import VendorSettings from "./VendorSettings";

const VendorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("wallet");

  const tabs = [
    { id: "wallet", label: "Wallet", icon: <Wallet className="w-5 h-5" /> },
    { id: "receive", label: "Send", icon: <ArrowUpRight className="w-5 h-5" /> },
    { id: "history", label: "History", icon: <History className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "wallet":
        return <VendorWallet />;
      case "receive":
        return <VendorReceive />;
      case "history":
        return <VendorHistory />;
      case "settings":
        return <VendorSettings />;
      default:
        return <VendorWallet />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

      {/* Header */}
      <MobileHeader />

      {/* Sidebar (Desktop) */}
      <DesktopSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {/* Main Content */}
      <main className="pt-16 pb-24 lg:pt-0 lg:pb-0 lg:ml-64 transition-all duration-300">
        <div className="p-4 lg:p-10 max-w-6xl mx-auto space-y-6">


          {/* Content Card Wrapper */}
          <div className="glass-card rounded-2xl shadow-sm p-4 lg:p-8 transition hover:shadow-md">
            {renderContent()}
          </div>

        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
    </div>
  );
};

export default VendorDashboard;