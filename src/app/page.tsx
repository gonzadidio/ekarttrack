"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Zap, Timer, Trophy, Clock, Users, Shield, Leaf, Gauge, Battery, Wifi,
  Volume2, Check, Star, Medal, TrendingUp, Camera, Send, MapPin, Phone,
  Mail, ChevronDown, Sparkles, GraduationCap, PartyPopper,
} from "lucide-react";
import toast from "react-hot-toast";

/* ─────────────────────────── DATA ─────────────────────────── */

const experiences = [
  {
    icon: Clock,
    title: "TANDAS LIBRES",
    description: "Sali a la pista y disfruta de 10 minutos de adrenalina pura. Ideal para quienes quieren sentir la velocidad sin compromiso.",
    features: ["10 min de pista", "Casco incluido", "Briefing de seguridad"],
    accent: "#FF2D78",
  },
  {
    icon: Trophy,
    title: "CARRERAS GRUPALES",
    description: "Competi contra tus amigos en una carrera real con clasificacion, largada y podio. La experiencia definitiva de karting.",
    features: ["Hasta 10 pilotos", "Clasificacion + Carrera", "Podio y premiacion"],
    accent: "#00B4D8",
  },
  {
    icon: Users,
    title: "EVENTOS CORPORATIVOS",
    description: "Team building unico. Organiza un evento inolvidable para tu empresa con carreras, rankings y catering opcional.",
    features: ["Pista exclusiva", "Ranking en tiempo real", "Personalizacion total"],
    accent: "#7B2FBE",
  },
  {
    icon: PartyPopper,
    title: "CUMPLEANOS",
    description: "Celebra tu cumpleanos con una fiesta llena de velocidad. Paquetes especiales con todo incluido.",
    features: ["Salon privado", "Torta + bebidas", "2 tandas por invitado"],
    accent: "#FF2D78",
  },
  {
    icon: GraduationCap,
    title: "ESCUELA DE KARTING",
    description: "Aprende tecnicas de manejo profesional con nuestros instructores certificados. Para todas las edades.",
    features: ["Instructor personal", "Tecnicas avanzadas", "Certificado"],
    accent: "#00B4D8",
  },
  {
    icon: Sparkles,
    title: "EXPERIENCIA VIP",
    description: "El paquete premium: pista exclusiva, datos de telemetria, video onboard y champagne en el podio.",
    features: ["Pista exclusiva 30 min", "Telemetria completa", "Video onboard"],
    accent: "#7B2FBE",
  },
];

const trackFeatures = [
  { icon: Gauge, title: "ALTA VELOCIDAD", desc: "Kartings electricos que alcanzan hasta 80 km/h con aceleracion instantanea." },
  { icon: Shield, title: "MAXIMA SEGURIDAD", desc: "Barreras de proteccion, cascos certificados y briefing obligatorio." },
  { icon: Leaf, title: "100% ECOLOGICO", desc: "Cero emisiones de CO2. Energia 100% electrica." },
  { icon: Battery, title: "BATERIAS PREMIUM", desc: "Rendimiento constante durante toda la tanda." },
  { icon: Wifi, title: "TELEMETRIA EN VIVO", desc: "Sistema de cronometraje profesional con pantallas en tiempo real." },
  { icon: Volume2, title: "SIN RUIDO", desc: "Motores silenciosos que permiten correr en zonas urbanas." },
];

const plans = [
  {
    name: "TANDA LIBRE",
    price: "15.000",
    duration: "10 min",
    description: "La experiencia perfecta para una primera vez o una tanda rapida.",
    features: ["10 minutos de pista", "Casco y equipamiento", "Briefing de seguridad", "Tiempos por vuelta"],
    popular: false,
    accent: "#FF2D78",
  },
  {
    name: "CARRERA GRUPAL",
    price: "22.000",
    duration: "por piloto",
    description: "Clasificacion + carrera con largada real. La experiencia completa.",
    features: ["Clasificacion 5 min", "Carrera 10 min", "Podio y premiacion", "Ranking en pantalla", "Fotos del evento"],
    popular: true,
    accent: "#00B4D8",
  },
  {
    name: "VIP EXPERIENCE",
    price: "45.000",
    duration: "por persona",
    description: "El paquete premium definitivo. Pista exclusiva y mas.",
    features: ["30 min pista exclusiva", "Telemetria completa", "Video onboard", "Champagne en podio", "Diploma personalizado", "Datos de rendimiento"],
    popular: false,
    accent: "#7B2FBE",
  },
];

