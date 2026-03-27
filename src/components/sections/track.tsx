"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Leaf, Gauge, Wifi, Battery, Volume2 } from "lucide-react";

const features = [
  { icon: Gauge, title: "Alta Velocidad", desc: "Kartings eléctricos que alcanzan hasta 80 km/h con aceleración instantánea." },
  { icon: Shield, title: "Máxima Seguridad", desc: "Barreras de protección, cascos certificados y briefing obligatorio antes de cada tanda." },
  { icon: Leaf, title: "100% Ecológico", desc: "Cero emisiones de CO₂. Energía 100% eléctrica para cuidar el medio ambiente." },
  { icon: Battery, title: "Baterías Premium", desc: "Rendimiento constante durante toda la tanda. Sin pérdida de potencia." },
  { icon: Wifi, title: "Telemetría en Vivo", desc: "Sistema de cronometraje profesional con pantallas en tiempo real." },
  { icon: Volume2, title: "Sin Ruido", desc: "Motores silenciosos que permiten correr en zonas urbanas sin molestias." },
];

export function Track() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pista" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/[0.02] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-semibold text-neon-cyan uppercase tracking-widest">
              La Pista
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-6">
              Circuito Diseñado Para la
              <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                {" "}Máxima Emoción
              </span>
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              Nuestro circuito de 500 metros cuenta con curvas técnicas, rectas de alta velocidad
              y zonas de adelantamiento diseñadas para ofrecer la mejor experiencia de karting eléctrico.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Longitud", value: "500m" },
                { label: "Curvas", value: "12" },
                { label: "Ancho mín.", value: "8m" },
                { label: "Kartings", value: "15" },
              ].map((spec) => (
                <div key={spec.label} className="p-4 rounded-xl bg-card-bg border border-card-border">
                  <div className="text-2xl font-bold text-neon-green">{spec.value}</div>
                  <div className="text-sm text-muted">{spec.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="p-5 rounded-xl bg-card-bg border border-card-border hover:border-neon-cyan/20 transition-all group"
              >
                <feature.icon className="w-8 h-8 text-neon-cyan mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
