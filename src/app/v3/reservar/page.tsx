"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxPilots: number;
  price: number;
  occupiedSpots: number;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#F5D061";
const PLATINUM = "#E5E4E2";
const CARBON = "#0D0D0D";
const CARBON_LIGHT = "#141414";
const WARM_WHITE = "#FAFAF5";

const STEP_LABELS = ["Fecha", "Sesi\u00f3n", "Reserva"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildNext14Days(): Date[] {
  const days: Date[] = [];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayName(d: Date): string {
  return d.toLocaleDateString("es-ES", { weekday: "short" }).toUpperCase();
}

function monthName(d: Date): string {
  return d.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
}

function isToday(d: Date): boolean {
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-6 sm:gap-10 mb-12 sm:mb-16">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex flex-col items-center gap-2">
            <div
              className="w-9 h-9 flex items-center justify-center transition-all duration-700"
              style={{
                border: `1px solid ${active || done ? GOLD : `${GOLD}33`}`,
                backgroundColor: done ? GOLD : active ? `${GOLD}15` : "transparent",
              }}
            >
              {done ? (
                <CheckCircle size={16} color={CARBON} strokeWidth={1.5} />
              ) : (
                <span
                  className="font-mono text-xs"
                  style={{ color: active ? GOLD : `${PLATINUM}55` }}
                >
                  {i + 1}
                </span>
              )}
            </div>
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: active || done ? GOLD : `${PLATINUM}44` }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] uppercase tracking-[0.3em] mb-3"
      style={{ color: GOLD }}
    >
      {children}
    </p>
  );
}

