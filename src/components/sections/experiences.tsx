"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Trophy, Clock, Sparkles, GraduationCap, PartyPopper } from "lucide-react";

const experiences = [
  {
    icon: Clock,
    title: "Tandas Libres",
    description: "Salí a la pista y disfrutá de 10 minutos de adrenalina pura. Ideal para quienes quieren sentir la velocidad sin compromiso.",
    color: "from-neon-green to-emerald-500",
    features: ["10 min de pista", "Casco incluido", "Briefing de seguridad"],
  },
  {
    icon: Trophy,
    title: "Carreras Grupales",
    description: "Competí contra tus amigos en una carrera real con clasificación, largada y podio. La experiencia definitiva de karting.",
    color: "from-neon-cyan to-blue-500",
    features: ["Hasta 10 pilotos", "Clasificación + Carrera", "Podio y premiación"],
  },
  {
    icon: Users,
    title: "Eventos Corporativos",
    description: "Team building único. Organizá un evento inolvidable para tu empresa con carreras, rankings y catering opcional.",
    color: "from-neon-purple to-pink-500",
    features: ["Pista exclusiva", "Ranking en tiempo real", "Personalización total"],
  },
  {
    icon: PartyPopper,
    title: "Cumpleaños",
    description: "Celebrá tu cumpleaños con una fiesta llena de velocidad. Paquetes especiales con todo incluido.",
    color: "from-orange-400 to-red-500",
    features: ["Salón privado", "Torta + bebidas", "2 tandas por invitado"],
  },
  {
    icon: GraduationCap,
    title: "Escuela de Karting",
    description: "Aprendé técnicas de manejo profesional con nuestros instructores certificados. Para todas las edades.",
    color: "from-yellow-400 to-amber-500",
    features: ["Instructor personal", "Técnicas avanzadas", "Certificado"],
  },
  {
    icon: Sparkles,
    title: "Experiencia VIP",
    description: "El paquete premium: pista exclusiva, datos de telemetría, video onboard y champagne en el podio.",
    color: "from-neon-green to-neon-cyan",
    features: ["Pista exclusiva 30 min", "Telemetría completa", "Video onboard"],
  },
];

export function Experiences() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experiencias" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-neon-green uppercase tracking-widest">
            Experiencias
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            Elegí Tu
            <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
              {" "}Aventura
            </span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Desde una tanda rápida hasta un evento completo, tenemos la experiencia perfecta para vos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-hover group relative p-8 rounded-2xl bg-card-bg border border-card-border overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${exp.color} bg-opacity-10 mb-6`}>
                <exp.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-green transition-colors">
                {exp.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                {exp.description}
              </p>

              <ul className="space-y-2">
                {exp.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${exp.color}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