const topTimes = [
  { pos: 1, name: "Carlos M.", time: "0:42.187", date: "Mar 2026", laps: 156 },
  { pos: 2, name: "Lucia R.", time: "0:42.891", date: "Mar 2026", laps: 89 },
  { pos: 3, name: "Martin G.", time: "0:43.102", date: "Feb 2026", laps: 234 },
  { pos: 4, name: "Valentina S.", time: "0:43.445", date: "Mar 2026", laps: 67 },
  { pos: 5, name: "Diego P.", time: "0:43.678", date: "Ene 2026", laps: 312 },
  { pos: 6, name: "Sofia L.", time: "0:43.901", date: "Mar 2026", laps: 45 },
  { pos: 7, name: "Tomas A.", time: "0:44.112", date: "Feb 2026", laps: 178 },
  { pos: 8, name: "Camila V.", time: "0:44.334", date: "Mar 2026", laps: 92 },
];

const galleryImages = [
  { id: 1, title: "Recta Principal", category: "Pista" },
  { id: 2, title: "Curva del Lago", category: "Pista" },
  { id: 3, title: "Zona de Boxes", category: "Instalaciones" },
  { id: 4, title: "Largada Nocturna", category: "Eventos" },
  { id: 5, title: "Podio Grupal", category: "Eventos" },
  { id: 6, title: "Kart Electrico Pro", category: "Kartings" },
];

const contactInfo = [
  { icon: MapPin, label: "Direccion", value: "Ruta X Km XX, Ciudad, Provincia" },
  { icon: Phone, label: "Telefono", value: "+54 XXX XXX-XXXX" },
  { icon: Mail, label: "Email", value: "info@ekarttrack.com" },
  { icon: Clock, label: "Horarios", value: "Lun-Vie 14-22h | Sab-Dom 10-23h" },
];

/* ─────────────────────── HELPERS ─────────────────────── */

function CyberCorners({ color = "#FF2D78", size = 12 }: { color?: string; size?: number }) {
  const s = `${size}px`;
  const style = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: s,
    height: s,
    borderColor: color,
    ...pos,
  });
  return (
    <>
      <span style={style({ top: 0, left: 0, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` })} />
      <span style={style({ top: 0, right: 0, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` })} />
      <span style={style({ bottom: 0, left: 0, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` })} />
      <span style={style({ bottom: 0, right: 0, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` })} />
    </>
  );
}

