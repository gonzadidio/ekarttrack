"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Tanda Libre",
    price: "15.000",
    duration: "10 min",
    description: "La experiencia perfecta para una primera vez o una tanda rápida.",
    features: [
      "10 minutos de pista",
      "Casco y equipamiento",
      "Briefing de seguridad",
      "Tiempos por vuelta",
    ],
    popular: false,
    gradient: "from-neon-green to-emerald-400",
  },
  {
    name: "Carrera Grupal",
    price: "22.000",
    duration: "por piloto",
    description: "Clasificación + carrera con largada real. La experiencia completa.",
    features: [
      "Clasificación 5 min",
      "Carrera 10 min",
      "Podio y premiación",
      "Ranking en pantalla",
      "Fotos del evento",
    ],
    popular: true,
    gradient: "from-neon-cyan to-blue-400",
  },
  {
    name: "VIP Experience",
    price: "45.000",
    duration: "por persona",
    description: "El paquete premium definitivo. Pista exclusiva y más.",
    features: [
      "30 min pista exclusiva",
      "Telemetría completa",
      "Video onboard",
      "Champagne en podio",
      "Diploma personalizado",
      "Datos de rendimiento",
    ],
    popular: false,
    gradient: "from-neon-purple to-pink-400",
  },
];

export function Pricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="precios" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-neon-green uppercase tracking-widest">
            Precios
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            Planes Para Cada
            <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
              {" "}Piloto
            </span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Elegí el plan que mejor se adapte a tu nivel de adrenalina.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative p-8 rounded-2xl border transition-all ${
                plan.popular
                  ? "bg-gradient-to-b from-neon-cyan/10 to-card-bg border-neon-cyan/30 scale-105"
                  : "bg-card-bg border-card-border hover:border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-neon-cyan to-neon-green text-black text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" /> MÁS POPULAR
                </div>
              )}

              <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-muted mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-black text-white">${plan.price}</span>
                <span className="text-muted text-sm ml-2">{plan.duration}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-neon-green flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/v2/reservar"
                className={`block text-center py-3 rounded-full font-semibold text-sm transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-neon-cyan to-neon-green text-black hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]"
                    : "border border-white/10 text-white hover:border-neon-green/30 hover:bg-white/5"
                }`}
              >
                Reservar Ahora
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
