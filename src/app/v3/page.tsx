"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Zap,
  Timer,
  Trophy,
  Clock,
  Users,
  Shield,
  Leaf,
  Gauge,
  Battery,
  Wifi,
  Volume2,
  Check,
  Star,
  Medal,
  TrendingUp,
  Camera,
  Send,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  Sparkles,
  GraduationCap,
  PartyPopper,
} from "lucide-react";

/* ─────────────────────────── ANIMATION HELPERS ─────────────────────────── */

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} className={className}>
      {typeof children === "function" ? (children as (v: boolean) => React.ReactNode)(isInView) : children}
    </section>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  transition: { duration: 1, delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  transition: { duration: 1.2, delay },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -40 },
  transition: { duration: 1, delay },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 40 },
  transition: { duration: 1, delay },
});

/* ─────────────────────────── DATA ─────────────────────────── */

const experiences = [
  {
    icon: Clock,
    title: "Tandas Libres",
    description: "Salí a la pista y disfrutá de 10 minutos de adrenalina pura. Ideal para quienes quieren sentir la velocidad sin compromiso.",
    features: ["10 min de pista", "Casco incluido", "Briefing de seguridad"],
  },
  {
    icon: Trophy,
    title: "Carreras Grupales",
    description: "Competí contra tus amigos en una carrera real con clasificación, largada y podio. La experiencia definitiva de karting.",
    features: ["Hasta 10 pilotos", "Clasificación + Carrera", "Podio y premiación"],
  },
  {
    icon: Users,
    title: "Eventos Corporativos",
    description: "Team building único. Organizá un evento inolvidable para tu empresa con carreras, rankings y catering opcional.",
    features: ["Pista exclusiva", "Ranking en tiempo real", "Personalización total"],
  },
  {
    icon: PartyPopper,
    title: "Cumpleaños",
    description: "Celebrá tu cumpleaños con una fiesta llena de velocidad. Paquetes especiales con todo incluido.",
    features: ["Salón privado", "Torta + bebidas", "2 tandas por invitado"],
  },
  {
    icon: GraduationCap,
    title: "Escuela de Karting",
    description: "Aprendé técnicas de manejo profesional con nuestros instructores certificados. Para todas las edades.",
    features: ["Instructor personal", "Técnicas avanzadas", "Certificado"],
  },
  {
    icon: Sparkles,
    title: "Experiencia VIP",
    description: "El paquete premium: pista exclusiva, datos de telemetría, video onboard y champagne en el podio.",
    features: ["Pista exclusiva 30 min", "Telemetría completa", "Video onboard"],
  },
];

const trackFeatures = [
  { icon: Gauge, title: "Alta Velocidad", desc: "Kartings eléctricos que alcanzan hasta 80 km/h con aceleración instantánea." },
  { icon: Shield, title: "Máxima Seguridad", desc: "Barreras de protección, cascos certificados y briefing obligatorio." },
  { icon: Leaf, title: "100% Ecológico", desc: "Cero emisiones de CO2. Energía 100% eléctrica." },
  { icon: Battery, title: "Baterías Premium", desc: "Rendimiento constante durante toda la tanda." },
  { icon: Wifi, title: "Telemetría en Vivo", desc: "Cronometraje profesional con pantallas en tiempo real." },
  { icon: Volume2, title: "Sin Ruido", desc: "Motores silenciosos para zonas urbanas." },
];

const plans = [
  {
    name: "Tanda Libre",
    price: "15.000",
    duration: "10 min",
    description: "La experiencia perfecta para una primera vez o una tanda rápida.",
    features: ["10 minutos de pista", "Casco y equipamiento", "Briefing de seguridad", "Tiempos por vuelta"],
    popular: false,
  },
  {
    name: "Carrera Grupal",
    price: "22.000",
    duration: "por piloto",
    description: "Clasificación + carrera con largada real. La experiencia completa.",
    features: ["Clasificación 5 min", "Carrera 10 min", "Podio y premiación", "Ranking en pantalla", "Fotos del evento"],
    popular: true,
  },
  {
    name: "VIP Experience",
    price: "45.000",
    duration: "por persona",
    description: "El paquete premium definitivo. Pista exclusiva y más.",
    features: ["30 min pista exclusiva", "Telemetría completa", "Video onboard", "Champagne en podio", "Diploma personalizado", "Datos de rendimiento"],
    popular: false,
  },
];

