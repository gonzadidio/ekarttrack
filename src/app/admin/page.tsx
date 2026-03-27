"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, BookOpen, MessageSquare, LogOut,
  Users, Trophy, Clock, Mail, ChevronRight, Plus, Loader2,
  CheckCircle, XCircle, AlertCircle, Zap
} from "lucide-react";
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

interface Booking {
  id: string;
  status: string;
  participants: number;
  notes: string | null;
  createdAt: string;
  pilot: { name: string; email: string; phone: string | null };
  session: { date: string; startTime: string; endTime: string; price: number };
}

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPilots: number;
  price: number;
  status: string;
  _count: { bookings: number };
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

type Tab = "dashboard" | "bookings" | "sessions" | "messages";

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSession, setNewSession] = useState({
    date: "", startTime: "", endTime: "", maxPilots: "10", price: ""
  });

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "dashboard") {
        const res = await fetch("/api/admin/stats");
        if (res.status === 401) { router.push("/admin/login"); return; }
        if (!res.ok) return;
        setStats(await res.json());
      } else if (tab === "bookings") {
        const res = await fetch("/api/admin/bookings");
        if (res.status === 401) { router.push("/admin/login"); return; }
        if (!res.ok) return;
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } else if (tab === "sessions") {
        const res = await fetch("/api/admin/sessions");
        if (res.status === 401) { router.push("/admin/login"); return; }
        if (!res.ok) return;
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : []);
      } else if (tab === "messages") {
        const res = await fetch("/api/admin/messages");
        if (res.status === 401) { router.push("/admin/login"); return; }
        if (!res.ok) return;
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success("Reserva actualizada");
        loadData();
      }
    } catch {
      toast.error("Error al actualizar");
    }
  };

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSession),
      });
      if (res.ok) {
        toast.success("Sesión creada");
        setShowNewSession(false);
        setNewSession({ date: "", startTime: "", endTime: "", maxPilots: "10", price: "" });
        loadData();
      }
    } catch {
      toast.error("Error al crear sesión");
    }
  };

  const markMessageRead = async (id: string) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      loadData();
    } catch {
      toast.error("Error al marcar como leído");
    }
  };

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings" as const, label: "Reservas", icon: BookOpen },
    { id: "sessions" as const, label: "Sesiones", icon: Calendar },
    { id: "messages" as const, label: "Mensajes", icon: MessageSquare },
  ];

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

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                  : "bg-card-bg border border-card-border text-muted hover:text-white"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {tab === "dashboard" && stats && (
              <div className="space-y-8">
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
                  {!stats.recentBookings || stats.recentBookings.length === 0 ? (
                    <div className="p-8 text-center text-muted">No hay reservas aún</div>
                  ) : (
                    <div className="divide-y divide-white/[0.03]">
                      {stats.recentBookings.map((b) => (
                        <div key={b.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{b.pilot.name}</p>
                            <p className="text-sm text-muted">{b.pilot.email}</p>
                          </div>
                          <div className="text-center">
                            <span className="text-sm font-semibold text-neon-cyan">{b.participants} {b.participants === 1 ? "pers." : "pers."}</span>
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
              </div>
            )}

            {/* Bookings Tab */}
            {tab === "bookings" && (
              <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <h3 className="font-bold text-white">Todas las Reservas</h3>
                </div>
                {bookings.length === 0 ? (
                  <div className="p-12 text-center text-muted">No hay reservas</div>
                ) : (
                  <div className="divide-y divide-white/[0.03]">
                    {bookings.map((b) => (
                      <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <p className="text-white font-medium">{b.pilot.name}</p>
                          <p className="text-sm text-muted">{b.pilot.email} {b.pilot.phone && `• ${b.pilot.phone}`}</p>
                          {b.notes && <p className="text-xs text-muted/70 mt-1 italic">&quot;{b.notes}&quot;</p>}
                        </div>
                        <div className="text-center px-4">
                          <p className="text-2xl font-black text-neon-cyan">{b.participants}</p>
                          <p className="text-xs text-muted">{b.participants === 1 ? "persona" : "personas"}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-white">
                            {new Date(b.session.date).toLocaleDateString("es-AR")} — {b.session.startTime} a {b.session.endTime}
                          </p>
                          <p className="text-neon-green font-semibold">${(b.session.price * b.participants).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-3 py-1 rounded-full ${statusColors[b.status]}`}>
                            {statusLabels[b.status]}
                          </span>
                          {b.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
                                className="p-1.5 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-all"
                                title="Confirmar"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateBookingStatus(b.id, "CANCELLED")}
                                className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all"
                                title="Cancelar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sessions Tab */}
            {tab === "sessions" && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowNewSession(!showNewSession)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Sesión
                  </button>
                </div>

                {showNewSession && (
                  <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={createSession}
                    className="p-6 rounded-xl bg-card-bg border border-neon-green/20 space-y-4"
                  >
                    <h3 className="font-bold text-white">Crear Nueva Sesión</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label className="text-xs text-muted">Fecha</label>
                        <input
                          type="date"
                          required
                          value={newSession.date}
                          onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted">Hora Inicio</label>
                        <input
                          type="time"
                          required
                          value={newSession.startTime}
                          onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted">Hora Fin</label>
                        <input
                          type="time"
                          required
                          value={newSession.endTime}
                          onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted">Máx. Pilotos</label>
                        <input
                          type="number"
                          required
                          value={newSession.maxPilots}
                          onChange={(e) => setNewSession({ ...newSession, maxPilots: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted">Precio ($)</label>
                        <input
                          type="number"
                          required
                          value={newSession.price}
                          onChange={(e) => setNewSession({ ...newSession, price: e.target.value })}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowNewSession(false)}
                        className="px-4 py-2 rounded-lg border border-white/10 text-muted text-sm hover:text-white transition-all"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg bg-neon-green text-black font-semibold text-sm hover:bg-neon-green/90 transition-all"
                      >
                        Crear
                      </button>
                    </div>
                  </motion.form>
                )}

                <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
                  <div className="p-5 border-b border-white/5">
                    <h3 className="font-bold text-white">Todas las Sesiones</h3>
                  </div>
                  {sessions.length === 0 ? (
                    <div className="p-12 text-center text-muted">No hay sesiones creadas</div>
                  ) : (
                    <div className="divide-y divide-white/[0.03]">
                      {sessions.map((s) => (
                        <div key={s.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">
                              {new Date(s.date).toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })}
                              {" — "}{s.startTime} a {s.endTime}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-muted">
                                <Users className="w-3 h-3 inline mr-1" />
                                {s._count.bookings}/{s.maxPilots} pilotos
                              </span>
                              <span className="text-sm text-neon-green font-semibold">${s.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            s.status === "OPEN" ? "text-neon-green bg-neon-green/10" :
                            s.status === "FULL" ? "text-yellow-400 bg-yellow-400/10" :
                            s.status === "COMPLETED" ? "text-neon-cyan bg-neon-cyan/10" :
                            "text-muted bg-white/5"
                          }`}>
                            {s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {tab === "messages" && (
              <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
                <div className="p-5 border-b border-white/5">
                  <h3 className="font-bold text-white">Mensajes de Contacto</h3>
                </div>
                {messages.length === 0 ? (
                  <div className="p-12 text-center text-muted">No hay mensajes</div>
                ) : (
                  <div className="divide-y divide-white/[0.03]">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-5 ${!m.read ? "bg-neon-green/[0.02]" : ""}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {!m.read && <div className="w-2 h-2 rounded-full bg-neon-green" />}
                              <p className="text-white font-medium">{m.name}</p>
                              <span className="text-xs text-muted">{m.email}</span>
                            </div>
                            <p className="text-sm text-neon-green font-medium mb-1">{m.subject}</p>
                            <p className="text-sm text-muted">{m.message}</p>
                            <p className="text-xs text-muted/50 mt-2">
                              {new Date(m.createdAt).toLocaleString("es-AR")}
                            </p>
                          </div>
                          {!m.read && (
                            <button
                              onClick={() => markMessageRead(m.id)}
                              className="text-xs px-3 py-1 rounded-full border border-white/10 text-muted hover:text-white transition-all"
                            >
                              Marcar leído
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
