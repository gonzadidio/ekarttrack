"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Bienvenido, ${data.admin.name}`);
        router.push("/admin");
      } else {
        toast.error(data.error || "Error al iniciar sesión");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-neon-green" />
            <span className="text-2xl font-bold">
              <span className="text-neon-green">e</span>
              <span className="text-white">Kart</span>
              <span className="text-neon-cyan">Track</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-muted text-sm mt-2">Ingresá tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 p-8 rounded-2xl bg-card-bg border border-card-border">
          <div>
            <label className="block text-sm text-muted mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-muted/50 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all"
                placeholder="admin@ekarttrack.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-black border border-white/10 text-white placeholder-muted/50 focus:border-neon-green/50 focus:outline-none focus:ring-1 focus:ring-neon-green/20 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-neon py-3 bg-gradient-to-r from-neon-green to-neon-cyan text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,255,135,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar Sesión"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
