"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Save,
  Building2,
  Globe,
  Layout,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";

const inputClass =
  "px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all w-full";

interface ConfigSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: { key: string; label: string; type?: string; placeholder?: string }[];
}

const sections: ConfigSection[] = [
  {
    title: "Datos del Negocio",
    icon: Building2,
    fields: [
      { key: "businessName", label: "Nombre del Negocio", placeholder: "eKartTrack" },
      { key: "phone", label: "Teléfono", placeholder: "+54 11 1234-5678" },
      { key: "email", label: "Email", type: "email", placeholder: "info@ekarttrack.com" },
      { key: "address", label: "Dirección", placeholder: "Av. Libertador 1234" },
      { key: "whatsappNumber", label: "WhatsApp", placeholder: "5491112345678" },
    ],
  },
  {
    title: "Redes Sociales",
    icon: Globe,
    fields: [
      { key: "instagramUrl", label: "Instagram URL", placeholder: "https://instagram.com/ekarttrack" },
      { key: "facebookUrl", label: "Facebook URL", placeholder: "https://facebook.com/ekarttrack" },
      { key: "tiktokUrl", label: "TikTok URL", placeholder: "https://tiktok.com/@ekarttrack" },
    ],
  },
  {
    title: "Contenido del Sitio",
    icon: Layout,
    fields: [
      { key: "heroTitle", label: "Título Hero", placeholder: "Velocidad sin límites" },
      { key: "heroSubtitle", label: "Subtítulo Hero", placeholder: "La mejor experiencia de karting" },
    ],
  },
  {
    title: "Datos de la Pista",
    icon: MapPin,
    fields: [
      { key: "trackLength", label: "Largo de Pista (m)", placeholder: "450" },
      { key: "trackCurves", label: "Curvas", placeholder: "12" },
      { key: "trackWidth", label: "Ancho de Pista (m)", placeholder: "8" },
      { key: "totalKarts", label: "Total Karts", placeholder: "15" },
      { key: "maxSpeed", label: "Velocidad Máx (km/h)", placeholder: "80" },
      { key: "tandaDuration", label: "Duración Tanda (min)", placeholder: "10" },
    ],
  },
];

export default function SiteConfigTab() {
  const router = useRouter();
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-config");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setConfig(typeof data === "object" && data !== null ? data : {});
    } catch {
      toast.error("Error al cargar configuración");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        toast.success("Configuración guardada");
      } else {
        toast.error("Error al guardar");
      }
    } catch {
      toast.error("Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section, idx) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="rounded-xl bg-card-bg border border-card-border overflow-hidden"
        >
          <div className="p-5 border-b border-white/5 flex items-center gap-2">
            <section.icon className="w-5 h-5 text-neon-cyan" />
            <h3 className="font-bold text-white">{section.title}</h3>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-xs text-muted mb-1 block">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    value={config[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Guardar Configuración
        </button>
      </div>
    </div>
  );
}
