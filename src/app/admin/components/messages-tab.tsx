"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesTab() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Error al cargar mensajes");
    } finally {
      setLoading(false);
    }
  };

  const markMessageRead = async (id: string) => {
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: true }),
      });
      toast.success("Marcado como leído");
      loadMessages();
    } catch {
      toast.error("Error al marcar como leído");
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
    <div className="rounded-xl bg-card-bg border border-card-border overflow-hidden">
      <div className="p-5 border-b border-white/5">
        <h3 className="font-bold text-white">
          Mensajes de Contacto
          <span className="ml-2 text-sm text-muted font-normal">
            ({messages.filter((m) => !m.read).length} sin leer)
          </span>
        </h3>
      </div>
      {messages.length === 0 ? (
        <div className="p-12 text-center text-muted">No hay mensajes</div>
      ) : (
        <div className="divide-y divide-white/[0.03]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-5 ${!m.read ? "bg-neon-green/[0.02]" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!m.read && (
                      <div className="w-2 h-2 rounded-full bg-neon-green" />
                    )}
                    <p className="text-white font-medium">{m.name}</p>
                    <span className="text-xs text-muted">{m.email}</span>
                    {m.phone && (
                      <span className="text-xs text-muted">\u2022 {m.phone}</span>
                    )}
                  </div>
                  <p className="text-sm text-neon-green font-medium mb-1">
                    {m.subject}
                  </p>
                  <p className="text-sm text-muted">{m.message}</p>
                  <p className="text-xs text-muted/50 mt-2">
                    {new Date(m.createdAt).toLocaleString("es-AR")}
                  </p>
                </div>
                {!m.read && (
                  <button
                    onClick={() => markMessageRead(m.id)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 text-muted hover:text-white transition-all"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Marcar leído
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
