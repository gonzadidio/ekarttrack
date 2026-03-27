"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Plus,
  Edit3,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

interface TurnType {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  defaultPrice: number;
  maxPilots: number;
  color: string | null;
  isActive: boolean;
  sortOrder: number;
  features: string | null;
}

const inputClass =
  "px-4 py-3 rounded-xl bg-black border border-white/10 text-white text-sm focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all w-full";

const emptyForm = {
  name: "",
  description: "",
  durationMin: "",
  defaultPrice: "",
  maxPilots: "10",
  color: "#00ff87",
  sortOrder: "0",
  features: "",
};

export default function TurnTypesTab() {
  const router = useRouter();
  const [turnTypes, setTurnTypes] = useState<TurnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/turn-types");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setTurnTypes(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Error al cargar tipos de tanda");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (tt: TurnType) => {
    setEditingId(tt.id);
    setForm({
      name: tt.name,
      description: tt.description || "",
      durationMin: String(tt.durationMin),
      defaultPrice: String(tt.defaultPrice),
      maxPilots: String(tt.maxPilots),
      color: tt.color || "#00ff87",
      sortOrder: String(tt.sortOrder),
      features: tt.features || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description || null,
      durationMin: parseInt(form.durationMin),
      defaultPrice: parseFloat(form.defaultPrice),
      maxPilots: parseInt(form.maxPilots),
      color: form.color,
      sortOrder: parseInt(form.sortOrder),
      features: form.features || null,
    };

    try {
      if (editingId) {
        const res = await fetch("/api/admin/turn-types", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        if (res.ok) {
          toast.success("Tipo de tanda actualizado");
          setShowForm(false);
          loadData();
        } else {
          toast.error("Error al actualizar");
        }
      } else {
        const res = await fetch("/api/admin/turn-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          toast.success("Tipo de tanda creado");
          setShowForm(false);
          loadData();
        } else {
          toast.error("Error al crear");
        }
      }
    } catch {
      toast.error("Error al guardar tipo de tanda");
    }
  };

  const toggleActive = async (tt: TurnType) => {
    try {
      const res = await fetch("/api/admin/turn-types", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tt.id, isActive: !tt.isActive }),
      });
      if (res.ok) {
        toast.success(tt.isActive ? "Desactivado" : "Activado");
        loadData();
      }
    } catch {
      toast.error("Error al cambiar estado");
    }
  };

  const deleteTurnType = async (id: string) => {
    if (!confirm("¿Desactivar este tipo de tanda?")) return;
    try {
      const res = await fetch(`/api/admin/turn-types?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Tipo de tanda desactivado");
        loadData();
      }
    } catch {
      toast.error("Error al eliminar");
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
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Tipo
        </button>
      </div>

      {/* Create/Edit Form */}
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
              <h3 className="font-bold text-white">
                {editingId ? "Editar Tipo de Tanda" : "Nuevo Tipo de Tanda"}
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1 text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">Nombre</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Tanda Libre"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Duración (min)</label>
                <input
                  type="number"
                  required
                  value={form.durationMin}
                  onChange={(e) => setForm({ ...form, durationMin: e.target.value })}
                  placeholder="10"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Precio ($)</label>
                <input
                  type="number"
                  required
                  value={form.defaultPrice}
                  onChange={(e) => setForm({ ...form, defaultPrice: e.target.value })}
                  placeholder="15000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Máx. Pilotos</label>
                <input
                  type="number"
                  required
                  value={form.maxPilots}
                  onChange={(e) => setForm({ ...form, maxPilots: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-white/10 bg-black cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Orden</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Descripción</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descripción opcional"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Features (una por línea)</label>
              <textarea
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder={"Kart de competición\nCronometraje digital\nCasco incluido"}
                rows={3}
                className={inputClass}
              />
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
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-semibold rounded-full text-sm"
              >
                <Save className="w-4 h-4" />
                {editingId ? "Actualizar" : "Crear"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Turn Types List */}
      <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-bold text-white">Tipos de Tanda</h3>
        </div>
        {turnTypes.length === 0 ? (
          <div className="p-12 text-center text-muted">
            No hay tipos de tanda creados
          </div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {turnTypes.map((tt) => (
              <div
                key={tt.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                  !tt.isActive ? "opacity-50" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tt.color || "#888" }}
                    />
                    <p
                      className="font-semibold"
                      style={{ color: tt.color || "#fff" }}
                    >
                      {tt.name}
                    </p>
                    {!tt.isActive && (
                      <span className="text-xs px-2 py-0.5 rounded-full text-red-400 bg-red-400/10">
                        Inactivo
                      </span>
                    )}
                  </div>
                  {tt.description && (
                    <p className="text-sm text-muted mt-1">{tt.description}</p>
                  )}
                  {tt.features && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tt.features.split("\n").filter(Boolean).map((f, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-muted"
                        >
                          {f.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-white font-bold">{tt.durationMin} min</p>
                    <p className="text-xs text-muted">Duración</p>
                  </div>
                  <div className="text-center">
                    <p className="text-neon-green font-bold">
                      ${tt.defaultPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted">Precio</p>
                  </div>
                  <div className="text-center">
                    <p className="text-neon-cyan font-bold">{tt.maxPilots}</p>
                    <p className="text-xs text-muted">Máx.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(tt)}
                    className={`p-1.5 rounded-lg transition-all ${
                      tt.isActive
                        ? "text-neon-green hover:bg-neon-green/10"
                        : "text-muted hover:bg-white/5"
                    }`}
                    title={tt.isActive ? "Desactivar" : "Activar"}
                  >
                    {tt.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(tt)}
                    className="p-1.5 rounded-lg border border-white/10 text-muted hover:text-white transition-all"
                    title="Editar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTurnType(tt.id)}
                    className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all"
                    title="Desactivar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