function GoldDivider() {
  return (
    <div className="w-full h-px my-8" style={{ backgroundColor: `${GOLD}22` }} />
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ReservarPage() {
  const [step, setStep] = useState(0);

  // Step 1 - date
  const [dates] = useState<Date[]>(buildNext14Days);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Step 2 - session
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Step 3 - booking
  const [participants, setParticipants] = useState(1);
  const [form, setForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // -----------------------------------------------------------------------
  // Fetch sessions when date changes
  // -----------------------------------------------------------------------

  const fetchSessions = useCallback(async (date: Date) => {
    setLoadingSessions(true);
    setSessions([]);
    setSelectedSession(null);
    try {
      const res = await fetch(`/api/sessions?date=${formatISODate(date)}`);
      if (!res.ok) throw new Error("Error al obtener sesiones");
      const data: Session[] = await res.json();
      setSessions(data);
    } catch {
      toast.error("No se pudieron cargar las sesiones disponibles");
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) fetchSessions(selectedDate);
  }, [selectedDate, fetchSessions]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  function handleSelectDate(d: Date) {
    setSelectedDate(d);
    setStep(1);
  }

  function handleSelectSession(s: Session) {
    if (s.occupiedSpots >= s.maxPilots) return;
    setSelectedSession(s);
    setParticipants(1);
    setStep(2);
  }

  function handleBack() {
    if (step === 1) {
      setStep(0);
      setSelectedSession(null);
    } else if (step === 2) {
      setStep(1);
    }
  }

  function handleFormChange(field: keyof BookingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSession) return;
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          sessionId: selectedSession.id,
          participants,
          notes: form.notes.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al crear la reserva");
      }

      setBookingComplete(true);
      toast.success("Reserva confirmada");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error inesperado";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  // -----------------------------------------------------------------------
  // Success Screen
  // -----------------------------------------------------------------------

  if (bookingComplete) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-24"
        style={{ backgroundColor: CARBON }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div
            className="w-20 h-20 flex items-center justify-center mb-8"
            style={{ border: `1px solid ${GOLD}` }}
          >
            <CheckCircle size={36} color={GOLD} strokeWidth={1} />
          </div>

          <SectionLabel>Confirmaci&oacute;n</SectionLabel>
          <h1
            className="font-serif text-3xl sm:text-4xl font-light mb-4"
            style={{ color: WARM_WHITE }}
          >
            Reserva Confirmada
          </h1>
          <p className="text-sm leading-relaxed mb-2" style={{ color: `${PLATINUM}99` }}>
            Tu experiencia premium ha sido registrada exitosamente.
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ color: `${PLATINUM}66` }}>
            Recibir&aacute;s un correo de confirmaci&oacute;n con todos los detalles en{" "}
            <span style={{ color: GOLD }}>{form.email}</span>.
          </p>

          {selectedSession && (
            <div
              className="w-full p-6 mb-10 text-left"
              style={{ border: `1px solid ${GOLD}33`, backgroundColor: `${GOLD}08` }}
            >
              <SectionLabel>Resumen</SectionLabel>
              <div className="space-y-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wider" style={{ color: `${PLATINUM}66` }}>
                    Fecha
                  </span>
                  <span className="font-mono text-sm" style={{ color: WARM_WHITE }}>
                    {selectedSession.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wider" style={{ color: `${PLATINUM}66` }}>
                    Horario
                  </span>
                  <span className="font-mono text-sm" style={{ color: WARM_WHITE }}>
                    {selectedSession.startTime} &ndash; {selectedSession.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wider" style={{ color: `${PLATINUM}66` }}>
                    Pilotos
                  </span>
                  <span className="font-mono text-sm" style={{ color: WARM_WHITE }}>
                    {participants}
                  </span>
                </div>
                <div
                  className="h-px w-full my-2"
                  style={{ backgroundColor: `${GOLD}22` }}
                />
                <div className="flex justify-between">
                  <span className="text-xs uppercase tracking-wider" style={{ color: `${PLATINUM}66` }}>
                    Total
                  </span>
                  <span className="font-mono text-lg font-semibold" style={{ color: GOLD }}>
                    ${(selectedSession.price * participants).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <Link
            href="/v3"
            className="inline-block px-10 py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-700 hover:opacity-80"
            style={{
              backgroundColor: GOLD,
              color: CARBON,
            }}
          >
            Volver al Inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Main Render
  // -----------------------------------------------------------------------

  return (
    <div className="min-h-screen pt-24" style={{ backgroundColor: CARBON }}>
      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 sm:px-10 pt-6 sm:pt-10 pb-20">
        <StepIndicator current={step} />

        <AnimatePresence mode="wait">
          {/* ============================================================ */}
          {/* STEP 0 - DATE SELECTION                                      */}
          {/* ============================================================ */}
          {step === 0 && (
            <motion.div
              key="step-date"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="text-center mb-10">
                <SectionLabel>Paso 1 de 3</SectionLabel>
                <h2
                  className="font-serif text-3xl sm:text-4xl font-light"
                  style={{ color: WARM_WHITE }}
                >
                  Selecciona una Fecha
                </h2>
                <p
                  className="mt-3 text-sm"
                  style={{ color: `${PLATINUM}66` }}
                >
                  Elige el d&iacute;a para tu experiencia de pilotaje
                </p>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <Calendar size={14} color={GOLD} strokeWidth={1.5} />
                <span
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: GOLD }}
                >
                  Pr&oacute;ximos 14 d&iacute;as
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                {dates.map((d) => {
                  const selected =
                    selectedDate && formatISODate(d) === formatISODate(selectedDate);
                  const today = isToday(d);
                  return (
                    <motion.button
                      key={formatISODate(d)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => handleSelectDate(d)}
                      className="flex flex-col items-center py-4 px-2 transition-all duration-700 cursor-pointer"
                      style={{
                        border: `1px solid ${selected ? GOLD : `${GOLD}22`}`,
                        backgroundColor: selected ? `${GOLD}12` : "transparent",
                      }}
                    >
                      <span
                        className="text-[9px] uppercase tracking-[0.2em] mb-1"
                        style={{ color: today ? GOLD_LIGHT : `${PLATINUM}55` }}
                      >
                        {dayName(d)}
                      </span>
                      <span
                        className="font-serif text-2xl font-light"
                        style={{ color: selected ? GOLD : WARM_WHITE }}
                      >
                        {d.getDate()}
                      </span>
                      <span
                        className="text-[9px] uppercase tracking-[0.15em] mt-1"
                        style={{ color: `${PLATINUM}44` }}
                      >
                        {monthName(d)}
                      </span>
                      {today && (
                        <span
                          className="text-[8px] uppercase tracking-[0.2em] mt-2"
                          style={{ color: GOLD }}
                        >
                          Hoy
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP 1 - SESSION SELECTION                                   */}
          {/* ============================================================ */}
          {step === 1 && (
            <motion.div
              key="step-session"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="text-center mb-10">
                <SectionLabel>Paso 2 de 3</SectionLabel>
                <h2
                  className="font-serif text-3xl sm:text-4xl font-light"
                  style={{ color: WARM_WHITE }}
                >
                  Elige tu Sesi&oacute;n
                </h2>
                {selectedDate && (
                  <p className="mt-3 text-sm" style={{ color: `${PLATINUM}66` }}>
                    Sesiones disponibles para el{" "}
                    <span style={{ color: GOLD }}>
                      {selectedDate.toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </p>
                )}
              </div>

              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 mb-8 text-xs uppercase tracking-[0.2em] transition-colors duration-500 hover:opacity-70 cursor-pointer"
                style={{ color: `${PLATINUM}66` }}
              >
                <ChevronLeft size={14} strokeWidth={1.5} />
                Cambiar fecha
              </button>

              {loadingSessions ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2
                    size={28}
                    color={GOLD}
                    strokeWidth={1}
                    className="animate-spin"
                  />
                  <span
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{ color: `${PLATINUM}55` }}
                  >
                    Cargando sesiones
                  </span>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-sm" style={{ color: `${PLATINUM}55` }}>
                    No hay sesiones disponibles para esta fecha.
                  </p>
                  <button
                    onClick={handleBack}
                    className="mt-6 px-8 py-3 text-xs uppercase tracking-[0.25em] transition-all duration-700 hover:opacity-80 cursor-pointer"
                    style={{ border: `1px solid ${GOLD}`, color: GOLD }}
                  >
                    Elegir otra fecha
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((s) => {
                    const available = s.maxPilots - s.occupiedSpots;
                    const full = available <= 0;
                    const selected = selectedSession?.id === s.id;

                    return (
                      <motion.button
                        key={s.id}
                        whileHover={!full ? { scale: 1.01 } : undefined}
                        whileTap={!full ? { scale: 0.99 } : undefined}
                        transition={{ duration: 0.4 }}
                        onClick={() => handleSelectSession(s)}
                        disabled={full}
                        className="w-full text-left p-5 sm:p-6 transition-all duration-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                        style={{
                          border: `1px solid ${selected ? GOLD : `${GOLD}22`}`,
                          backgroundColor: selected ? `${GOLD}08` : "transparent",
                          boxShadow: selected
                            ? `0 0 30px ${GOLD}10`
                            : "none",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="flex items-center gap-2">
                              <Clock
                                size={14}
                                color={full ? `${PLATINUM}44` : GOLD}
                                strokeWidth={1.5}
                              />
                              <span
                                className="font-mono text-base sm:text-lg"
                                style={{
                                  color: full ? `${PLATINUM}44` : WARM_WHITE,
                                }}
                              >
                                {s.startTime} &ndash; {s.endTime}
                              </span>
                            </div>

                            <div className="hidden sm:flex items-center gap-2">
                              <Users
                                size={13}
                                color={`${PLATINUM}55`}
                                strokeWidth={1.5}
                              />
                              <span
                                className="text-xs"
                                style={{
                                  color: full ? `${PLATINUM}33` : `${PLATINUM}66`,
                                }}
                              >
                                {full
                                  ? "Completa"
                                  : `${available} ${available === 1 ? "lugar" : "lugares"} disponible${available === 1 ? "" : "s"}`}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className="font-mono text-lg sm:text-xl"
                              style={{ color: full ? `${PLATINUM}44` : GOLD }}
                            >
                              ${s.price.toLocaleString()}
                            </span>
                            <span
                              className="block text-[9px] uppercase tracking-[0.2em] mt-0.5"
                              style={{ color: `${PLATINUM}44` }}
                            >
                              por piloto
                            </span>
                          </div>
                        </div>

                        {/* Capacity bar */}
                        <div className="mt-4 sm:hidden flex items-center gap-2">
                          <Users
                            size={12}
                            color={`${PLATINUM}44`}
                            strokeWidth={1.5}
                          />
                          <span
                            className="text-[10px]"
                            style={{ color: `${PLATINUM}55` }}
                          >
                            {full
                              ? "Completa"
                              : `${available} lugar${available === 1 ? "" : "es"}`}
                          </span>
                        </div>

                        <div className="mt-3 h-px w-full relative overflow-hidden">
                          <div
                            className="absolute inset-0"
                            style={{ backgroundColor: `${GOLD}15` }}
                          />
                          <motion.div
                            className="absolute left-0 top-0 h-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(s.occupiedSpots / s.maxPilots) * 100}%`,
                            }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            style={{
                              backgroundColor: full ? `${PLATINUM}33` : GOLD,
                            }}
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* STEP 2 - BOOKING FORM                                        */}
          {/* ============================================================ */}
          {step === 2 && selectedSession && (
            <motion.div
              key="step-booking"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="text-center mb-10">
                <SectionLabel>Paso 3 de 3</SectionLabel>
                <h2
                  className="font-serif text-3xl sm:text-4xl font-light"
                  style={{ color: WARM_WHITE }}
                >
                  Completa tu Reserva
                </h2>
                <p
                  className="mt-3 text-sm"
                  style={{ color: `${PLATINUM}66` }}
                >
                  Ingresa tus datos para confirmar la experiencia
                </p>
              </div>

              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 mb-8 text-xs uppercase tracking-[0.2em] transition-colors duration-500 hover:opacity-70 cursor-pointer"
                style={{ color: `${PLATINUM}66` }}
              >
                <ChevronLeft size={14} strokeWidth={1.5} />
                Cambiar sesi&oacute;n
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* ----- Form Column ----- */}
                <form
                  onSubmit={handleSubmit}
                  className="lg:col-span-3 space-y-8"
                >
                  {/* Participants */}
                  <div>
                    <SectionLabel>N&uacute;mero de Pilotos</SectionLabel>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          setParticipants((p) => Math.max(1, p - 1))
                        }
                        className="w-10 h-10 flex items-center justify-center transition-all duration-500 hover:opacity-70 cursor-pointer"
                        style={{ border: `1px solid ${GOLD}44`, color: GOLD }}
                      >
                        <Minus size={14} strokeWidth={1.5} />
                      </button>
                      <span
                        className="font-mono text-2xl w-10 text-center"
                        style={{ color: WARM_WHITE }}
                      >
                        {participants}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setParticipants((p) =>
                            Math.min(
                              selectedSession.maxPilots -
                                selectedSession.occupiedSpots,
                              p + 1
                            )
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center transition-all duration-500 hover:opacity-70 cursor-pointer"
                        style={{ border: `1px solid ${GOLD}44`, color: GOLD }}
                      >
                        <Plus size={14} strokeWidth={1.5} />
                      </button>
                      <span
                        className="text-xs ml-2"
                        style={{ color: `${PLATINUM}55` }}
                      >
                        M&aacute;x.{" "}
                        {selectedSession.maxPilots -
                          selectedSession.occupiedSpots}
                      </span>
                    </div>
                  </div>

                  <GoldDivider />

                  {/* Name */}
                  <div>
                    <label
                      className="block text-[10px] uppercase tracking-[0.3em] mb-3"
                      style={{ color: GOLD }}
                    >
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full py-3 bg-transparent outline-none text-sm transition-all duration-500 placeholder:opacity-30"
                      style={{
                        color: WARM_WHITE,
                        borderBottom: `1px solid ${GOLD}4D`,
                        caretColor: GOLD,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderBottom = `1px solid ${GOLD}`)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderBottom = `1px solid ${GOLD}4D`)
                      }
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-[10px] uppercase tracking-[0.3em] mb-3"
                      style={{ color: GOLD }}
                    >
                      Correo Electr&oacute;nico *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        handleFormChange("email", e.target.value)
                      }
                      placeholder="tu@email.com"
                      className="w-full py-3 bg-transparent outline-none text-sm transition-all duration-500 placeholder:opacity-30"
                      style={{
                        color: WARM_WHITE,
                        borderBottom: `1px solid ${GOLD}4D`,
                        caretColor: GOLD,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderBottom = `1px solid ${GOLD}`)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderBottom = `1px solid ${GOLD}4D`)
                      }
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block text-[10px] uppercase tracking-[0.3em] mb-3"
                      style={{ color: GOLD }}
                    >
                      Tel&eacute;fono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        handleFormChange("phone", e.target.value)
                      }
                      placeholder="+54 9 11 0000-0000"
                      className="w-full py-3 bg-transparent outline-none text-sm transition-all duration-500 placeholder:opacity-30"
                      style={{
                        color: WARM_WHITE,
                        borderBottom: `1px solid ${GOLD}4D`,
                        caretColor: GOLD,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderBottom = `1px solid ${GOLD}`)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderBottom = `1px solid ${GOLD}4D`)
                      }
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      className="block text-[10px] uppercase tracking-[0.3em] mb-3"
                      style={{ color: GOLD }}
                    >
                      Notas Adicionales
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        handleFormChange("notes", e.target.value)
                      }
                      placeholder="Requisitos especiales, celebraciones, etc."
                      rows={3}
                      className="w-full py-3 bg-transparent outline-none text-sm transition-all duration-500 resize-none placeholder:opacity-30"
                      style={{
                        color: WARM_WHITE,
                        borderBottom: `1px solid ${GOLD}4D`,
                        caretColor: GOLD,
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderBottom = `1px solid ${GOLD}`)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderBottom = `1px solid ${GOLD}4D`)
                      }
                    />
                  </div>

                  <GoldDivider />

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="w-full py-4 text-xs uppercase tracking-[0.25em] font-medium transition-all duration-700 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3"
                    style={{
                      backgroundColor: GOLD,
                      color: CARBON,
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Procesando
                      </>
                    ) : (
                      <>
                        Confirmar Reserva &mdash; $
                        {(
                          selectedSession.price * participants
                        ).toLocaleString()}
                      </>
                    )}
                  </motion.button>
                </form>

                {/* ----- Summary Column ----- */}
                <div className="lg:col-span-2">
                  <div
                    className="p-6 sticky top-8"
                    style={{
                      border: `1px solid ${GOLD}33`,
                      backgroundColor: `${GOLD}05`,
                    }}
                  >
                    <SectionLabel>Resumen de Reserva</SectionLabel>

                    <div className="space-y-5 mt-5">
                      <div className="flex items-start gap-3">
                        <Calendar
                          size={14}
                          color={GOLD}
                          strokeWidth={1.5}
                          className="mt-0.5 shrink-0"
                        />
                        <div>
                          <span
                            className="text-[10px] uppercase tracking-[0.2em] block"
                            style={{ color: `${PLATINUM}55` }}
                          >
                            Fecha
                          </span>
                          <span
                            className="text-sm mt-0.5 block"
                            style={{ color: WARM_WHITE }}
                          >
                            {selectedDate?.toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock
                          size={14}
                          color={GOLD}
                          strokeWidth={1.5}
                          className="mt-0.5 shrink-0"
                        />
                        <div>
                          <span
                            className="text-[10px] uppercase tracking-[0.2em] block"
                            style={{ color: `${PLATINUM}55` }}
                          >
                            Horario
                          </span>
                          <span
                            className="font-mono text-sm mt-0.5 block"
                            style={{ color: WARM_WHITE }}
                          >
                            {selectedSession.startTime} &ndash;{" "}
                            {selectedSession.endTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Users
                          size={14}
                          color={GOLD}
                          strokeWidth={1.5}
                          className="mt-0.5 shrink-0"
                        />
                        <div>
                          <span
                            className="text-[10px] uppercase tracking-[0.2em] block"
                            style={{ color: `${PLATINUM}55` }}
                          >
                            Pilotos
                          </span>
                          <span
                            className="font-mono text-sm mt-0.5 block"
                            style={{ color: WARM_WHITE }}
                          >
                            {participants}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="h-px w-full my-5"
                      style={{ backgroundColor: `${GOLD}22` }}
                    />

                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] uppercase tracking-[0.2em]"
                        style={{ color: `${PLATINUM}55` }}
                      >
                        Precio unitario
                      </span>
                      <span
                        className="font-mono text-sm"
                        style={{ color: `${PLATINUM}88` }}
                      >
                        ${selectedSession.price.toLocaleString()}
                      </span>
                    </div>

                    {participants > 1 && (
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className="text-[10px] uppercase tracking-[0.2em]"
                          style={{ color: `${PLATINUM}55` }}
                        >
                          &times; {participants} pilotos
                        </span>
                      </div>
                    )}

                    <div
                      className="h-px w-full my-5"
                      style={{ backgroundColor: `${GOLD}22` }}
                    />

                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs uppercase tracking-[0.2em]"
                        style={{ color: WARM_WHITE }}
                      >
                        Total
                      </span>
                      <span
                        className="font-mono text-2xl font-light"
                        style={{ color: GOLD }}
                      >
                        $
                        {(
                          selectedSession.price * participants
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Subtle footer line */}
      <div
        className="w-full h-px"
        style={{ backgroundColor: `${GOLD}10` }}
      />
    </div>
  );
}
