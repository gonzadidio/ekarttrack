"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Medal, TrendingUp } from "lucide-react";

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

export function Leaderboard() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/[0.02] to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-neon-purple uppercase tracking-widest">
            Ranking
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            Tabla de
            <span className="bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              {" "}Tiempos
            </span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Los pilotos más rápidos de nuestra pista. ¿Te animás a entrar en el ranking?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-2xl bg-card-bg border border-card-border overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-4 p-4 bg-white/[0.02] border-b border-white/5 text-xs text-muted uppercase tracking-wider">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Piloto</div>
            <div className="col-span-3 text-center">Mejor Tiempo</div>
            <div className="col-span-2 text-center hidden sm:block">Vueltas</div>
            <div className="col-span-2 text-right">Fecha</div>
          </div>

          {topTimes.map((entry, i) => (
            <motion.div
              key={entry.pos}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
              className={`grid grid-cols-12 gap-4 p-4 items-center border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                entry.pos <= 3 ? "bg-white/[0.01]" : ""
              }`}
            >
              <div className="col-span-1 text-center">
                {entry.pos === 1 ? (
                  <Trophy className="w-5 h-5 text-yellow-400 mx-auto" />
                ) : entry.pos === 2 ? (
                  <Medal className="w-5 h-5 text-gray-400 mx-auto" />
                ) : entry.pos === 3 ? (
                  <Medal className="w-5 h-5 text-amber-600 mx-auto" />
                ) : (
                  <span className="text-muted">{entry.pos}</span>
                )}
              </div>
              <div className="col-span-4">
                <span className={`font-semibold ${entry.pos <= 3 ? "text-white" : "text-gray-300"}`}>
                  {entry.name}
                </span>
              </div>
              <div className="col-span-3 text-center">
                <span className={`font-mono font-bold ${
                  entry.pos === 1 ? "text-neon-green neon-text-green" : "text-white"
                }`}>
                  {entry.time}
                </span>
              </div>
              <div className="col-span-2 text-center hidden sm:block">
                <span className="text-sm text-muted">{entry.laps}</span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm text-muted">{entry.date}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted mt-6"
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          Actualizado en tiempo real durante las sesiones
        </motion.p>
      </div>
    </section>
  );
}
