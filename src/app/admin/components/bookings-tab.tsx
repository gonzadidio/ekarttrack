"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CheckCircle,
  XCircle,
  MessageCircle,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";

interface Booking {
  id: string;
  status: string;
  participants: number;
  notes: string | null;
  createdAt: string;
  pilot: { name: string; email: string; phone: string | null };
  session: { date: string; startTime: string; endTime: string; price: number };
}

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-neon-green bg-neon-green/10",
  CANCELLED: "text-red-400 bg-red-400/10",
  COMPLETED: "text-neon-cyan bg-neon-cyan/10",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
};

const filterOptions = [
  { label: "Todas", value: "" },
  { label: "Pendientes", value: "PENDING" },
  { label: "Confirmadas", value: "CONFIRMED" },
  { label: "Canceladas", value: "CANCELLED" },
];

export default function BookingsTab() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const url = filter
        ? `/api/admin/bookings?status=${filter}`
        : "/api/admin/bookings";
      const res = await fetch(url);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast.success("Reserva actualizada");
        loadBookings();
      } else {
        toast.error("Error al actualizar reserva");
      }
    } catch {
      toast.error("Error al actualizar");
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
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === opt.value
                ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                : "border border-white/10 text-muted hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-bold text-white">
            {filter ? `Reservas ${filterOptions.find((f) => f.value === filter)?.label}` : "Todas las Reservas"}
            <span className="ml-2 text-sm text-muted font-normal">({bookings.length})</span>
          </h3>
        </div>
        {bookings.length === 0 ? (
          <div className="p-12 text-center text-muted">No hay reservas</div>
        ) : (
          <div className="divide-y divide-white/[0.03]">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{b.pilot.name}</p>
                  <p className="text-sm text-muted">
                    {b.pilot.email}
                    {b.pilot.phone && ` \u2022 ${b.pilot.phone}`}
                  </p>
                  {b.notes && (
                    <p className="text-xs text-muted/70 mt-1 italic">
                      &quot;{b.notes}&quot;
                    </p>
                  )}
                </div>
                <div className="text-center px-4">
                  <p className="text-2xl font-black text-neon-cyan">
                    {b.participants}
                  </p>
                  <p className="text-xs text-muted">
                    {b.participants === 1 ? "persona" : "personas"}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="text-white">
                    {new Date(b.session.date).toLocaleDateString("es-AR")} —{" "}
                    {b.session.startTime} a {b.session.endTime}
                  </p>
                  <p className="text-neon-green font-semibold">
                    ${(b.session.price * b.participants).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${statusColors[b.status]}`}
                  >
                    {statusLabels[b.status]}
                  </span>
                  {b.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
                        className="p-1.5 rounded-lg bg-neon-green/10 text-neon-green hover:bg-neon-green/20 transition-all"
                        title="Confirmar"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b.id, "CANCELLED")}
                        className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all"
                        title="Cancelar"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {b.pilot.phone && (
                    <a
                      href={`https://wa.me/${b.pilot.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
