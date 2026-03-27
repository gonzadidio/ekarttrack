"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  CheckCircle,
  Zap,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPilots: number;
  price: number;
  occupiedSpots: number;
}

const steps = [
  { label: "Fecha", icon: Calendar },
  { label: "Horario", icon: Clock },
  { label: "Datos", icon: Users },
];

function getNext14Days(): { date: string; label: string; dayName: string; dayNum: number; monthLabel: string }[] {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    days.push({
      date: `${yyyy}-${mm}-${dd}`,
      label: i === 0 ? "Hoy" : i === 1 ? "Mañana" : dayNames[d.getDay()],
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      monthLabel: monthNames[d.getMonth()],
    });
  }
  return days;
}

export default function ReservarPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [participants, setParticipants] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<Record<string, unknown> | null>(null);

  const days = getNext14Days();

  const fetchSessions = useCallback(async (date: string) => {
    setLoadingSessions(true);
    try {
      const res = await fetch(`/api/sessions?date=${date}`);
      if (!res.ok) throw new Error("Error al cargar sesiones");
      const data = await res.json();
      setSessions(data);
    } catch {
      toast.error("No se pudieron cargar las sesiones");
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSessions(selectedDate);
    }
  }, [selectedDate, fetchSessions]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSession(null);
    setParticipants(1);
    setStep(2);
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    setParticipants(1);
    setStep(3);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedDate("");
      setSessions([]);
    } else if (step === 3) {
      setStep(2);
      setSelectedSession(null);
    }
  };

  const availableSpots = selectedSession
    ? selectedSession.maxPilots - selectedSession.occupiedSpots
    : 0;

  const totalPrice = selectedSession ? selectedSession.price * participants : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          sessionId: selectedSession.id,
          participants,
        }),
      });
      if (!res.ok) throw new Error("Error al crear la reserva");
      const data = await res.json();
      setBookingDetails(data);
      setConfirmed(true);
      toast.success("Reserva confirmada!");
    } catch {
      toast.error("Error al procesar la reserva. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    setStep(1);
    setSelectedDate("");
    setSessions([]);
    setSelectedSession(null);
    setParticipants(1);
    setForm({ name: "", email: "", phone: "", notes: "" });
    setConfirmed(false);
    setBookingDetails(null);
  };

  // --- Success Screen ---
  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg text-center"
        >
          <div className="bg-card-bg border border-card-border rounded-xl p-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neon-green/10">
              <CheckCircle className="h-10 w-10 text-neon-green" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Reserva Confirmada
            </h1>
            <p className="text-muted mb-8">
              Tu reserva ha sido registrada exitosamente
            </p>

            <div className="bg-neon-green/5 border border-neon-green/20 rounded-xl p-5 text-left mb-8 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted text-sm">Fecha</span>
                <span className="text-white text-sm font-medium">{selectedDate}</span>
              </div>
              <div className="border-t border-neon-green/10" />
              <div className="flex justify-between">
                <span className="text-muted text-sm">Horario</span>
                <span className="text-white text-sm font-medium">
                  {selectedSession?.startTime} - {selectedSession?.endTime}
                </span>
              </div>
              <div className="border-t border-neon-green/10" />
              <div className="flex justify-between">
                <span className="text-muted text-sm">Participantes</span>
                <span className="text-white text-sm font-medium">{participants}</span>
              </div>
              <div className="border-t border-neon-green/10" />
              <div className="flex justify-between">
                <span className="text-muted text-sm">Total</span>
                <span className="text-neon-green text-sm font-bold">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-neon-green/10" />
              <div className="flex justify-between">
                <span className="text-muted text-sm">Nombre</span>
                <span className="text-white text-sm font-medium">{form.name}</span>
              </div>
              <div className="border-t border-neon-green/10" />
              <div className="flex justify-between">
                <span className="text-muted text-sm">Email</span>
                <span className="text-white text-sm font-medium">{form.email}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/v2"
                className="inline-flex items-center justify-center bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold rounded-full px-6 py-3 transition-transform hover:scale-[1.02]"
              >
                Volver al Inicio
              </Link>
              <button
                onClick={handleNewBooking}
                className="inline-flex items-center justify-center border border-card-border text-white font-medium rounded-full px-6 py-3 hover:border-neon-green/30 transition-colors"
              >
                Nueva Reserva
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- Main Booking Flow ---
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/v2"
            className="inline-flex items-center gap-1.5 text-muted hover:text-white transition-colors text-sm mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Link>
          <h1 className="text-3xl font-bold text-white mb-1">Reservar Sesión</h1>
          <p className="text-muted">Selecciona fecha, horario y completa tus datos</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {steps.map((s, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={s.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-neon-green to-neon-cyan text-black"
                        : isDone
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-white/5 text-muted"
                    }`}
                  >
                    {isDone ? <CheckCircle className="h-4 w-4" /> : stepNum}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      isActive ? "text-white" : isDone ? "text-neon-green" : "text-muted"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-px w-8 sm:w-12 ${
                      step > stepNum ? "bg-neon-green/40" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step 1: Date Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="h-5 w-5 text-neon-green" />
              <h2 className="text-lg font-semibold text-white">Selecciona una fecha</h2>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => handleDateSelect(day.date)}
                  className="group bg-card-bg border border-card-border rounded-xl p-4 text-center hover:border-neon-green/30 transition-all hover:bg-neon-green/5"
                >
                  <span className="block text-xs text-muted mb-1 group-hover:text-neon-cyan transition-colors">
                    {day.label}
                  </span>
                  <span className="block text-2xl font-bold text-white mb-0.5">
                    {day.dayNum}
                  </span>
                  <span className="block text-xs text-muted">{day.monthLabel}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Session Selection */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-neon-green" />
                <h2 className="text-lg font-semibold text-white">Selecciona un horario</h2>
              </div>
              <button
                onClick={handleBack}
                className="text-sm text-muted hover:text-white transition-colors"
              >
                Cambiar fecha
              </button>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-neon-green/20 bg-neon-green/5 px-4 py-1.5 text-sm text-neon-green mb-6">
              <Calendar className="h-3.5 w-3.5" />
              {selectedDate}
            </div>

            {loadingSessions ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 text-neon-green animate-spin mb-3" />
                <p className="text-muted text-sm">Cargando sesiones...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-20">
                <Clock className="h-10 w-10 text-muted mx-auto mb-3" />
                <p className="text-muted">No hay sesiones disponibles para esta fecha</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => {
                  const spots = session.maxPilots - session.occupiedSpots;
                  const occupancy = (session.occupiedSpots / session.maxPilots) * 100;
                  const isFull = spots <= 0;

                  return (
                    <button
                      key={session.id}
                      disabled={isFull}
                      onClick={() => handleSessionSelect(session)}
                      className={`w-full text-left bg-card-bg border border-card-border rounded-xl p-5 transition-all ${
                        isFull
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-neon-green/30 hover:bg-neon-green/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-green/10">
                            <Zap className="h-5 w-5 text-neon-green" />
                          </div>
                          <div>
                            <p className="text-white font-semibold">
                              {session.startTime} - {session.endTime}
                            </p>
                            <p className="text-muted text-xs mt-0.5">
                              {spots > 0
                                ? `${spots} lugar${spots !== 1 ? "es" : ""} disponible${spots !== 1 ? "s" : ""}`
                                : "Sesión completa"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-neon-green font-bold text-lg">
                            ${session.price.toLocaleString()}
                          </p>
                          <p className="text-muted text-xs">por persona</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isFull
                              ? "bg-red-500"
                              : "bg-gradient-to-r from-neon-green to-neon-cyan"
                          }`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Booking Form */}
        {step === 3 && selectedSession && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-neon-green" />
                <h2 className="text-lg font-semibold text-white">Completa tu reserva</h2>
              </div>
              <button
                onClick={handleBack}
                className="text-sm text-muted hover:text-white transition-colors"
              >
                Cambiar horario
              </button>
            </div>

            {/* Session Summary */}
            <div className="bg-neon-green/5 border border-neon-green/20 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-neon-cyan" />
                  <span className="text-white text-sm font-medium">{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-neon-cyan" />
                  <span className="text-white text-sm font-medium">
                    {selectedSession.startTime} - {selectedSession.endTime}
                  </span>
                </div>
              </div>
              <div className="border-t border-neon-green/10 my-3" />

              {/* Participants selector */}
              <div className="flex items-center justify-between">
                <span className="text-muted text-sm">Participantes</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setParticipants(Math.max(1, participants - 1))}
                    disabled={participants <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition-colors hover:border-neon-green/30 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-white font-bold text-lg w-6 text-center">
                    {participants}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setParticipants(Math.min(availableSpots, participants + 1))
                    }
                    disabled={participants >= availableSpots}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white transition-colors hover:border-neon-green/30 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="border-t border-neon-green/10 my-3" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-muted text-sm">Total</span>
                <span className="text-neon-green font-bold text-xl">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">
                  Nombre completo <span className="text-neon-green">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-white placeholder:text-muted/50 focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1.5">
                  Email <span className="text-neon-green">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-white placeholder:text-muted/50 focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1.5">Teléfono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+54 11 1234-5678"
                  className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-white placeholder:text-muted/50 focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1.5">Notas</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Algo que debamos saber..."
                  rows={3}
                  className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-white placeholder:text-muted/50 focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold rounded-full px-6 py-3.5 transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-6"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Confirmar Reserva
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
