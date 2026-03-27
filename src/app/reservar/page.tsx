"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, ChevronLeft, CheckCircle, Zap, Loader2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

/* ── Cyberpunk colors ── */
const PINK = "#FF2D78";
const BLUE = "#00B4D8";
const PURPLE = "#7B2FBE";
const DARK = "#050510";

const inputClass = "w-full px-4 py-3 bg-[#0A0A1A] border border-[#FF2D78]/20 text-white placeholder-white/20 focus:border-[#FF2D78]/60 focus:outline-none focus:shadow-[0_0_15px_rgba(255,45,120,0.15)] transition-all font-mono text-sm";

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPilots: number;
  price: number;
  occupiedSpots: number;
}

export default function ReservarPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const fetchSessions = useCallback(async () => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await fetch(`/api/sessions?date=${dateStr}`);
      if (res.ok) setSessions(await res.json());
    } catch {
      console.error("Error fetching sessions");
    }
  }, [selectedDate]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const availableSpots = selectedSession ? selectedSession.maxPilots - selectedSession.occupiedSpots : 0;

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sessionId: selectedSession.id, participants }),
      });
      const data = await res.json();
      if (res.ok) { setBooked(true); toast.success("¡Reserva confirmada!"); }
      else toast.error(data.error || "Error al reservar");
    } catch { toast.error("Error de conexión"); }
    finally { setLoading(false); }
  };

  const formatDate = (date: Date) => {
    const days = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    return { day: days[date.getDay()], num: date.getDate(), month: months[date.getMonth()] };
  };

  /* ── Booked confirmation ── */
  if (booked) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{ background: DARK }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6" style={{ border: `2px solid ${PINK}`, clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)" }}>
            <CheckCircle className="w-10 h-10" style={{ color: PINK }} />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-wider font-mono">Reserva Confirmada</h1>
          <p className="text-gray-400 mb-2 font-mono text-sm">
            Tu turno para <span className="font-bold" style={{ color: PINK }}>{participants} {participants === 1 ? "persona" : "personas"}</span> el{" "}
            <span className="text-white font-semibold">
              {selectedSession && new Date(selectedSession.date).toLocaleDateString("es-AR")}
            </span>{" "}
            a las <span className="font-semibold" style={{ color: BLUE }}>{selectedSession?.startTime}hs</span> fue confirmado.
          </p>
          <p className="text-gray-500 text-sm mb-2 font-mono">
            Total: <span className="text-white font-bold">${selectedSession ? (selectedSession.price * participants).toLocaleString() : 0}</span>
          </p>
          <p className="text-gray-600 text-xs mb-8 font-mono">// Te enviamos un email con los detalles</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="px-6 py-3 border text-white text-sm uppercase tracking-wider font-mono hover:bg-white/5 transition-all" style={{ borderColor: `${BLUE}40`, clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}>
              Volver
            </Link>
            <button
              onClick={() => { setBooked(false); setStep(1); setSelectedSession(null); setParticipants(1); }}
              className="px-6 py-3 text-black font-bold text-sm uppercase tracking-wider font-mono transition-all"
              style={{ background: `linear-gradient(90deg, ${PINK}, ${BLUE})`, clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}
            >
              Nueva Reserva
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: DARK }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div
            className="inline-flex items-center gap-3 px-5 py-2 mb-6"
            style={{ border: `1px solid ${BLUE}40`, background: `${BLUE}08`, clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)" }}
          >
            <Zap className="w-4 h-4" style={{ color: BLUE }} />
            <span className="text-xs uppercase tracking-[0.25em] font-bold font-mono" style={{ color: BLUE }}>Reserva Online</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 uppercase tracking-wider">
            Reserva Tu{" "}
            <span style={{ background: `linear-gradient(90deg, ${PINK}, ${BLUE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Turno
            </span>
          </h1>
          <p className="text-gray-500 text-sm font-mono">{">"} Elegí fecha, horario, cantidad de personas y completá tus datos.</p>
        </motion.div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[
            { n: 1, label: "FECHA", color: PINK },
            { n: 2, label: "HORARIO", color: BLUE },
            { n: 3, label: "DATOS", color: PURPLE },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <div
                className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono transition-all"
                style={{
                  background: step >= s.n ? s.color : "transparent",
                  border: `1px solid ${step >= s.n ? s.color : "rgba(255,255,255,0.1)"}`,
                  color: step >= s.n ? "#000" : "rgba(255,255,255,0.3)",
                  clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)",
                }}
              >
                {s.n}
              </div>
              <span className={`text-xs hidden sm:inline font-mono uppercase tracking-wider ${step >= s.n ? "text-white" : "text-gray-600"}`}>
                {s.label}
              </span>
              {s.n < 3 && <div className="w-8 h-px" style={{ background: step > s.n ? s.color : "rgba(255,255,255,0.1)" }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Date */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
              <Calendar className="w-5 h-5" style={{ color: PINK }} /> Elegí una Fecha
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date) => {
                const f = formatDate(date);
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => { setSelectedDate(date); setStep(2); }}
                    className="p-3 text-center transition-all hover:scale-105"
                    style={{
                      background: isSelected ? `${PINK}15` : "#0A0A1A",
                      border: `1px solid ${isSelected ? PINK : "rgba(255,255,255,0.05)"}`,
                      clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)",
                    }}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: isSelected ? PINK : "rgba(255,255,255,0.3)" }}>{f.day}</div>
                    <div className={`text-lg font-black font-mono ${isSelected ? "text-white" : "text-gray-400"}`}>{f.num}</div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: isSelected ? BLUE : "rgba(255,255,255,0.3)" }}>{f.month}</div>
                    {isToday && <div className="w-1.5 h-1.5 mx-auto mt-1" style={{ background: PINK }} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Session */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                <Clock className="w-5 h-5" style={{ color: BLUE }} /> Elegí un Horario
              </h2>
              <button onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 font-mono uppercase tracking-wider">
                <ChevronLeft className="w-4 h-4" /> Cambiar
              </button>
            </div>
            <p className="text-gray-500 text-sm font-mono">
              {">"} Turnos para el{" "}
              <span className="font-semibold" style={{ color: PINK }}>
                {selectedDate.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </p>

            {sessions.length === 0 ? (
              <div className="text-center py-16" style={{ background: "#0A0A1A", border: `1px solid ${BLUE}20` }}>
                <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: `${BLUE}40` }} />
                <p className="text-gray-500 text-sm font-mono">// No hay turnos disponibles para esta fecha</p>
                <button onClick={() => setStep(1)} className="mt-6 px-6 py-2 border text-white text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-all"
                  style={{ borderColor: `${PINK}40`, clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }}>
                  Ver otras fechas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sessions.map((session, i) => {
                  const spots = session.maxPilots - session.occupiedSpots;
                  const accent = [PINK, BLUE, PURPLE][i % 3];
                  return (
                    <button
                      key={session.id}
                      onClick={() => { setSelectedSession(session); setParticipants(1); setStep(3); }}
                      className="p-6 text-left group transition-all hover:scale-[1.02]"
                      style={{ background: "#0A0A1A", border: `1px solid ${accent}20`, clipPath: "polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)" }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-black font-mono text-white group-hover:text-[color:var(--accent)] transition-colors" style={{ "--accent": accent } as React.CSSProperties}>{session.startTime}</span>
                        <span className="text-xs text-gray-600 font-mono">hasta {session.endTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                          <Users className="w-3 h-3" /> {spots} lugares
                        </div>
                        <span className="font-bold font-mono text-sm" style={{ color: accent }}>${session.price.toLocaleString()}/pers.</span>
                      </div>
                      <div className="mt-3 h-1 bg-white/5 overflow-hidden">
                        <div className="h-full transition-all" style={{ width: `${(session.occupiedSpots / session.maxPilots) * 100}%`, background: `linear-gradient(90deg, ${PINK}, ${BLUE})` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Form */}
        {step === 3 && selectedSession && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                <Users className="w-5 h-5" style={{ color: PURPLE }} /> Tus Datos
              </h2>
              <button onClick={() => setStep(2)} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 font-mono uppercase tracking-wider">
                <ChevronLeft className="w-4 h-4" /> Cambiar
              </button>
            </div>

            {/* Session summary */}
            <div className="p-6 space-y-4" style={{ background: "#0A0A1A", border: `1px solid ${PINK}20`, clipPath: "polygon(16px 0, 100% 0, calc(100% - 16px) 100%, 0 100%)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">Tu turno</p>
                  <p className="text-white font-bold font-mono">
                    {new Date(selectedSession.date).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                    {" "}&mdash; {selectedSession.startTime} a {selectedSession.endTime}hs
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">Precio/pers</p>
                  <p className="font-black text-xl font-mono" style={{ color: PINK }}>${selectedSession.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Participants */}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${PINK}15` }}>
                <div>
                  <p className="text-white font-semibold font-mono text-sm uppercase tracking-wider">¿Cuántos son?</p>
                  <p className="text-[10px] text-gray-600 font-mono">{availableSpots} lugares disponibles</p>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setParticipants(Math.max(1, participants - 1))} disabled={participants <= 1}
                    className="w-10 h-10 flex items-center justify-center text-white transition-all disabled:opacity-20"
                    style={{ background: `${BLUE}15`, border: `1px solid ${BLUE}30`, clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" }}>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-3xl font-black text-white w-12 text-center font-mono">{participants}</span>
                  <button type="button" onClick={() => setParticipants(Math.min(availableSpots, participants + 1))} disabled={participants >= availableSpots}
                    className="w-10 h-10 flex items-center justify-center text-white transition-all disabled:opacity-20"
                    style={{ background: `${PINK}15`, border: `1px solid ${PINK}30`, clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${PINK}15` }}>
                <p className="text-white font-semibold font-mono uppercase tracking-wider text-sm">Total</p>
                <p className="font-black text-2xl font-mono" style={{ color: BLUE }}>
                  ${(selectedSession.price * participants).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleBook} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider mb-2 font-mono" style={{ color: PINK }}>Nombre completo *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass} placeholder="Tu nombre completo"
                    style={{ clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider mb-2 font-mono" style={{ color: PINK }}>Email *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass} placeholder="tu@email.com"
                    style={{ clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider mb-2 font-mono" style={{ color: BLUE }}>Teléfono</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass} placeholder="+54 XXX XXX-XXXX"
                  style={{ clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider mb-2 font-mono" style={{ color: BLUE }}>Notas (opcional)</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                  className={`${inputClass} resize-none`} placeholder="¿Algo que debamos saber?"
                  style={{ clipPath: "polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)" }} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 text-black font-black text-sm uppercase tracking-[0.2em] font-mono transition-all disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(255,45,120,0.3)]"
                style={{ background: `linear-gradient(90deg, ${PINK}, ${BLUE})`, clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>[ Confirmar Reserva &mdash; {participants} {participants === 1 ? "persona" : "personas"} ]</>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
