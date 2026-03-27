"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Tag,
  Settings,
  Clock,
  CalendarOff,
  MessageSquare,
  LogOut,
} from "lucide-react";

import DashboardTab from "./components/dashboard-tab";
import BookingsTab from "./components/bookings-tab";
import SessionsTab from "./components/sessions-tab";
import TurnTypesTab from "./components/turn-types-tab";
import SiteConfigTab from "./components/site-config-tab";
import BusinessHoursTab from "./components/business-hours-tab";
import HolidaysTab from "./components/holidays-tab";
import MessagesTab from "./components/messages-tab";

type Tab =
  | "dashboard"
  | "bookings"
  | "sessions"
  | "turn-types"
  | "site-config"
  | "business-hours"
  | "holidays"
  | "messages";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Reservas", icon: BookOpen },
  { id: "sessions", label: "Sesiones", icon: Calendar },
  { id: "turn-types", label: "Tipos de Tanda", icon: Tag },
  { id: "site-config", label: "Configuración", icon: Settings },
  { id: "business-hours", label: "Horarios", icon: Clock },
  { id: "holidays", label: "Feriados", icon: CalendarOff },
  { id: "messages", label: "Mensajes", icon: MessageSquare },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "bookings":
        return <BookingsTab />;
      case "sessions":
        return <SessionsTab />;
      case "turn-types":
        return <TurnTypesTab />;
      case "site-config":
        return <SiteConfigTab />;
      case "business-hours":
        return <BusinessHoursTab />;
      case "holidays":
        return <HolidaysTab />;
      case "messages":
        return <MessagesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Panel de Admin</h1>
            <p className="text-muted text-sm">Gestión de eKartTrack</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-muted hover:text-red-400 hover:border-red-400/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                  : "bg-card-bg border border-card-border text-muted hover:text-white"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        {renderTab()}
      </div>
    </div>
  );
}
