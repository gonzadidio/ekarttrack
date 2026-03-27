import { Zap, Mail, Phone, MapPin, Globe, Share2, MessageCircle } from "lucide-react";
import Link from "next/link";

type Variant = "default" | "cyberpunk" | "luxury";

const themes: Record<Variant, {
  bg: string; borderTop: string; topLine: string;
  logoE: string; logoTrack: string;
  accent: string; accentHoverBg: string; accentHoverText: string;
  headingColor: string; mutedColor: string;
  bottomBorder: string;
}> = {
  default: {
    bg: "bg-black", borderTop: "border-white/5", topLine: "via-neon-green/50",
    logoE: "text-neon-green", logoTrack: "text-neon-cyan",
    accent: "text-neon-green", accentHoverBg: "hover:bg-neon-green/10", accentHoverText: "hover:text-neon-green",
    headingColor: "text-white", mutedColor: "text-muted",
    bottomBorder: "border-white/5",
  },
  cyberpunk: {
    bg: "bg-[#050510]", borderTop: "border-[#FF2D78]/10", topLine: "via-[#FF2D78]/50",
    logoE: "text-[#FF2D78]", logoTrack: "text-[#00B4D8]",
    accent: "text-[#FF2D78]", accentHoverBg: "hover:bg-[#FF2D78]/10", accentHoverText: "hover:text-[#FF2D78]",
    headingColor: "text-[#00B4D8]", mutedColor: "text-gray-500",
    bottomBorder: "border-[#FF2D78]/10",
  },
  luxury: {
    bg: "bg-[#0D0D0D]", borderTop: "border-[#D4AF37]/10", topLine: "via-[#D4AF37]/50",
    logoE: "text-[#D4AF37]", logoTrack: "text-[#E5E4E2]",
    accent: "text-[#D4AF37]", accentHoverBg: "hover:bg-[#D4AF37]/10", accentHoverText: "hover:text-[#D4AF37]",
    headingColor: "text-[#D4AF37]", mutedColor: "text-[#888]",
    bottomBorder: "border-[#D4AF37]/10",
  },
};

export function Footer({ variant = "default" }: { variant?: Variant }) {
  const t = themes[variant];

  return (
    <footer className={`relative ${t.bg} border-t ${t.borderTop}`}>
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${t.topLine} to-transparent`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className={`w-7 h-7 ${t.accent}`} />
              <span className={`text-xl font-bold ${variant === "luxury" ? "tracking-wider" : ""}`}>
                <span className={t.logoE}>e</span>
                <span className="text-white">Kart</span>
                <span className={t.logoTrack}>Track</span>
              </span>
            </div>
            <p className={`text-sm ${t.mutedColor} leading-relaxed ${variant === "cyberpunk" ? "font-mono text-xs" : ""}`}>
              La mejor experiencia de karting eléctrico. Velocidad, adrenalina y diversión en un entorno 100% ecológico.
            </p>
            <div className="flex gap-3">
              {[Globe, Share2, MessageCircle].map((Icon, i) => (
                <a key={i} href="#" className={`p-2 bg-white/5 ${t.accentHoverBg} ${t.accentHoverText} transition-all ${
                  variant === "cyberpunk" ? "rounded-none" : variant === "luxury" ? "rounded-none border border-white/10" : "rounded-lg"
                }`}
                  style={variant === "cyberpunk" ? { clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" } : undefined}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-sm font-semibold ${t.headingColor} uppercase tracking-wider mb-4 ${
              variant === "cyberpunk" ? "font-mono" : variant === "luxury" ? "tracking-[0.3em]" : ""
            }`}>Navegación</h3>
            <ul className="space-y-3">
              {["Inicio", "Experiencias", "La Pista", "Precios", "Galería", "Contacto"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(" ", "-")}`} className={`text-sm ${t.mutedColor} ${t.accentHoverText} transition-colors ${
                    variant === "cyberpunk" ? "font-mono text-xs uppercase tracking-wider" : ""
                  }`}>
                    {variant === "cyberpunk" ? `> ${item}` : item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold ${t.headingColor} uppercase tracking-wider mb-4 ${
              variant === "cyberpunk" ? "font-mono" : variant === "luxury" ? "tracking-[0.3em]" : ""
            }`}>Servicios</h3>
            <ul className="space-y-3">
              {["Tandas Libres", "Carreras Grupales", "Eventos Corporativos", "Cumpleaños", "Escuela de Karting"].map((item) => (
                <li key={item}>
                  <span className={`text-sm ${t.mutedColor} ${variant === "cyberpunk" ? "font-mono text-xs" : ""}`}>
                    {variant === "cyberpunk" ? `// ${item}` : item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-sm font-semibold ${t.headingColor} uppercase tracking-wider mb-4 ${
              variant === "cyberpunk" ? "font-mono" : variant === "luxury" ? "tracking-[0.3em]" : ""
            }`}>Contacto</h3>
            <ul className="space-y-3">
              <li className={`flex items-center gap-3 text-sm ${t.mutedColor}`}>
                <MapPin className={`w-4 h-4 ${t.accent} flex-shrink-0`} />
                <span>Ruta X Km XX, Ciudad, Provincia</span>
              </li>
              <li className={`flex items-center gap-3 text-sm ${t.mutedColor}`}>
                <Phone className={`w-4 h-4 ${t.accent} flex-shrink-0`} />
                <span>+54 XXX XXX-XXXX</span>
              </li>
              <li className={`flex items-center gap-3 text-sm ${t.mutedColor}`}>
                <Mail className={`w-4 h-4 ${t.accent} flex-shrink-0`} />
                <span>info@ekarttrack.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${t.bottomBorder} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <p className={`text-xs ${t.mutedColor} ${variant === "cyberpunk" ? "font-mono" : ""}`}>
            &copy; {new Date().getFullYear()} eKartTrack. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/admin/login" className={`text-xs ${t.mutedColor} opacity-50 hover:opacity-100 transition-opacity`}>
              Admin
            </Link>
            <a href="#" className={`text-xs ${t.mutedColor} hover:text-white transition-colors`}>
              Términos y Condiciones
            </a>
            <a href="#" className={`text-xs ${t.mutedColor} hover:text-white transition-colors`}>
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