const topTimes = [
  { pos: 1, name: "Carlos M.", time: "0:42.187", date: "Mar 2026", laps: 156 },
  { pos: 2, name: "Lucía R.", time: "0:42.891", date: "Mar 2026", laps: 89 },
  { pos: 3, name: "Martín G.", time: "0:43.102", date: "Feb 2026", laps: 234 },
  { pos: 4, name: "Valentina S.", time: "0:43.445", date: "Mar 2026", laps: 67 },
  { pos: 5, name: "Diego P.", time: "0:43.678", date: "Ene 2026", laps: 312 },
  { pos: 6, name: "Sofía L.", time: "0:43.901", date: "Mar 2026", laps: 45 },
  { pos: 7, name: "Tomás A.", time: "0:44.112", date: "Feb 2026", laps: 178 },
  { pos: 8, name: "Camila V.", time: "0:44.334", date: "Mar 2026", laps: 92 },
];

const galleryImages = [
  { id: 1, title: "Recta Principal", category: "Pista", span: "col-span-2 row-span-2" },
  { id: 2, title: "Curva del Lago", category: "Pista", span: "col-span-1 row-span-1" },
  { id: 3, title: "Zona de Boxes", category: "Instalaciones", span: "col-span-1 row-span-1" },
  { id: 4, title: "Largada Nocturna", category: "Eventos", span: "col-span-1 row-span-2" },
  { id: 5, title: "Podio Grupal", category: "Eventos", span: "col-span-1 row-span-1" },
  { id: 6, title: "Kart Eléctrico Pro", category: "Kartings", span: "col-span-1 row-span-1" },
];

const contactInfo = [
  { icon: MapPin, label: "Dirección", value: "Ruta X Km XX, Ciudad, Provincia" },
  { icon: Phone, label: "Teléfono", value: "+54 XXX XXX-XXXX" },
  { icon: Mail, label: "Email", value: "info@ekarttrack.com" },
  { icon: Clock, label: "Horarios", value: "Lun-Vie 14-22h | Sáb-Dom 10-23h" },
];

/* ─────────────────────────── DIVIDER ─────────────────────────── */

function GoldDivider() {
  return (
    <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent 0%, #D4AF37 30%, #F5D061 50%, #D4AF37 70%, transparent 100%)" }} />
  );
}

/* ─────────────────────────── MAIN PAGE ─────────────────────────── */

