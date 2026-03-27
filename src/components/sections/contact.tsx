"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      if (res.ok) {
        setSent(true);
        toast.success("¡Mensaje enviado correctamente!");
      } else {
        toast.error("Error al enviar el mensaje. Intentá de nuevo.");
      }
    } catch {
      toast.error("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: "Dirección", value: "Ruta X Km XX, Ciudad, Provincia" },
    { icon: Phone, label: "Teléfono", value: "+54 XXX XXX-XXXX" },
    { icon: Mail, label: "Email", value: "info@ekarttrack.com" },
    { icon: Clock, label: "Horarios", value: "Lun-Vie 14-22h | Sáb-Dom 10-23h" },
  ];

  return (
    <section id="contacto" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-semibold text-neon-green uppercase tracking-widest">
            Contacto
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            ¿Tenés
            <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
              {" "}Preguntas?
            </span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            Escribinos y te respondemos lo antes posible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map((info) => (
              <div key={info.label} className="flex items-start gap-4 p-5 rounded-xl bg-card-bg border border-card-border">
                <div className="p-2.5 rounded-lg bg-neon-green/10">
                  <info.icon className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm text-muted mb-1">{info.label}</p>
                  <p className="text-white font-medium">{info.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center p-12 rounded-2xl bg-card-bg border border-neon-green/20 text-center">
                <CheckCircle className="w-16 h-16 text-neon-green mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                <p className="text-muted">Te vamos a responder lo antes posible.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-6 py-2 rounded-full border border-white/10 text-sm text-white hover:bg-white/5 transition-all"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-2xl bg-card-bg border border-card-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-muted mb-2">Nombre *</label>
                    <input
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-muted/50 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Email *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-muted/50 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-muted mb-2">Teléfono</label>
                    <input
                      name="phone"
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-muted/50 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all"
                      placeholder="+54 XXX XXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Asunto *</label>
                    <input
                      name="subject"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-muted/50 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all"
                      placeholder="Asunto del mensaje"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Mensaje *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-muted/50 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all resize-none"
                    placeholder="Contanos en qué podemos ayudarte..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-neon py-4 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold rounded-full text-lg hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
