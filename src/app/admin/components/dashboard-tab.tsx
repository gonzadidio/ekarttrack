"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, Calendar, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Stats {
  totalBookings: number;
  confirmedBookings: number;
  totalPilots: number;
  totalSessions: number;
  pendingMessages: number;
  recentBookings: Array<{
    id: string;
    status: string;
    participants: number;
    createdAt: string;
    pilot: { name: string; email: string };
    session: { date: string; startTime: string };
  }>;
}

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-neon-green bg-neon-green/10",
  CANCELLED: "text-red-400 bg-red-400/10",
  COMPLETED: "text-neon-cyan bg-neon-cyan/10",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
};

export default function DashboardTab() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) return;
      setStats(await res.json());
    } catch {
      toast.error("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const recentBookings = stats.recentBookings || [];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reservas", value: stats.totalBookings, icon: BookOpen, color: "text-neon-green" },
          { label: "Pilotos", value: stats.totalPilots, icon: Users, color: "text-neon-cyan" },
          { label: "Sesiones", value: stats.totalSessions, icon: Calendar, color: "text-neon-purple" },
          { label: "Mensajes sin leer", value: stats.pendingMessages, icon: Mail, color: "text-yellow-400" },
        ].map((stat) => (
          <div key={stat.label} className="p-6 rounded-xl bg-card-bg border border-card-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-bold text-white">Últimas Reservas</h3>
        </div>
        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-muted">No hay reservas aún</div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {recentBookings.map((b) => (
              <div key={b.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{b.pilot.name}</p>
                  <p className="text-sm text-muted">{b.pilot.email}</p>
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold text-neon-cyan">
                    {b.participants} pers.
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">
                    {new Date(b.session.date).toLocaleDateString("es-AR")} — {b.session.startTime}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Sessions Summary */}
      <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-bold text-white">Resumen del Día</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-neon-green">{stats.confirmedBookings}</p>
              <p className="text-sm text-muted mt-1">Reservas Confirmadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-neon-cyan">{stats.totalSessions}</p>
              <p className="text-sm text-muted mt-1">Sesiones Totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-neon-purple">{stats.totalPilots}</p>
              <p className="text-sm text-muted mt-1">Pilotos Registrados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