export default function V3Page() {
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
        toast.success("Mensaje enviado correctamente.");
      } else {
        toast.error("Error al enviar. Intentá de nuevo.");
      }
    } catch {
      toast.error("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  /* ───── HERO REF ───── */
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  /* ───── SECTION REFS ───── */
  const expRef = useRef(null);
  const expInView = useInView(expRef, { once: true, margin: "-80px" });

  const trackRef = useRef(null);
  const trackInView = useInView(trackRef, { once: true, margin: "-80px" });

  const priceRef = useRef(null);
  const priceInView = useInView(priceRef, { once: true, margin: "-80px" });

  const rankRef = useRef(null);
  const rankInView = useInView(rankRef, { once: true, margin: "-80px" });

  const galRef = useRef(null);
  const galInView = useInView(galRef, { once: true, margin: "-80px" });

  const contactRef = useRef(null);
  const contactInView = useInView(contactRef, { once: true, margin: "-80px" });

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600&display=swap');

        .v3-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0D0D0D;
          color: #E5E4E2;
        }
        .v3-page * {
          box-sizing: border-box;
        }
        .v3-serif {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }
        .v3-gold-glow {
          box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
          transition: box-shadow 0.6s ease;
        }
        .v3-gold-glow:hover {
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.15), 0 0 60px rgba(212, 175, 55, 0.05);
        }
        .v3-underline-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 0;
          padding: 12px 0;
          color: #FAFAF5;
          font-size: 15px;
          width: 100%;
          outline: none;
          transition: border-color 0.4s ease;
        }
        .v3-underline-input::placeholder {
          color: rgba(229, 228, 226, 0.3);
        }
        .v3-underline-input:focus {
          border-bottom-color: #D4AF37;
        }
        .v3-underline-textarea {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 0;
          padding: 12px 0;
          color: #FAFAF5;
          font-size: 15px;
          width: 100%;
          outline: none;
          resize: none;
          transition: border-color 0.4s ease;
        }
        .v3-underline-textarea::placeholder {
          color: rgba(229, 228, 226, 0.3);
        }
        .v3-underline-textarea:focus {
          border-bottom-color: #D4AF37;
        }
        .v3-carbon {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          );
        }
        .v3-shimmer {
          background: linear-gradient(
            110deg,
            transparent 25%,
            rgba(212, 175, 55, 0.04) 37%,
            transparent 50%
          );
          background-size: 200% 100%;
          animation: v3shimmer 6s ease-in-out infinite;
        }
        @keyframes v3shimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }
        .v3-stat-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 300;
          line-height: 1;
        }
      `}</style>

      <div className="v3-page min-h-screen">

        {/* ════════════════════════════════ HERO ════════════════════════════════ */}
        <section ref={heroRef} id="inicio" className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
          {/* Carbon fiber background */}
          <div className="absolute inset-0 v3-carbon" />
          <div className="absolute inset-0 v3-shimmer" />

          {/* Subtle gold corner accents */}
          <div className="absolute top-0 left-0 w-32 h-px" style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }} />
          <div className="absolute top-0 left-0 h-32 w-px" style={{ background: "linear-gradient(180deg, #D4AF37, transparent)" }} />
          <div className="absolute top-0 right-0 w-32 h-px" style={{ background: "linear-gradient(270deg, #D4AF37, transparent)" }} />
          <div className="absolute top-0 right-0 h-32 w-px" style={{ background: "linear-gradient(180deg, #D4AF37, transparent)" }} />

          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <motion.p
              {...fadeIn(0.2)}
              animate={heroInView ? { opacity: 1 } : {}}
              className="uppercase tracking-[0.35em] text-xs mb-8"
              style={{ color: "#D4AF37" }}
            >
              100% Eléctrico &bull; 0% Emisiones
            </motion.p>

            <motion.h1
              {...fadeUp(0.4)}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              className="v3-serif text-5xl sm:text-7xl lg:text-[6.5rem] font-light leading-[0.95] mb-8"
              style={{ color: "#FAFAF5" }}
            >
              Sentí la{" "}
              <span className="italic" style={{ color: "#D4AF37" }}>
                Velocidad
              </span>
              <br />
              Eléctrica
            </motion.h1>

            <motion.p
              {...fadeUp(0.6)}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              className="text-base sm:text-lg max-w-xl mx-auto mb-12 leading-relaxed"
              style={{ color: "#E5E4E2", opacity: 0.7 }}
            >
              Pista recreativa de kartings eléctricos. Viví una experiencia de carrera
              profesional con la tecnología más avanzada.
            </motion.p>

            <motion.div
              {...fadeUp(0.8)}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link
                href="/v3/reservar"
                className="px-10 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:bg-[#D4AF37] hover:text-[#0D0D0D]"
                style={{ border: "1px solid #D4AF37", color: "#D4AF37" }}
              >
                Reservar Turno
              </Link>
              <a
                href="#experiencias"
                className="px-10 py-4 text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:border-[#E5E4E2]"
                style={{ border: "1px solid rgba(229,228,226,0.2)", color: "#E5E4E2" }}
              >
                Descubrir
              </a>
            </motion.div>
          </div>

          {/* Stat bar at bottom */}
          <motion.div
            {...fadeUp(1.2)}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            className="absolute bottom-0 left-0 right-0"
          >
            <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />
            <div className="max-w-4xl mx-auto grid grid-cols-3 py-8 px-6">
              {[
                { value: "80", unit: "km/h", label: "Velocidad Máx" },
                { value: "10", unit: "min", label: "Por Tanda" },
                { value: "500", unit: "m", label: "Circuito" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="v3-stat-number text-4xl sm:text-5xl" style={{ color: "#FAFAF5" }}>{s.value}</span>
                    <span className="text-sm font-mono" style={{ color: "#D4AF37" }}>{s.unit}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] mt-2" style={{ color: "rgba(229,228,226,0.4)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.a
            href="#experiencias"
            {...fadeIn(1.6)}
            animate={heroInView ? { opacity: 1 } : {}}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-colors duration-300"
            style={{ color: "rgba(212,175,55,0.4)" }}
          >
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </motion.a>
        </section>

        <GoldDivider />

        {/* ════════════════════════════════ EXPERIENCIAS ════════════════════════════════ */}
        <section ref={expRef} id="experiencias" className="py-28 sm:py-36">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              {...fadeUp()}
              animate={expInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-20"
            >
              <p className="uppercase tracking-[0.35em] text-xs mb-5" style={{ color: "#D4AF37" }}>
                Experiencias
              </p>
              <h2 className="v3-serif text-4xl sm:text-5xl lg:text-6xl font-light" style={{ color: "#FAFAF5" }}>
                Elegí Tu <span className="italic" style={{ color: "#D4AF37" }}>Aventura</span>
              </h2>
              <p className="mt-6 text-base max-w-lg mx-auto" style={{ color: "rgba(229,228,226,0.5)" }}>
                Desde una tanda rápida hasta un evento completo, tenemos la experiencia perfecta para vos.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(212,175,55,0.15)" }}>
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.title}
                  {...fadeUp(i * 0.08)}
                  animate={expInView ? { opacity: 1, y: 0 } : {}}
                  className="group relative p-10 v3-gold-glow transition-all duration-500"
                  style={{ background: "#0D0D0D" }}
                >
                  {/* Gold accent line on top */}
                  <div className="absolute top-0 left-0 right-0 h-px transition-all duration-500 group-hover:h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />

                  <exp.icon className="w-6 h-6 mb-6" style={{ color: "#D4AF37" }} />

                  <h3 className="v3-serif text-xl font-medium mb-3 transition-colors duration-300 group-hover:text-[#D4AF37]" style={{ color: "#FAFAF5" }}>
                    {exp.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(229,228,226,0.45)" }}>
                    {exp.description}
                  </p>

                  <ul className="space-y-2.5">
                    {exp.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-xs" style={{ color: "rgba(229,228,226,0.6)" }}>
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#D4AF37" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ════════════════════════════════ LA PISTA ════════════════════════════════ */}
        <section ref={trackRef} id="pista" className="py-28 sm:py-36">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Left - Stats */}
              <motion.div
                {...fadeLeft()}
                animate={trackInView ? { opacity: 1, x: 0 } : {}}
              >
                <p className="uppercase tracking-[0.35em] text-xs mb-5" style={{ color: "#D4AF37" }}>
                  La Pista
                </p>
                <h2 className="v3-serif text-4xl sm:text-5xl font-light mb-8" style={{ color: "#FAFAF5" }}>
                  Circuito Diseñado Para la{" "}
                  <span className="italic" style={{ color: "#D4AF37" }}>Máxima Emoción</span>
                </h2>
                <p className="text-base leading-relaxed mb-14" style={{ color: "rgba(229,228,226,0.5)" }}>
                  Nuestro circuito de 500 metros cuenta con curvas técnicas, rectas de alta velocidad
                  y zonas de adelantamiento diseñadas para la mejor experiencia de karting eléctrico.
                </p>

                <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                  {[
                    { label: "Longitud", value: "500", unit: "m" },
                    { label: "Curvas", value: "12", unit: "" },
                    { label: "Ancho Mínimo", value: "8", unit: "m" },
                    { label: "Kartings", value: "15", unit: "" },
                  ].map((spec, i) => (
                    <motion.div
                      key={spec.label}
                      {...fadeUp(0.2 + i * 0.1)}
                      animate={trackInView ? { opacity: 1, y: 0 } : {}}
                    >
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="v3-stat-number text-5xl sm:text-6xl" style={{ color: "#FAFAF5" }}>{spec.value}</span>
                        {spec.unit && <span className="text-lg font-mono" style={{ color: "#D4AF37" }}>{spec.unit}</span>}
                      </div>
                      <div className="w-8 h-px mb-2" style={{ background: "#D4AF37" }} />
                      <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(229,228,226,0.4)" }}>{spec.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right - Features */}
              <motion.div
                {...fadeRight(0.2)}
                animate={trackInView ? { opacity: 1, x: 0 } : {}}
                className="space-y-0"
              >
                {trackFeatures.map((f, i) => (
                  <motion.div
                    key={f.title}
                    {...fadeUp(0.3 + i * 0.08)}
                    animate={trackInView ? { opacity: 1, y: 0 } : {}}
                    className="group flex items-start gap-5 py-6"
                    style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
                  >
                    <f.icon className="w-5 h-5 mt-0.5 flex-shrink-0 transition-colors duration-300 group-hover:text-[#D4AF37]" style={{ color: "rgba(229,228,226,0.3)" }} />
                    <div>
                      <h4 className="text-sm font-medium mb-1 transition-colors duration-300 group-hover:text-[#D4AF37]" style={{ color: "#FAFAF5" }}>
                        {f.title}
                      </h4>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(229,228,226,0.4)" }}>
                        {f.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ════════════════════════════════ PRECIOS ════════════════════════════════ */}
        <section ref={priceRef} id="precios" className="py-28 sm:py-36">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              {...fadeUp()}
              animate={priceInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-20"
            >
              <p className="uppercase tracking-[0.35em] text-xs mb-5" style={{ color: "#D4AF37" }}>
                Precios
              </p>
              <h2 className="v3-serif text-4xl sm:text-5xl lg:text-6xl font-light" style={{ color: "#FAFAF5" }}>
                Planes Para Cada <span className="italic" style={{ color: "#D4AF37" }}>Piloto</span>
              </h2>
              <p className="mt-6 text-base max-w-lg mx-auto" style={{ color: "rgba(229,228,226,0.5)" }}>
                Elegí el plan que mejor se adapte a tu nivel de adrenalina.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(212,175,55,0.15)" }}>
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  {...fadeUp(i * 0.15)}
                  animate={priceInView ? { opacity: 1, y: 0 } : {}}
                  className="relative p-10 v3-gold-glow transition-all duration-500"
                  style={{
                    background: plan.popular
                      ? "linear-gradient(180deg, rgba(212,175,55,0.08) 0%, #0D0D0D 100%)"
                      : "#0D0D0D",
                  }}
                >
                  {plan.popular && (
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-1.5 text-[10px] uppercase tracking-[0.25em] font-medium"
                      style={{ background: "#D4AF37", color: "#0D0D0D" }}
                    >
                      Más Popular
                    </div>
                  )}

                  <h3 className="v3-serif text-2xl font-medium mb-2" style={{ color: "#FAFAF5" }}>{plan.name}</h3>
                  <p className="text-xs mb-8" style={{ color: "rgba(229,228,226,0.4)" }}>{plan.description}</p>

                  <div className="mb-8">
                    <span className="v3-stat-number text-5xl" style={{ color: "#FAFAF5" }}>${plan.price}</span>
                    <span className="text-xs ml-2 uppercase tracking-[0.15em]" style={{ color: "rgba(229,228,226,0.35)" }}>{plan.duration}</span>
                  </div>

                  <div className="w-full h-px mb-8" style={{ background: "rgba(212,175,55,0.15)" }} />

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "rgba(229,228,226,0.6)" }}>
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#D4AF37" }} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/v3/reservar"
                    className="block text-center py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:bg-[#D4AF37] hover:text-[#0D0D0D]"
                    style={{
                      border: "1px solid #D4AF37",
                      color: plan.popular ? "#0D0D0D" : "#D4AF37",
                      background: plan.popular ? "#D4AF37" : "transparent",
                    }}
                  >
                    Reservar Ahora
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ════════════════════════════════ RANKING ════════════════════════════════ */}
        <section ref={rankRef} className="py-28 sm:py-36">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              {...fadeUp()}
              animate={rankInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <p className="uppercase tracking-[0.35em] text-xs mb-5" style={{ color: "#D4AF37" }}>
                Ranking
              </p>
              <h2 className="v3-serif text-4xl sm:text-5xl lg:text-6xl font-light" style={{ color: "#FAFAF5" }}>
                Tabla de <span className="italic" style={{ color: "#D4AF37" }}>Tiempos</span>
              </h2>
              <p className="mt-6 text-base max-w-lg mx-auto" style={{ color: "rgba(229,228,226,0.5)" }}>
                Los pilotos más rápidos de nuestra pista.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp(0.2)}
              animate={rankInView ? { opacity: 1, y: 0 } : {}}
            >
              {/* Table header */}
              <div
                className="grid grid-cols-12 gap-4 px-6 py-4 text-[10px] uppercase tracking-[0.25em]"
                style={{ color: "rgba(229,228,226,0.3)", borderBottom: "1px solid rgba(212,175,55,0.2)" }}
              >
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Piloto</div>
                <div className="col-span-3 text-center">Mejor Tiempo</div>
                <div className="col-span-2 text-center hidden sm:block">Vueltas</div>
                <div className="col-span-2 text-right">Fecha</div>
              </div>

              {/* Table rows */}
              {topTimes.map((entry, i) => (
                <motion.div
                  key={entry.pos}
                  initial={{ opacity: 0, x: -15 }}
                  animate={rankInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
                  className="grid grid-cols-12 gap-4 px-6 py-5 items-center transition-colors duration-300 hover:bg-white/[0.02]"
                  style={{ borderBottom: "1px solid rgba(212,175,55,0.06)" }}
                >
                  <div className="col-span-1 text-center">
                    {entry.pos === 1 ? (
                      <Trophy className="w-4 h-4 mx-auto" style={{ color: "#D4AF37" }} />
                    ) : entry.pos === 2 ? (
                      <Medal className="w-4 h-4 mx-auto" style={{ color: "#E5E4E2" }} />
                    ) : entry.pos === 3 ? (
                      <Medal className="w-4 h-4 mx-auto" style={{ color: "#CD7F32" }} />
                    ) : (
                      <span className="text-sm" style={{ color: "rgba(229,228,226,0.25)" }}>{entry.pos}</span>
                    )}
                  </div>
                  <div className="col-span-4">
                    <span
                      className="text-sm font-medium"
                      style={{ color: entry.pos <= 3 ? "#FAFAF5" : "rgba(229,228,226,0.6)" }}
                    >
                      {entry.name}
                    </span>
                  </div>
                  <div className="col-span-3 text-center">
                    <span
                      className="font-mono text-sm font-medium"
                      style={{ color: entry.pos === 1 ? "#D4AF37" : "#FAFAF5" }}
                    >
                      {entry.time}
                    </span>
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    <span className="text-xs font-mono" style={{ color: "rgba(229,228,226,0.3)" }}>{entry.laps}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-xs" style={{ color: "rgba(229,228,226,0.3)" }}>{entry.date}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              {...fadeIn(0.8)}
              animate={rankInView ? { opacity: 1 } : {}}
              className="text-center text-xs mt-8 flex items-center justify-center gap-2"
              style={{ color: "rgba(229,228,226,0.3)" }}
            >
              <TrendingUp className="w-3 h-3" />
              Actualizado en tiempo real durante las sesiones
            </motion.p>
          </div>
        </section>

        <GoldDivider />

        {/* ════════════════════════════════ GALERÍA ════════════════════════════════ */}
        <section ref={galRef} id="galeria" className="py-28 sm:py-36">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              {...fadeUp()}
              animate={galInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <p className="uppercase tracking-[0.35em] text-xs mb-5" style={{ color: "#D4AF37" }}>
                Galería
              </p>
              <h2 className="v3-serif text-4xl sm:text-5xl lg:text-6xl font-light" style={{ color: "#FAFAF5" }}>
                Viví la <span className="italic" style={{ color: "#D4AF37" }}>Experiencia</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] lg:auto-rows-[220px] gap-px" style={{ background: "rgba(212,175,55,0.1)" }}>
              {galleryImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  {...fadeIn(i * 0.1)}
                  animate={galInView ? { opacity: 1 } : {}}
                  className={`group relative overflow-hidden cursor-pointer ${img.span}`}
                  style={{ background: "#141414" }}
                >
                  {/* Gradient background placeholder */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(${135 + i * 30}deg, rgba(20,20,20,1) 0%, rgba(30,28,24,1) 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 v3-carbon opacity-50" />

                  {/* Center camera icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-8 h-8 transition-all duration-500 group-hover:scale-110 group-hover:opacity-0" style={{ color: "rgba(229,228,226,0.08)" }} />
                  </div>

                  {/* Dark gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 60%)" }}
                  />

                  {/* Gold text on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="v3-serif text-lg font-medium" style={{ color: "#FAFAF5" }}>{img.title}</p>
                    <p className="text-[10px] uppercase tracking-[0.25em] mt-1" style={{ color: "#D4AF37" }}>{img.category}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ════════════════════════════════ CONTACTO ════════════════════════════════ */}
        <section ref={contactRef} id="contacto" className="py-28 sm:py-36">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              {...fadeUp()}
              animate={contactInView ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-20"
            >
              <p className="uppercase tracking-[0.35em] text-xs mb-5" style={{ color: "#D4AF37" }}>
                Contacto
              </p>
              <h2 className="v3-serif text-4xl sm:text-5xl lg:text-6xl font-light" style={{ color: "#FAFAF5" }}>
                ¿Tenés <span className="italic" style={{ color: "#D4AF37" }}>Preguntas?</span>
              </h2>
              <p className="mt-6 text-base max-w-lg mx-auto" style={{ color: "rgba(229,228,226,0.5)" }}>
                Escribinos y te respondemos lo antes posible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              {/* Left - Contact info */}
              <motion.div
                {...fadeLeft(0.2)}
                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                className="lg:col-span-2 space-y-0"
              >
                {contactInfo.map((info, i) => (
                  <div
                    key={info.label}
                    className="flex items-start gap-5 py-7"
                    style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
                  >
                    <info.icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#D4AF37" }} />
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "rgba(229,228,226,0.3)" }}>
                        {info.label}
                      </p>
                      <p className="text-sm" style={{ color: "#FAFAF5" }}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Right - Form */}
              <motion.div
                {...fadeRight(0.4)}
                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                className="lg:col-span-3"
              >
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ border: "1px solid #D4AF37" }}>
                      <Check className="w-6 h-6" style={{ color: "#D4AF37" }} />
                    </div>
                    <h3 className="v3-serif text-2xl font-light mb-3" style={{ color: "#FAFAF5" }}>Mensaje Enviado</h3>
                    <p className="text-sm mb-8" style={{ color: "rgba(229,228,226,0.4)" }}>Te vamos a responder lo antes posible.</p>
                    <button
                      onClick={() => setSent(false)}
                      className="text-xs uppercase tracking-[0.2em] px-6 py-3 transition-all duration-500 hover:bg-[#D4AF37] hover:text-[#0D0D0D]"
                      style={{ border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}
                    >
                      Enviar otro mensaje
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "rgba(229,228,226,0.3)" }}>
                          Nombre *
                        </label>
                        <input name="name" required placeholder="Tu nombre" className="v3-underline-input" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "rgba(229,228,226,0.3)" }}>
                          Email *
                        </label>
                        <input name="email" type="email" required placeholder="tu@email.com" className="v3-underline-input" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "rgba(229,228,226,0.3)" }}>
                          Teléfono
                        </label>
                        <input name="phone" placeholder="+54 XXX XXX-XXXX" className="v3-underline-input" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "rgba(229,228,226,0.3)" }}>
                          Asunto *
                        </label>
                        <input name="subject" required placeholder="Asunto del mensaje" className="v3-underline-input" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "rgba(229,228,226,0.3)" }}>
                        Mensaje *
                      </label>
                      <textarea name="message" required rows={4} placeholder="Contanos en qué podemos ayudarte..." className="v3-underline-textarea" />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 disabled:opacity-40 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                      style={{ background: "#D4AF37", color: "#0D0D0D" }}
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Enviar Mensaje
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <GoldDivider />

        {/* ════════════════════════════════ FOOTER ════════════════════════════════ */}
        <footer className="py-16 text-center">
          <p className="v3-serif text-lg mb-2" style={{ color: "rgba(229,228,226,0.2)" }}>
            eKartTrack
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "rgba(229,228,226,0.15)" }}>
            La experiencia premium de karting eléctrico
          </p>
        </footer>
      </div>
    </>
  );
}
