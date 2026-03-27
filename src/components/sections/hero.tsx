"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Zap, Timer, Trophy } from "lucide-react";

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Animated speed lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-neon-green/30 to-transparent speed-line"
            style={{
              top: `${20 + i * 15}%`,
              width: "200px",
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { l: 5, t: 12, d: 0, dur: 5 }, { l: 15, t: 85, d: 1.2, dur: 6 },
          { l: 25, t: 30, d: 2.5, dur: 4.5 }, { l: 35, t: 65, d: 0.8, dur: 7 },
          { l: 45, t: 20, d: 3.1, dur: 5.5 }, { l: 55, t: 75, d: 1.5, dur: 6.5 },
          { l: 65, t: 40, d: 4.2, dur: 4 }, { l: 75, t: 55, d: 0.3, dur: 7.5 },
          { l: 85, t: 15, d: 2.8, dur: 5.2 }, { l: 95, t: 90, d: 5.1, dur: 6.2 },
          { l: 10, t: 50, d: 1.8, dur: 4.8 }, { l: 20, t: 70, d: 3.5, dur: 5.8 },
          { l: 30, t: 10, d: 0.5, dur: 6.8 }, { l: 40, t: 45, d: 4.5, dur: 4.3 },
          { l: 50, t: 80, d: 2.2, dur: 7.2 }, { l: 60, t: 25, d: 5.5, dur: 5.1 },
          { l: 70, t: 60, d: 1.0, dur: 6.1 }, { l: 80, t: 35, d: 3.8, dur: 4.6 },
          { l: 90, t: 50, d: 0.7, dur: 7.8 }, { l: 48, t: 92, d: 2.0, dur: 5.4 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-green/30 rounded-full float"
            style={{
              left: `${p.l}%`,
              top: `${p.t}%`,
              animationDelay: `${p.d}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/20 bg-neon-green/5 mb-8"
        >
          <Zap className="w-4 h-4 text-neon-green" />
          <span className="text-sm text-neon-green">100% Eléctrico &bull; 0% Emisiones</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6"
        >
          <span className="text-white">SENTÍ LA</span>
          <br />
          <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent">
            VELOCIDAD
          </span>
          <br />
          <span className="text-white">ELÉCTRICA</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Pista recreativa de kartings eléctricos. Viví una experiencia de carrera
          profesional con la tecnología más avanzada en un circuito diseñado para la máxima diversión.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/v2/reservar"
            className="btn-neon px-8 py-4 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold rounded-full text-lg hover:shadow-[0_0_40px_rgba(0,255,135,0.3)] transition-all hover:scale-105"
          >
            Reservar Turno
          </Link>
          <a
            href="#experiencias"
            className="px-8 py-4 border border-white/10 text-white font-semibold rounded-full text-lg hover:border-neon-green/30 hover:bg-white/5 transition-all"
          >
            Conocer Más
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-xl mx-auto"
        >
          {[
            { icon: Zap, value: "80", unit: "km/h", label: "Velocidad Máx" },
            { icon: Timer, value: "10", unit: "min", label: "Por Tanda" },
            { icon: Trophy, value: "500", unit: "m", label: "Circuito" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <stat.icon className="w-5 h-5 text-neon-green mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-white">
                {stat.value}
                <span className="text-neon-green text-lg">{stat.unit}</span>
              </div>
              <div className="text-xs text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#experiencias" className="flex flex-col items-center gap-2 text-muted hover:text-neon-green transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
