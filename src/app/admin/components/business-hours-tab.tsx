"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Save, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface BusinessHour {
  id?: string;
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Display order: Monday (1) through Sunday (0)
const displayOrder = [1, 2, 3, 4, 5, 6, 0];

const inputClass =
  "px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all w-full";

export default function BusinessHoursTab() {
  const router = useRouter();
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/business-hours");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      const fetched: BusinessHour[] = Array.isArray(data) ? data : [];

      // Ensure all 7 days exist
      const allDays: BusinessHour[] = [];
      for (let i = 0; i < 7; i++) {
        const existing = fetched.find((h) => h.dayOfWeek === i);
        allDays.push(
          existing || {
            dayOfWeek: i,
            isOpen: i >= 1 && i <= 5, // Mon-Fri open by default
            openTime: "10:00",
            closeTime: "23:00",
          }
        );
      }
      setHours(allDays);
    } catch {
      toast.error("Error al cargar horarios");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateDay = (dayOfWeek: number, field: keyof BusinessHour, value: unknown) => {
    setHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hours),
      });
      if (res.ok) {
        toast.success("Horarios guardados");
        loadData();
      } else {
        toast.error("Error al guardar");
      }
    } catch {
      toast.error("Error al guardar horarios");
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
      <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <Clock className="w-5 h-5 text-neon-cyan" />
          <h3 className="font-bold text-white">Horarios de Atención</h3>
        </div>
        <div className="p-5 space-y-3">
          {displayOrder.map((dayIdx, i) => {
            const day = hours.find((h) => h.dayOfWeek === dayIdx);
            if (!day) return null;

            return (
              <motion.div
                key={dayIdx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all ${
                  day.isOpen
                    ? "border-card-border bg-black/30"
                    : "border-white/5 bg-black/10 opacity-50"
                }`}
              >
                {/* Day Name */}
                <div className="w-28 flex-shrink-0">
                  <p className={`font-semibold ${day.isOpen ? "text-white" : "text-muted"}`}>
                    {dayNames[dayIdx]}
                  </p>
                </div>

                {/* Open/Closed Toggle */}
                <button
                  onClick={() => updateDay(dayIdx, "isOpen", !day.isOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    day.isOpen
                      ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                      : "bg-red-400/10 text-red-400 border border-red-400/20"
                  }`}
                >
                  {day.isOpen ? "Abierto" : "Cerrado"}
                </button>

                {/* Time Inputs */}
                {day.isOpen && (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1">
                      <label className="text-xs text-muted mb-1 block">Apertura</label>
                      <input
                        type="time"
                        value={day.openTime || "10:00"}
                        onChange={(e) => updateDay(dayIdx, "openTime", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <span className="text-muted mt-5">a</span>
                    <div className="flex-1">
                      <label className="text-xs text-muted mb-1 block">Cierre</label>
                      <input
                        type="time"
                        value={day.closeTime || "23:00"}
                        onChange={(e) => updateDay(dayIdx, "closeTime", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

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
          Guardar Horarios
        </button>
      </div>
    </div>
  );
}
