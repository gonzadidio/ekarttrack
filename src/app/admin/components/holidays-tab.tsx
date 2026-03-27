"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Plus,
  Trash2,
  CalendarOff,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

interface Holiday {
  id: string;
  date: string;
  name: string;
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;
}

const inputClass =
  "px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all w-full";

export default function HolidaysTab() {
  const router = useRouter();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: "",
    name: "",
    isClosed: true,
    openTime: "",
    closeTime: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/holidays");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setHolidays(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Error al cargar feriados");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: form.date,
          name: form.name,
          isClosed: form.isClosed,
          openTime: !form.isClosed && form.openTime ? form.openTime : null,
          closeTime: !form.isClosed && form.closeTime ? form.closeTime : null,
        }),
      });
      if (res.ok) {
        toast.success("Feriado creado");
        setShowForm(false);
        setForm({ date: "", name: "", isClosed: true, openTime: "", closeTime: "" });
        loadData();
      } else {
        const data = await res.json();
        toast.error(data.error || "Error al crear feriado");
      }
    } catch {
      toast.error("Error al crear feriado");
    }
  };

  const deleteHoliday = async (id: string) => {
    if (!confirm("¿Eliminar este feriado?")) return;
    try {
      const res = await fetch(`/api/admin/holidays?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Feriado eliminado");
        loadData();
      } else {
        toast.error("Error al eliminar");
      }
    } catch {
      toast.error("Error al eliminar feriado");
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
      {/* Header */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Feriado
        </button>
      </div>

      {/* Add Holiday Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-6 rounded-xl bg-card-bg border border-neon-green/20 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Agregar Feriado</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">Fecha</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Nombre</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Día de la Independencia"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Estado</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isClosed: !form.isClosed })}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                    form.isClosed
                      ? "bg-red-400/10 text-red-400 border-red-400/20"
                      : "bg-neon-green/10 text-neon-green border-neon-green/20"
                  }`}
                >
                  {form.isClosed ? "Cerrado" : "Horario Especial"}
                </button>
              </div>
              {!form.isClosed && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted mb-1 block">Apertura</label>
                    <input
                      type="time"
                      value={form.openTime}
                      onChange={(e) => setForm({ ...form, openTime: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted mb-1 block">Cierre</label>
                    <input
                      type="time"
                      value={form.closeTime}
                      onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-white/10 text-muted text-sm hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm"
              >
                Agregar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Holidays List */}
      <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
        <div className="p-5 border-b border-white/5 flex items-center gap-2">
          <CalendarOff className="w-5 h-5 text-neon-purple" />
          <h3 className="font-bold text-white">
            Feriados
            <span className="ml-2 text-sm text-muted font-normal">({holidays.length})</span>
          </h3>
        </div>
        {holidays.length === 0 ? (
          <div className="p-12 text-center text-muted">
            No hay feriados cargados
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {holidays.map((h) => (
              <div
                key={h.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-2xl font-black text-white">
                      {new Date(h.date).getUTCDate()}
                    </p>
                    <p className="text-xs text-muted uppercase">
                      {new Date(h.date).toLocaleDateString("es-AR", {
                        month: "short",
                        timeZone: "UTC",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-white font-medium">{h.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {h.isClosed ? (
                        <span className="text-xs px-2 py-0.5 rounded-full text-red-400 bg-red-400/10">
                          Cerrado
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full text-neon-cyan bg-neon-cyan/10">
                          {h.openTime} - {h.closeTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteHoliday(h.id)}
                  className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