function SectionHeading({ tag, title, accent, children }: { tag: string; title: React.ReactNode; accent: string; children?: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      className="text-center mb-20"
    >
      <span
        className="inline-block text-xs font-bold uppercase tracking-[0.3em] px-4 py-1 border mb-6"
        style={{ color: accent, borderColor: accent + "55" }}
      >
        {`// ${tag}`}
      </span>
      <h2
        className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider"
        style={{
          WebkitTextStroke: "1px " + accent,
          color: "transparent",
        }}
      >
        {title}
      </h2>
      {children && <p className="text-gray-500 max-w-2xl mx-auto text-lg mt-6 tracking-wide">{children}</p>}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                       MAIN PAGE                           */
/* ═══════════════════════════════════════════════════════════ */

export default function V2Page() {
  const [showSemaphore, setShowSemaphore] = useState(true);
  const handleSemaphoreComplete = useCallback(() => {
    setTimeout(() => setShowSemaphore(false), 500);
  }, []);

  return (
    <>
      <style jsx global>{`
        /* ── Scanline Overlay ── */
        .cyber-scanlines::after {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.08) 2px,
            rgba(0, 0, 0, 0.08) 4px
          );
          pointer-events: none;
          z-index: 1;
        }

        /* ── Grid Overlay ── */
        .cyber-grid::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 45, 120, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 180, 216, 0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── Glitch Text Effect ── */
        .glitch-text {
          position: relative;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .glitch-text::before {
          color: #FF2D78;
          z-index: -1;
          animation: glitch-1 3s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          color: #00B4D8;
          z-index: -2;
          animation: glitch-2 3s infinite linear alternate-reverse;
        }

        @keyframes glitch-1 {
          0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          92% { clip-path: inset(20% 0 40% 0); transform: translate(-4px, 2px); }
          94% { clip-path: inset(60% 0 10% 0); transform: translate(4px, -2px); }
          96% { clip-path: inset(30% 0 30% 0); transform: translate(-2px, 1px); }
          98% { clip-path: inset(10% 0 70% 0); transform: translate(3px, -1px); }
        }
        @keyframes glitch-2 {
          0%, 90%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
          91% { clip-path: inset(50% 0 20% 0); transform: translate(3px, -2px); }
          93% { clip-path: inset(10% 0 60% 0); transform: translate(-3px, 2px); }
          95% { clip-path: inset(70% 0 5% 0); transform: translate(2px, -1px); }
          97% { clip-path: inset(5% 0 50% 0); transform: translate(-4px, 1px); }
        }

        /* ── Hover Glitch on Cards ── */
        .cyber-card:hover .cyber-card-inner {
          animation: card-glitch 0.3s steps(2) forwards;
        }
        @keyframes card-glitch {
          0% { transform: translate(0); }
          25% { transform: translate(-2px, 1px); }
          50% { transform: translate(2px, -1px); }
          75% { transform: translate(-1px, -1px); }
          100% { transform: translate(0); }
        }

        /* ── Animated Gradient Border ── */
        @keyframes border-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-border {
          background: linear-gradient(90deg, #FF2D78, #00B4D8, #7B2FBE, #FF2D78);
          background-size: 300% 100%;
          animation: border-rotate 4s linear infinite;
        }

        /* ── Neon Pulse ── */
        @keyframes neon-pulse {
          0%, 100% { box-shadow: 0 0 5px currentColor, 0 0 10px currentColor; }
          50% { box-shadow: 0 0 15px currentColor, 0 0 30px currentColor, 0 0 50px currentColor; }
        }

        /* ── Speed Lines ── */
        @keyframes speed-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }

        /* ── Flicker ── */
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.6; }
        }
        .neon-flicker {
          animation: flicker 4s infinite;
        }

        /* ── Data Stream ── */
        @keyframes data-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        /* ── Diagonal Section ── */
        .cyber-diagonal {
          clip-path: polygon(0 4%, 100% 0%, 100% 96%, 0% 100%);
        }

        /* ── Cyber Input ── */
        .cyber-input {
          background: rgba(5, 5, 16, 0.8);
          border: 1px solid rgba(0, 180, 216, 0.2);
          color: #fff;
          padding: 14px 16px;
          font-family: monospace;
          letter-spacing: 0.05em;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          transition: all 0.3s;
          outline: none;
          width: 100%;
        }
        .cyber-input:focus {
          border-color: #FF2D78;
          box-shadow: 0 0 15px rgba(255, 45, 120, 0.15), inset 0 0 15px rgba(255, 45, 120, 0.05);
        }
        .cyber-input::placeholder { color: rgba(255, 255, 255, 0.2); }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050510; }
        ::-webkit-scrollbar-thumb { background: #FF2D78; border-radius: 0; }
      `}</style>

      {/* ═══════════ SEMAPHORE INTRO ═══════════ */}
      <AnimatePresence>
        {showSemaphore && <SemaphoreOverlay onComplete={handleSemaphoreComplete} />}
      </AnimatePresence>

      <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#050510", color: "#fff" }}>
        {/* ═══════════ HERO ═══════════ */}
        <HeroSection />
        {/* ═══════════ EXPERIENCIAS ═══════════ */}
        <ExperienciasSection />
        {/* ═══════════ LA PISTA ═══════════ */}
        <PistaSection />
        {/* ═══════════ PRECIOS ═══════════ */}
        <PreciosSection />
        {/* ═══════════ RANKING ═══════════ */}
        <RankingSection />
        {/* ═══════════ GALERIA ═══════════ */}
        <GaleriaSection />
        {/* ═══════════ CONTACTO ═══════════ */}
        <ContactoSection />
        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="relative py-8 border-t" style={{ borderColor: "rgba(255,45,120,0.15)" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "#FF2D78" }}>
              eKartTrack &copy; 2026 &mdash; ALL SYSTEMS ONLINE
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                  SEMAPHORE INTRO OVERLAY                   */
/* ═══════════════════════════════════════════════════════════ */

function SemaphoreOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0); // 0=waiting, 1=red, 2=yellow, 3=green, 4=go-flash, 5=done

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 2900),
      setTimeout(() => { setPhase(5); onComplete(); }, 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (phase === 5) return null;

  const lights = [
    { color: "#FF2D78", shadow: "rgba(255,45,120,0.8)", label: "READY", activeAt: 1 },
    { color: "#FFB800", shadow: "rgba(255,184,0,0.8)", label: "STEADY", activeAt: 2 },
    { color: "#00FF87", shadow: "rgba(0,255,135,0.8)", label: "GO!", activeAt: 3 },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#050510" }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Background pulse on GO */}
      {phase >= 4 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.6 }}
          style={{ background: "radial-gradient(circle, rgba(0,255,135,0.15) 0%, transparent 70%)" }}
        />
      )}

      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
      }} />

      {/* Semaphore housing */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative"
      >
        {/* Housing frame */}
        <div className="relative px-8 py-6" style={{
          background: "linear-gradient(180deg, #0A0A1A 0%, #050510 100%)",
          border: "2px solid rgba(255,45,120,0.3)",
          clipPath: "polygon(15px 0, calc(100% - 15px) 0, 100% 15px, 100% calc(100% - 15px), calc(100% - 15px) 100%, 15px 100%, 0 calc(100% - 15px), 0 15px)",
        }}>
          <CyberCorners color="#FF2D78" size={15} />

          {/* Top label */}
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase tracking-[0.4em] font-mono" style={{ color: "rgba(255,45,120,0.5)" }}>
              // SYSTEM_INIT
            </span>
          </div>

          {/* Lights */}
          <div className="flex gap-8 items-center justify-center">
            {lights.map((light, i) => {
              const isActive = phase >= light.activeAt;
              const isCurrent = phase === light.activeAt || (phase === 4 && i === 2);
              return (
                <motion.div key={i} className="flex flex-col items-center gap-3">
                  {/* Light circle */}
                  <motion.div
                    className="relative"
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3, repeat: isCurrent && i === 2 ? 2 : 0 }}
                  >
                    {/* Outer ring */}
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
                      style={{
                        border: `2px solid ${isActive ? light.color : "rgba(255,255,255,0.08)"}`,
                        background: isActive
                          ? `radial-gradient(circle, ${light.color}20 0%, transparent 70%)`
                          : "rgba(255,255,255,0.02)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {/* Inner light */}
                      <motion.div
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                        animate={isActive ? {
                          background: light.color,
                          boxShadow: `0 0 20px ${light.shadow}, 0 0 40px ${light.shadow}, 0 0 80px ${light.shadow}`,
                        } : {
                          background: "rgba(255,255,255,0.03)",
                          boxShadow: "none",
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>

                    {/* Glow halo */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: [0.6, 0], scale: [1, 1.8] }}
                        transition={{ duration: 0.8 }}
                        style={{ background: `radial-gradient(circle, ${light.shadow}, transparent 70%)` }}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.span
                    className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] font-mono"
                    animate={{
                      color: isActive ? light.color : "rgba(255,255,255,0.1)",
                      textShadow: isActive ? `0 0 10px ${light.shadow}` : "none",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {light.label}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom bar */}
          <div className="mt-6 h-[2px] overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              className="h-full"
              initial={{ width: "0%" }}
              animate={{ width: phase >= 4 ? "100%" : `${(phase / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                background: phase >= 3
                  ? "linear-gradient(90deg, #FF2D78, #FFB800, #00FF87)"
                  : "linear-gradient(90deg, #FF2D78, #00B4D8)",
              }}
            />
          </div>
        </div>

        {/* Side decorations */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-[2px] h-16" style={{
          background: `linear-gradient(180deg, transparent, ${phase >= 1 ? "#FF2D78" : "rgba(255,255,255,0.05)"}, transparent)`,
        }} />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-[2px] h-16" style={{
          background: `linear-gradient(180deg, transparent, ${phase >= 1 ? "#FF2D78" : "rgba(255,255,255,0.05)"}, transparent)`,
        }} />
      </motion.div>

      {/* GO flash text */}
      <AnimatePresence>
        {phase === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute mt-48 sm:mt-56"
          >
            <span
              className="text-5xl sm:text-7xl font-black uppercase tracking-[0.3em]"
              style={{
                color: "#00FF87",
                textShadow: "0 0 20px rgba(0,255,135,0.8), 0 0 60px rgba(0,255,135,0.4), 0 0 100px rgba(0,255,135,0.2)",
              }}
            >
              GO!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                    1. HERO SECTION                        */
/* ═══════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-scanlines cyber-grid">
      {/* Perspective grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50vh]"
        style={{
          background: `
            linear-gradient(transparent 0%, rgba(0,180,216,0.06) 100%),
            repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(0,180,216,0.08) 59px, rgba(0,180,216,0.08) 60px),
            repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(0,180,216,0.08) 59px, rgba(0,180,216,0.08) 60px)
          `,
          transform: "perspective(500px) rotateX(45deg)",
          transformOrigin: "bottom center",
        }}
      />

      {/* Horizontal speed lines */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute h-[1px]"
          style={{
            top: `${15 + i * 13}%`,
            width: "200px",
            background: `linear-gradient(90deg, transparent, ${i % 2 === 0 ? "#FF2D78" : "#00B4D8"}40, transparent)`,
            animation: `speed-scan ${2.5 + i * 0.4}s ${i * 0.6}s linear infinite`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 px-5 py-2 mb-8"
          style={{
            border: "1px solid rgba(0,180,216,0.3)",
            clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
            background: "rgba(0,180,216,0.05)",
          }}
        >
          <Zap className="w-4 h-4" style={{ color: "#00B4D8" }} />
          <span className="text-xs uppercase tracking-[0.25em] font-bold" style={{ color: "#00B4D8" }}>
            100% Electrico // 0% Emisiones
          </span>
        </motion.div>

        {/* Main heading with glitch */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-wider leading-tight mb-2">
            <span className="block" style={{ WebkitTextStroke: "2px #FF2D78", color: "transparent" }}>SENTI LA</span>
            <span
              className="glitch-text block neon-flicker"
              data-text="VELOCIDAD"
              style={{
                background: "linear-gradient(90deg, #FF2D78, #00B4D8, #7B2FBE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(255,45,120,0.4))",
              }}
            >
              VELOCIDAD
            </span>
            <span className="block" style={{ WebkitTextStroke: "2px #00B4D8", color: "transparent" }}>ELECTRICA</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sm sm:text-base max-w-lg mx-auto mt-6 mb-10 tracking-wider leading-relaxed"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}
        >
          {`> Pista recreativa de kartings electricos. Vivi una experiencia de carrera profesional con la tecnologia mas avanzada.`}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
        >
          <Link
            href="/reservar"
            className="group relative inline-block px-10 py-4 font-black text-base uppercase tracking-[0.2em] transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #FF2D78, #7B2FBE)",
              clipPath: "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)",
              color: "#fff",
            }}
          >
            <span className="relative z-10">RESERVAR TURNO</span>
          </Link>
          <a
            href="#experiencias"
            className="inline-block px-10 py-4 font-bold text-sm uppercase tracking-[0.2em] transition-all hover:scale-105"
            style={{
              border: "1px solid rgba(0,180,216,0.4)",
              clipPath: "polygon(15px 0, 100% 0, calc(100% - 15px) 100%, 0 100%)",
              color: "#00B4D8",
            }}
          >
            CONOCER MAS
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-4"
        >
          {[
            { icon: Zap, value: "80", unit: "KM/H", label: "VELOCIDAD MAX" },
            { icon: Timer, value: "10", unit: "MIN", label: "POR TANDA" },
            { icon: Trophy, value: "500", unit: "M", label: "CIRCUITO" },
          ].map((stat, i) => (
            <div key={i} className="relative text-center p-4" style={{ border: `1px solid ${["#FF2D78", "#00B4D8", "#7B2FBE"][i]}22` }}>
              <CyberCorners color={["#FF2D78", "#00B4D8", "#7B2FBE"][i]} size={8} />
              <stat.icon className="w-4 h-4 mx-auto mb-2" style={{ color: ["#FF2D78", "#00B4D8", "#7B2FBE"][i] }} />
              <div className="text-2xl sm:text-3xl font-black font-mono">
                {stat.value}
                <span className="text-sm ml-1" style={{ color: ["#FF2D78", "#00B4D8", "#7B2FBE"][i] }}>{stat.unit}</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-mono" style={{ color: "#FF2D78" }}>SCROLL</span>
        <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: "#FF2D78" }} />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                 2. EXPERIENCIAS SECTION                   */
/* ═══════════════════════════════════════════════════════════ */

function ExperienciasSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experiencias" className="relative py-32 overflow-hidden cyber-scanlines" style={{ background: "#0A0A1A" }}>
      {/* Diagonal top cut */}
      <div className="absolute top-0 left-0 right-0 h-20" style={{ background: "#050510", clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 100%)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10" ref={ref}>
        <SectionHeading tag="EXPERIENCIAS" title="ELEGI TU AVENTURA" accent="#FF2D78">
          Desde una tanda rapida hasta un evento completo, tenemos la experiencia perfecta para vos.
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="cyber-card group relative p-[1px] overflow-hidden"
              style={{
                clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
              }}
            >
              {/* Animated border */}
              <div
                className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${exp.accent}, transparent 50%)` }}
              />

              <div
                className="cyber-card-inner relative p-7"
                style={{
                  background: "#0A0A1A",
                  clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, ${exp.accent}, transparent)` }} />

                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-12 h-12 mb-5"
                  style={{
                    border: `1px solid ${exp.accent}44`,
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: `${exp.accent}11`,
                  }}
                >
                  <exp.icon className="w-5 h-5" style={{ color: exp.accent }} />
                </div>

                <h3 className="text-base font-black uppercase tracking-[0.15em] mb-3 transition-colors group-hover:text-[color:var(--accent)]" style={{ "--accent": exp.accent } as React.CSSProperties}>
                  <span style={{ color: exp.accent }}>{`[ `}</span>
                  {exp.title}
                  <span style={{ color: exp.accent }}>{` ]`}</span>
                </h3>

                <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>{exp.description}</p>

                <ul className="space-y-2">
                  {exp.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <span className="w-1 h-1" style={{ background: exp.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                   3. LA PISTA SECTION                     */
/* ═══════════════════════════════════════════════════════════ */

function PistaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 overflow-hidden cyber-grid" style={{ background: "#050510" }}>
      {/* Diagonal accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5" style={{ background: "linear-gradient(135deg, #7B2FBE, transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] px-4 py-1 border inline-block mb-6" style={{ color: "#00B4D8", borderColor: "#00B4D833" }}>
              {`// LA PISTA`}
            </span>

            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-wider mb-6">
              <span style={{ WebkitTextStroke: "1px #00B4D8", color: "transparent" }}>CIRCUITO PARA LA</span>
              <br />
              <span style={{ color: "#00B4D8", textShadow: "0 0 30px rgba(0,180,216,0.4)" }}>MAXIMA EMOCION</span>
            </h2>

            <p className="text-sm leading-relaxed mb-10 tracking-wide" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>
              {`> Nuestro circuito de 500 metros cuenta con curvas tecnicas, rectas de alta velocidad y zonas de adelantamiento disenadas para ofrecer la mejor experiencia de karting electrico.`}
            </p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "LONGITUD", value: "500M", color: "#FF2D78" },
                { label: "CURVAS", value: "12", color: "#00B4D8" },
                { label: "ANCHO MIN", value: "8M", color: "#7B2FBE" },
                { label: "KARTINGS", value: "15", color: "#FF2D78" },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="relative p-5"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: `1px solid ${spec.color}22`,
                    clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  }}
                >
                  <CyberCorners color={spec.color} size={6} />
                  <div className="text-3xl font-black font-mono" style={{ color: spec.color, textShadow: `0 0 20px ${spec.color}44` }}>
                    {spec.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{spec.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Features */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {trackFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="group relative p-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(0,180,216,0.1)",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  transition: "all 0.3s",
                }}
              >
                <f.icon className="w-7 h-7 mb-3 transition-transform group-hover:scale-110" style={{ color: "#00B4D8" }} />
                <h3 className="text-xs font-black uppercase tracking-[0.15em] mb-1">{f.title}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                   4. PRECIOS SECTION                      */
/* ═══════════════════════════════════════════════════════════ */

function PreciosSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 overflow-hidden cyber-scanlines" style={{ background: "#0A0A1A" }}>
      {/* Skewed accent bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ background: "repeating-linear-gradient(-45deg, #FF2D78, #FF2D78 1px, transparent 1px, transparent 30px)" }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10" ref={ref}>
        <SectionHeading tag="PRECIOS" title="PLANES PARA CADA PILOTO" accent="#7B2FBE">
          Elegi el plan que mejor se adapte a tu nivel de adrenalina.
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative h-full ${plan.popular ? "md:-translate-y-4" : ""}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-6 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
                  style={{
                    background: "linear-gradient(90deg, #00B4D8, #7B2FBE)",
                    clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)",
                    color: "#fff",
                  }}
                >
                  <Star className="w-3 h-3" /> MAS POPULAR
                </div>
              )}

              {/* Outer glow for popular */}
              <div
                className="relative p-[1px] overflow-hidden h-full"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px))",
                  background: plan.popular
                    ? "linear-gradient(135deg, #00B4D8, #7B2FBE)"
                    : `linear-gradient(135deg, ${plan.accent}44, transparent)`,
                }}
              >
                <div
                  className="relative p-8 h-full flex flex-col"
                  style={{
                    background: plan.popular ? "linear-gradient(180deg, rgba(0,180,216,0.08), #0A0A1A)" : "#0A0A1A",
                    clipPath: "polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px))",
                  }}
                >
                  <CyberCorners color={plan.accent} size={10} />

                  <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2" style={{ color: plan.accent }}>
                    {plan.name}
                  </h3>
                  <p className="text-[11px] mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-black font-mono" style={{ color: "#fff" }}>${plan.price}</span>
                    <span className="text-xs ml-2 uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{plan.duration}</span>
                  </div>

                  {/* Separator line */}
                  <div className="h-[1px] mb-6" style={{ background: `linear-gradient(90deg, ${plan.accent}44, transparent)` }} />

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-xs tracking-wider">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.accent }} />
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/reservar"
                    className="block text-center py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
                    style={{
                      background: plan.popular ? `linear-gradient(90deg, ${plan.accent}, #7B2FBE)` : "transparent",
                      border: plan.popular ? "none" : `1px solid ${plan.accent}55`,
                      color: plan.popular ? "#fff" : plan.accent,
                      clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)",
                    }}
                  >
                    RESERVAR AHORA
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                   5. RANKING SECTION                      */
/* ═══════════════════════════════════════════════════════════ */

function RankingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-32 overflow-hidden cyber-grid" style={{ background: "#050510" }}>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10" ref={ref}>
        <SectionHeading tag="RANKING" title="TABLA DE TIEMPOS" accent="#00B4D8">
          Los pilotos mas rapidos de nuestra pista. Te animas a entrar en el ranking?
        </SectionHeading>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative p-[1px]"
          style={{
            clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
            background: "linear-gradient(135deg, #00B4D855, #7B2FBE33, transparent)",
          }}
        >
          <div
            style={{
              background: "#0A0A1A",
              clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
            }}
          >
            {/* Header */}
            <div
              className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-[0.2em]"
              style={{ borderBottom: "1px solid rgba(0,180,216,0.15)", color: "rgba(255,255,255,0.3)" }}
            >
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">PILOTO</div>
              <div className="col-span-3 text-center">MEJOR TIEMPO</div>
              <div className="col-span-2 text-center hidden sm:block">VUELTAS</div>
              <div className="col-span-2 text-right">FECHA</div>
            </div>

            {/* Rows */}
            {topTimes.map((entry, i) => (
              <motion.div
                key={entry.pos}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  background: entry.pos <= 3 ? `rgba(${entry.pos === 1 ? "255,45,120" : entry.pos === 2 ? "0,180,216" : "123,47,190"},0.03)` : "transparent",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,45,120,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = entry.pos <= 3 ? `rgba(${entry.pos === 1 ? "255,45,120" : entry.pos === 2 ? "0,180,216" : "123,47,190"},0.03)` : "transparent"; }}
              >
                <div className="col-span-1 text-center">
                  {entry.pos === 1 ? (
                    <Trophy className="w-5 h-5 mx-auto" style={{ color: "#FF2D78", filter: "drop-shadow(0 0 8px rgba(255,45,120,0.5))" }} />
                  ) : entry.pos === 2 ? (
                    <Medal className="w-5 h-5 mx-auto" style={{ color: "#00B4D8" }} />
                  ) : entry.pos === 3 ? (
                    <Medal className="w-5 h-5 mx-auto" style={{ color: "#7B2FBE" }} />
                  ) : (
                    <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{entry.pos}</span>
                  )}
                </div>
                <div className="col-span-4">
                  <span className={`text-sm font-bold uppercase tracking-wider ${entry.pos <= 3 ? "text-white" : ""}`} style={entry.pos > 3 ? { color: "rgba(255,255,255,0.5)" } : {}}>
                    {entry.name}
                  </span>
                </div>
                <div className="col-span-3 text-center">
                  <span
                    className="font-mono font-black text-sm"
                    style={{
                      color: entry.pos === 1 ? "#FF2D78" : "#fff",
                      textShadow: entry.pos === 1 ? "0 0 15px rgba(255,45,120,0.5)" : "none",
                    }}
                  >
                    {entry.time}
                  </span>
                </div>
                <div className="col-span-2 text-center hidden sm:block">
                  <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{entry.laps}</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{entry.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="text-center text-[11px] uppercase tracking-[0.2em] mt-6 font-mono"
          style={{ color: "rgba(0,180,216,0.5)" }}
        >
          <TrendingUp className="w-3.5 h-3.5 inline mr-2" />
          ACTUALIZADO EN TIEMPO REAL DURANTE LAS SESIONES
        </motion.p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                   6. GALERIA SECTION                      */
/* ═══════════════════════════════════════════════════════════ */

function GaleriaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [filter, setFilter] = useState("Todos");

  const categories = ["Todos", "Pista", "Eventos", "Instalaciones", "Kartings"];
  const filtered = filter === "Todos" ? galleryImages : galleryImages.filter((img) => img.category === filter);

  const accentColors = ["#FF2D78", "#00B4D8", "#7B2FBE"];

  return (
    <section className="relative py-32 overflow-hidden cyber-scanlines" style={{ background: "#0A0A1A" }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10" ref={ref}>
        <SectionHeading tag="GALERIA" title="VIVI LA EXPERIENCIA" accent="#FF2D78" />

        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-2.5 transition-all"
              style={{
                background: filter === cat ? "#FF2D78" : "transparent",
                border: `1px solid ${filter === cat ? "#FF2D78" : "rgba(255,45,120,0.2)"}`,
                color: filter === cat ? "#fff" : "rgba(255,255,255,0.4)",
                clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)",
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden"
              style={{
                clipPath: "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
              }}
            >
              {/* Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${accentColors[i % 3]}22, ${accentColors[(i + 1) % 3]}11)`,
                }}
              />

              {/* Scanline pattern */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
                }}
              />

              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(${accentColors[i % 3]}15 1px, transparent 1px), linear-gradient(90deg, ${accentColors[i % 3]}15 1px, transparent 1px)`,
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-10 h-10 transition-all group-hover:scale-110 group-hover:opacity-50" style={{ color: `${accentColors[i % 3]}44` }} />
              </div>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(180deg, transparent 30%, ${accentColors[i % 3]}33 100%)` }}
              />

              {/* Corner decorations */}
              <CyberCorners color={accentColors[i % 3]} size={10} />

              {/* Info on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-black uppercase tracking-wider">{img.title}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: accentColors[i % 3] }}>{img.category}</p>
              </div>

              {/* Top-right tag */}
              <div
                className="absolute top-3 right-3 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: accentColors[i % 3], color: "#fff" }}
              >
                VIEW
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*                  7. CONTACTO SECTION                      */
/* ═══════════════════════════════════════════════════════════ */

function ContactoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });
      if (res.ok) {
        setSent(true);
        toast.success("Mensaje enviado correctamente!");
      } else {
        toast.error("Error al enviar el mensaje. Intenta de nuevo.");
      }
    } catch {
      toast.error("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="relative py-32 overflow-hidden cyber-grid" style={{ background: "#050510" }}>
      {/* Diagonal accent lines */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ background: "repeating-linear-gradient(45deg, #00B4D8, #00B4D8 1px, transparent 1px, transparent 40px)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10" ref={ref}>
        <SectionHeading tag="CONTACTO" title="TENES PREGUNTAS?" accent="#00B4D8">
          Escribinos y te respondemos lo antes posible.
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left - Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactInfo.map((info, i) => (
              <div
                key={info.label}
                className="group relative flex items-start gap-4 p-5 transition-all"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(0,180,216,0.1)",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center"
                  style={{
                    border: `1px solid ${["#FF2D78", "#00B4D8", "#7B2FBE", "#FF2D78"][i]}33`,
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    background: `${["#FF2D78", "#00B4D8", "#7B2FBE", "#FF2D78"][i]}11`,
                  }}
                >
                  <info.icon className="w-4 h-4" style={{ color: ["#FF2D78", "#00B4D8", "#7B2FBE", "#FF2D78"][i] }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{info.label}</p>
                  <p className="text-sm font-bold tracking-wide">{info.value}</p>
                </div>
              </div>
            ))}

            {/* Decorative data stream box */}
            <div
              className="relative h-28 overflow-hidden mt-6"
              style={{
                border: "1px solid rgba(255,45,120,0.1)",
                background: "rgba(255,45,120,0.02)",
                clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              }}
            >
              <CyberCorners color="#FF2D78" size={6} />
              <div className="p-3 font-mono text-[9px] leading-loose overflow-hidden h-full" style={{ color: "rgba(255,45,120,0.3)" }}>
                <div style={{ animation: "data-scroll 10s linear infinite" }}>
                  {`SYS.INIT > eKartTrack_v2.0\nLOAD > track_module [OK]\nLOAD > timing_system [OK]\nLOAD > telemetry [OK]\nCAL > safety_check [PASS]\nSTATUS > ALL_SYSTEMS_ONLINE\nMODE > ACCEPTING_RIDERS\nSYS.INIT > eKartTrack_v2.0\nLOAD > track_module [OK]\nLOAD > timing_system [OK]\nLOAD > telemetry [OK]`.split("\n").map((line, j) => (
                    <div key={j}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div
                className="relative flex flex-col items-center justify-center p-14 text-center"
                style={{
                  border: "1px solid rgba(0,180,216,0.3)",
                  background: "rgba(0,180,216,0.03)",
                  clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                }}
              >
                <CyberCorners color="#00B4D8" />
                <Check className="w-16 h-16 mb-4" style={{ color: "#00B4D8", filter: "drop-shadow(0 0 20px rgba(0,180,216,0.5))" }} />
                <h3 className="text-2xl font-black uppercase tracking-wider mb-2">MENSAJE ENVIADO</h3>
                <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>Te vamos a responder lo antes posible.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all"
                  style={{
                    border: "1px solid rgba(0,180,216,0.3)",
                    color: "#00B4D8",
                    clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 8px 100%, 0 50%)",
                  }}
                >
                  ENVIAR OTRO
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative p-8 space-y-5"
                style={{
                  border: "1px solid rgba(0,180,216,0.1)",
                  background: "rgba(255,255,255,0.01)",
                  clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
                }}
              >
                <CyberCorners color="#00B4D8" />

                {/* Form header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2" style={{ background: "#FF2D78" }} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {`// FORMULARIO DE CONTACTO`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-mono" style={{ color: "#FF2D78" }}>Nombre *</label>
                    <input name="name" required className="cyber-input" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-mono" style={{ color: "#FF2D78" }}>Email *</label>
                    <input name="email" type="email" required className="cyber-input" placeholder="tu@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-mono" style={{ color: "#00B4D8" }}>Telefono</label>
                    <input name="phone" className="cyber-input" placeholder="+54 XXX XXX-XXXX" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-mono" style={{ color: "#00B4D8" }}>Asunto *</label>
                    <input name="subject" required className="cyber-input" placeholder="Asunto del mensaje" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-mono" style={{ color: "#7B2FBE" }}>Mensaje *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="cyber-input"
                    style={{ resize: "none" }}
                    placeholder="Contanos en que podemos ayudarte..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-sm font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3"
                  style={{
                    background: "linear-gradient(90deg, #FF2D78, #7B2FBE)",
                    color: "#fff",
                    clipPath: "polygon(15px 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 15px 100%, 0 50%)",
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      ENVIAR MENSAJE
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
