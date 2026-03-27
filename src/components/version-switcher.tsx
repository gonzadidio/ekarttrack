"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Palette } from "lucide-react";

const versions = [
  { href: "/", label: "Cyberpunk", color: "#FF2D78" },
  { href: "/v2", label: "Neon", color: "#00FF87" },
  { href: "/v3", label: "Luxury", color: "#D4AF37" },
];

export function VersionSwitcher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Don't show on admin or reservar pages
  if (pathname.startsWith("/admin") || pathname.includes("/reservar")) return null;

  const current = pathname.startsWith("/v3") ? "/v3" : pathname.startsWith("/v2") ? "/v2" : "/";

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {open && (
        <div className="mb-3 flex flex-col gap-2">
          {versions.filter(v => v.href !== current).map((v) => (
            <Link
              key={v.href}
              href={v.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg backdrop-blur-xl text-sm font-medium text-white transition-all hover:scale-105"
              style={{ background: "rgba(0,0,0,0.8)", border: `1px solid ${v.color}40` }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: v.color, boxShadow: `0 0 10px ${v.color}60` }} />
              {v.label}
            </Link>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl transition-all hover:scale-110"
        style={{
          background: "rgba(0,0,0,0.7)",
          border: `1px solid ${versions.find(v => v.href === current)?.color}50`,
          boxShadow: `0 0 20px ${versions.find(v => v.href === current)?.color}20`,
        }}
        title="Cambiar diseño"
      >
        <Palette className="w-5 h-5" style={{ color: versions.find(v => v.href === current)?.color }} />
      </button>
    </div>
  );
}
