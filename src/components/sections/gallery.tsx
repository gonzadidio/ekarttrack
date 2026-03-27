"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Camera } from "lucide-react";

const images = [
  { id: 1, title: "Recta Principal", category: "Pista" },
  { id: 2, title: "Curva del Lago", category: "Pista" },
  { id: 3, title: "Zona de Boxes", category: "Instalaciones" },
  { id: 4, title: "Largada Nocturna", category: "Eventos" },
  { id: 5, title: "Podio Grupal", category: "Eventos" },
  { id: 6, title: "Kart Eléctrico Pro", category: "Kartings" },
];

export function Gallery() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState("Todos");

  const categories = ["Todos", "Pista", "Eventos", "Instalaciones", "Kartings"];
  const filtered = filter === "Todos" ? images : images.filter((img) => img.category === filter);

  return (
    <section id="galeria" className="relative py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-neon-green uppercase tracking-widest">
            Galería
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            Viví la
            <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
              {" "}Experiencia
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-neon-green text-black"
                  : "bg-white/5 text-muted hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-card-bg border border-card-border cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                i % 3 === 0 ? "from-neon-green/20 to-neon-cyan/5" :
                i % 3 === 1 ? "from-neon-cyan/20 to-neon-purple/5" :
                "from-neon-purple/20 to-neon-green/5"
              }`} />

              <div className="absolute inset-0 grid-pattern opacity-50" />

              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-12 h-12 text-white/20 group-hover:text-white/40 transition-colors" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-white font-semibold">{img.title}</p>
                <p className="text-neon-green text-sm">{img.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
