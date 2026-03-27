"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#experiencias", label: "Experiencias" },
  { href: "#pista", label: "La Pista" },
  { href: "#precios", label: "Precios" },
  { href: "#galeria", label: "Galería" },
  { href: "#contacto", label: "Contacto" },
];

type Variant = "default" | "cyberpunk" | "luxury";

const themes: Record<Variant, {
  accent1: string; accent2: string; accentGlow: string;
  logoE: string; logoTrack: string; subtitle: string;
  btnBg: string; btnText: string; btnShadow: string;
  hoverText: string; underlineGrad: string;
  scrolledBg: string; scrolledBorder: string;
  mobileBg: string; mobileBorder: string;
}> = {
  default: {
    accent1: "text-neon-green", accent2: "text-neon-cyan", accentGlow: "bg-neon-green/20",
    logoE: "text-neon-green neon-text-green", logoTrack: "text-neon-cyan neon-text-cyan",
    subtitle: "text-muted",
    btnBg: "bg-gradient-to-r from-neon-green to-neon-cyan", btnText: "text-black",
    btnShadow: "hover:shadow-[0_0_30px_rgba(0,255,135,0.3)]",
    hoverText: "hover:text-neon-green",
    underlineGrad: "from-neon-green to-neon-cyan",
    scrolledBg: "bg-black/80", scrolledBorder: "border-white/5",
    mobileBg: "bg-black/95", mobileBorder: "border-white/5",
  },
  cyberpunk: {
    accent1: "text-[#FF2D78]", accent2: "text-[#00B4D8]", accentGlow: "bg-[#FF2D78]/20",
    logoE: "text-[#FF2D78]", logoTrack: "text-[#00B4D8]",
    subtitle: "text-[#FF2D78]/60",
    btnBg: "bg-gradient-to-r from-[#FF2D78] to-[#00B4D8]", btnText: "text-black",
    btnShadow: "hover:shadow-[0_0_30px_rgba(255,45,120,0.4)]",
    hoverText: "hover:text-[#FF2D78]",
    underlineGrad: "from-[#FF2D78] to-[#00B4D8]",
    scrolledBg: "bg-[#050510]/90", scrolledBorder: "border-[#FF2D78]/10",
    mobileBg: "bg-[#050510]/95", mobileBorder: "border-[#FF2D78]/10",
  },
  luxury: {
    accent1: "text-[#D4AF37]", accent2: "text-[#D4AF37]", accentGlow: "bg-[#D4AF37]/20",
    logoE: "text-[#D4AF37]", logoTrack: "text-[#E5E4E2]",
    subtitle: "text-[#D4AF37]/50",
    btnBg: "bg-[#D4AF37]", btnText: "text-black",
    btnShadow: "hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]",
    hoverText: "hover:text-[#D4AF37]",
    underlineGrad: "from-[#D4AF37] to-[#F5D061]",
    scrolledBg: "bg-[#0D0D0D]/90", scrolledBorder: "border-[#D4AF37]/10",
    mobileBg: "bg-[#0D0D0D]/95", mobileBorder: "border-[#D4AF37]/10",
  },
};

export function Navbar({ variant = "default" }: { variant?: Variant }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = themes[variant];
  const bookingUrl = variant === "cyberpunk" ? "/reservar" : variant === "luxury" ? "/v3/reservar" : "/v2/reservar";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? `${t.scrolledBg} backdrop-blur-xl border-b ${t.scrolledBorder}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Zap className={`w-8 h-8 ${t.accent1} transition-all group-hover:scale-110`} />
              <div className={`absolute inset-0 w-8 h-8 ${t.accentGlow} blur-xl rounded-full transition-all`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">
                <span className={t.logoE}>e</span>
                <span className="text-white">Kart</span>
                <span className={t.logoTrack}>Track</span>
              </span>
              <span className={`text-[10px] ${t.subtitle} tracking-[0.2em] uppercase -mt-1`}>
                {variant === "cyberpunk" ? "Cyber Racing" : variant === "luxury" ? "Premium Racing" : "Electric Racing"}
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors group ${
                  variant === "cyberpunk" ? "uppercase tracking-wider text-xs font-mono" :
                  variant === "luxury" ? "tracking-wide" : ""
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r ${t.underlineGrad} group-hover:w-3/4 transition-all duration-300`} />
              </a>
            ))}
            <Link
              href={bookingUrl}
              className={`ml-4 btn-neon px-6 py-2.5 ${t.btnBg} ${t.btnText} font-semibold text-sm ${t.btnShadow} transition-all ${
                variant === "cyberpunk" ? "rounded-none uppercase tracking-wider font-mono clip-path-[polygon(8px_0,100%_0,calc(100%-8px)_100%,0_100%)]" :
                variant === "luxury" ? "rounded-none border border-[#D4AF37] bg-transparent !text-[#D4AF37] hover:bg-[#D4AF37] hover:!text-black tracking-wider" :
                "rounded-full"
              }`}
              style={variant === "cyberpunk" ? { clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" } : undefined}
            >
              {variant === "cyberpunk" ? "[ RESERVAR ]" : "Reservar Ahora"}
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden ${t.mobileBg} backdrop-blur-xl border-t ${t.mobileBorder}`}
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg text-gray-300 ${t.hoverText} transition-colors ${
                    variant === "cyberpunk" ? "uppercase font-mono tracking-wider text-sm" : ""
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={bookingUrl}
                onClick={() => setIsOpen(false)}
                className={`block text-center btn-neon px-6 py-3 ${t.btnBg} ${t.btnText} font-semibold ${
                  variant === "cyberpunk" ? "uppercase font-mono tracking-wider" :
                  variant === "luxury" ? "bg-transparent border border-[#D4AF37] !text-[#D4AF37]" :
                  "rounded-full"
                }`}
                style={variant === "cyberpunk" ? { clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" } : undefined}
              >
                {variant === "cyberpunk" ? "[ RESERVAR ]" : "Reservar Ahora"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
