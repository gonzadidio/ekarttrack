"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Plus,
  Users,
  Edit3,
  Trash2,
  XCircle,
  MessageCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

interface TurnType {
  id: string;
  name: string;
  durationMin: number;
  defaultPrice: number;
  maxPilots: number;
  color: string | null;
  isActive: boolean;
}

interface SessionBooking {
  id: string;
  status: string;
  participants: number;
  pilot: { name: string; email: string; phone: string | null };
}

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPilots: number;
  price: number;
  status: string;
  turnTypeId: string | null;
  turnType: TurnType | null;
  _count: { bookings: number };
  bookings: SessionBooking[];
}

interface WhatsAppNotification {
  pilotName: string;
  pilotPhone: string;
  waLink: string;
}

const sessionStatusColors: Record<string, string> = {
  OPEN: "text-neon-green bg-neon-green/10",
  FULL: "text-yellow-400 bg-yellow-400/10",
  IN_PROGRESS: "text-neon-cyan bg-neon-cyan/10",
  COMPLETED: "text-gray-400 bg-gray-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

const inputClass =
  "px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all w-full";

export default function SessionsTab() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [turnTypes, setTurnTypes] = useState<TurnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showBulkCreate, setShowBulkCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [waNotifications, setWaNotifications] = useState<Record<string, WhatsAppNotification[]>>({});
  const [showWaFor, setShowWaFor] = useState<string | null>(null);

  const [newSession, setNewSession] = useState({
    turnTypeId: "",
    date: "",
    startTime: "",
    endTime: "",
    maxPilots: "10",
    price: "",
  });

  const [bulkData, setBulkData] = useState({
    turnTypeId: "",
    dateFrom: "",
    dateTo: "",
    timeSlots: "10:00,12:00,14:00,16:00,18:00",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [sessRes, ttRes] = await Promise.all([
        fetch("/api/admin/sessions"),
        fetch("/api/admin/turn-types"),
      ]);
      if (sessRes.status === 401) {
        router.push("/admin/login");
        return;
      }
      const sessData = await sessRes.json();
      const ttData = await ttRes.json();
      setSessions(Array.isArray(sessData) ? sessData : []);
      setTurnTypes(Array.isArray(ttData) ? ttData.filter((t: TurnType) => t.isActive) : []);
    } catch {
      toast.error("Error al cargar sesiones");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTurnTypeSelect = (turnTypeId: string) => {
    const tt = turnTypes.find((t) => t.id === turnTypeId);
    if (tt) {
      setNewSession((prev) => ({
        ...prev,
        turnTypeId,
        maxPilots: String(tt.maxPilots),
        price: String(tt.defaultPrice),
        endTime: prev.startTime
          ? calculateEndTime(prev.startTime, tt.durationMin)
          : "",
      }));
    } else {
      setNewSession((prev) => ({ ...prev, turnTypeId }));
    }
  };

  const handleStartTimeChange = (startTime: string) => {
    const tt = turnTypes.find((t) => t.id === newSession.turnTypeId);
    setNewSession((prev) => ({
      ...prev,
      startTime,
      endTime: tt ? calculateEndTime(startTime, tt.durationMin) : prev.endTime,
    }));
  };

  const calculateEndTime = (start: string, durationMin: number): string => {
    const [h, m] = start.split(":").map(Number);
    const total = h * 60 + m + durationMin;
    const eh = Math.floor(total / 60) % 24;
    const em = total % 60;
    return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
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
        setNewSession({ turnTypeId: "", date: "", startTime: "", endTime: "", maxPilots: "10", price: "" });
        loadData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al crear sesión");
      }
    } catch {
      toast.error("Error al crear sesión");
    }
  };

  const bulkCreateSessions = async (e: React.FormEvent) => {
    e.preventDefault();
    const tt = turnTypes.find((t) => t.id === bulkData.turnTypeId);
    if (!tt) {
      toast.error("Seleccioná un tipo de tanda");
      return;
    }

    const slots = bulkData.timeSlots
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (slots.length === 0) {
      toast.error("Agregá al menos un horario");
      return;
    }

    const dateFrom = new Date(bulkData.dateFrom);
    const dateTo = new Date(bulkData.dateTo);
    if (dateFrom > dateTo) {
      toast.error("La fecha de inicio debe ser anterior a la de fin");
      return;
    }

    let created = 0;
    let errors = 0;
    const current = new Date(dateFrom);

    while (current <= dateTo) {
      for (const slot of slots) {
        try {
          const res = await fetch("/api/admin/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              turnTypeId: tt.id,
              date: current.toISOString().split("T")[0],
              startTime: slot,
              endTime: calculateEndTime(slot, tt.durationMin),
              maxPilots: String(tt.maxPilots),
              price: String(tt.defaultPrice),
            }),
          });
          if (res.ok) created++;
          else errors++;
        } catch {
          errors++;
        }
      }
      current.setDate(current.getDate() + 1);
    }

    toast.success(`${created} sesiones creadas${errors > 0 ? `, ${errors} errores` : ""}`);
    setShowBulkCreate(false);
    loadData();
  };

  const updateSession = async (id: string, data: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        toast.success("Sesión actualizada");
        setEditingId(null);
        loadData();
      } else {
        const resData = await res.json();
        toast.error(resData.error || "Error al actualizar");
      }
    } catch {
      toast.error("Error al actualizar sesión");
    }
  };

  const cancelSession = async (id: string) => {
    if (!confirm("¿Cancelar esta sesión? Se cancelarán las reservas confirmadas.")) return;
    await updateSession(id, { status: "CANCELLED" });
  };

  const deleteSession = async (id: string) => {
    if (!confirm("¿Eliminar esta sesión permanentemente?")) return;
    try {
      const res = await fetch(`/api/admin/sessions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Sesión eliminada");
        loadData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al eliminar");
      }
    } catch {
      toast.error("Error al eliminar sesión");
    }
  };

  const fetchWhatsAppNotifications = async (sessionId: string) => {
    if (showWaFor === sessionId) {
      setShowWaFor(null);
      return;
    }
    try {
      const res = await fetch("/api/admin/whatsapp-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setWaNotifications((prev) => ({ ...prev, [sessionId]: Array.isArray(data) ? data : [] }));
        setShowWaFor(sessionId);
      }
    } catch {
      toast.error("Error al obtener datos de WhatsApp");
    }
  };

  const startEdit = (s: Session) => {
    setEditingId(s.id);
    setEditData({
      startTime: s.startTime,
      endTime: s.endTime,
      price: String(s.price),
      maxPilots: String(s.maxPilots),
      turnTypeId: s.turnTypeId || "",
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateSession(editingId, {
      startTime: editData.startTime,
      endTime: editData.endTime,
      price: editData.price,
      maxPilots: editData.maxPilots,
      turnTypeId: editData.turnTypeId || undefined,
    });
  };

  // Group sessions by date
  const grouped = sessions.reduce<Record<string, Session[]>>((acc, s) => {
    const dateKey = new Date(s.date).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(s);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => {
            setShowBulkCreate(!showBulkCreate);
            setShowNewSession(false);
          }}
          className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-muted hover:text-white rounded-lg text-sm transition-all"
        >
          <Copy className="w-4 h-4" />
          Crear en Lote
        </button>
        <button
          onClick={() => {
            setShowNewSession(!showNewSession);
            setShowBulkCreate(false);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva Sesión
        </button>
      </div>

      {/* New Session Form */}
      <AnimatePresence>
        {showNewSession && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={createSession}
            className="p-6 rounded-xl bg-card-bg border border-neon-green/20 space-y-4 overflow-hidden"
          >
            <h3 className="font-bold text-white">Crear Nueva Sesión</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">Tipo de Tanda</label>
                <select
                  value={newSession.turnTypeId}
                  onChange={(e) => handleTurnTypeSelect(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Sin tipo</option>
                  {turnTypes.map((tt) => (
                    <option key={tt.id} value={tt.id}>
                      {tt.name} ({tt.durationMin} min - ${tt.defaultPrice})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Fecha</label>
                <input
                  type="date"
                  required
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Hora Inicio</label>
                <input
                  type="time"
                  required
                  value={newSession.startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Hora Fin</label>
                <input
                  type="time"
                  required
                  value={newSession.endTime}
                  onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Máx. Pilotos</label>
                <input
                  type="number"
                  required
                  value={newSession.maxPilots}
                  onChange={(e) => setNewSession({ ...newSession, maxPilots: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Precio ($)</label>
                <input
                  type="number"
                  required
                  value={newSession.price}
                  onChange={(e) => setNewSession({ ...newSession, price: e.target.value })}
                  className={inputClass}
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
                className="px-5 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm"
              >
                Crear Sesión
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Bulk Create Form */}
      <AnimatePresence>
        {showBulkCreate && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={bulkCreateSessions}
            className="p-6 rounded-xl bg-card-bg border border-neon-purple/20 space-y-4 overflow-hidden"
          >
            <h3 className="font-bold text-white">Crear Sesiones en Lote</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">Tipo de Tanda</label>
                <select
                  required
                  value={bulkData.turnTypeId}
                  onChange={(e) => setBulkData({ ...bulkData, turnTypeId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Seleccionar...</option>
                  {turnTypes.map((tt) => (
                    <option key={tt.id} value={tt.id}>
                      {tt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Fecha Desde</label>
                <input
                  type="date"
                  required
                  value={bulkData.dateFrom}
                  onChange={(e) => setBulkData({ ...bulkData, dateFrom: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Fecha Hasta</label>
                <input
                  type="date"
                  required
                  value={bulkData.dateTo}
                  onChange={(e) => setBulkData({ ...bulkData, dateTo: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Horarios (separados por coma)</label>
                <input
                  type="text"
                  required
                  value={bulkData.timeSlots}
                  onChange={(e) => setBulkData({ ...bulkData, timeSlots: e.target.value })}
                  placeholder="10:00,12:00,14:00"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowBulkCreate(false)}
                className="px-4 py-2 rounded-lg border border-white/10 text-muted text-sm hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm"
              >
                Crear en Lote
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Sessions Grouped by Date */}
      {sessions.length === 0 ? (
        <div className="rounded-xl bg-card-bg border border-card-border p-12 text-center text-muted">
          No hay sesiones creadas
        </div>
      ) : (
        sortedDates.map((dateKey) => {
          const daySessions = grouped[dateKey];
          const dateLabel = new Date(dateKey + "T12:00:00").toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          return (
            <div key={dateKey} className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
              <div className="p-5 border-b border-white/5">
                <h3 className="font-bold text-white capitalize">{dateLabel}</h3>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {daySessions.map((s) => {
                  const isEditing = editingId === s.id;
                  const confirmedCount = s.bookings?.filter((b) => b.status === "CONFIRMED").length ?? s._count.bookings;
                  const hasConfirmedBookings = confirmedCount > 0;

                  return (
                    <div key={s.id} className="p-4">
                      {isEditing ? (
                        /* Inline Edit Mode */
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <div>
                              <label className="text-xs text-muted">Tipo</label>
                              <select
                                value={editData.turnTypeId}
                                onChange={(e) => setEditData({ ...editData, turnTypeId: e.target.value })}
                                className={inputClass}
                              >
                                <option value="">Sin tipo</option>
                                {turnTypes.map((tt) => (
                                  <option key={tt.id} value={tt.id}>{tt.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-muted">Inicio</label>
                              <input
                                type="time"
                                value={editData.startTime}
                                onChange={(e) => setEditData({ ...editData, startTime: e.target.value })}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted">Fin</label>
                              <input
                                type="time"
                                value={editData.endTime}
                                onChange={(e) => setEditData({ ...editData, endTime: e.target.value })}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted">Precio</label>
                              <input
                                type="number"
                                value={editData.price}
                                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted">Máx. Pilotos</label>
                              <input
                                type="number"
                                value={editData.maxPilots}
                                onChange={(e) => setEditData({ ...editData, maxPilots: e.target.value })}
                                className={inputClass}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-2 rounded-lg border border-white/10 text-muted hover:text-white transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={saveEdit}
                              className="flex items-center gap-1.5 px-4 py-2 bg-neon-green/10 text-neon-green rounded-lg text-sm hover:bg-neon-green/20 transition-all"
                            >
                              <Save className="w-4 h-4" />
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Display Mode */
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-white font-medium">
                                {s.startTime} a {s.endTime}
                              </p>
                              {s.turnType && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full border"
                                  style={{
                                    color: s.turnType.color || "#888",
                                    borderColor: `${s.turnType.color || "#888"}33`,
                                    backgroundColor: `${s.turnType.color || "#888"}15`,
                                  }}
                                >
                                  {s.turnType.name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-muted">
                                <Users className="w-3 h-3 inline mr-1" />
                                {confirmedCount}/{s.maxPilots} pilotos
                              </span>
                              <span className="text-sm text-neon-green font-semibold">
                                ${s.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-3 py-1 rounded-full ${sessionStatusColors[s.status] || "text-muted bg-white/5"}`}>
                              {s.status}
                            </span>
                            {s.status !== "CANCELLED" && s.status !== "COMPLETED" && (
                              <>
                                <button
                                  onClick={() => startEdit(s)}
                                  className="p-1.5 rounded-lg border border-white/10 text-muted hover:text-white transition-all"
                                  title="Editar"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => cancelSession(s.id)}
                                  className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all"
                                  title="Cancelar sesión"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {!hasConfirmedBookings && (
                              <button
                                onClick={() => deleteSession(s.id)}
                                className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => fetchWhatsAppNotifications(s.id)}
                              className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                              title="WhatsApp pilotos"
                            >
                              <MessageCircle className="w-4 h-4" />
                              {showWaFor === s.id ? (
                                <ChevronUp className="w-3 h-3 inline ml-0.5" />
                              ) : (
                                <ChevronDown className="w-3 h-3 inline ml-0.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* WhatsApp Notifications Dropdown */}
                      <AnimatePresence>
                        {showWaFor === s.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-4 rounded-lg bg-black/50 border border-green-500/20 overflow-hidden"
                          >
                            <p className="text-sm text-green-400 font-medium mb-2">
                              Pilotos confirmados con WhatsApp:
                            </p>
                            {(waNotifications[s.id] || []).length === 0 ? (
                              <p className="text-sm text-muted">
                                No hay pilotos con teléfono en esta sesión.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {(waNotifications[s.id] || []).map((n, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between"
                                  >
                                    <div>
                                      <p className="text-white text-sm">{n.pilotName}</p>
                                      <p className="text-xs text-muted">{n.pilotPhone}</p>
                                    </div>
                                    <a
                                      href={n.waLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20 transition-all"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      Enviar
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
