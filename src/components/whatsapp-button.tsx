"use client";

import { MessageCircle } from "lucide-react";
import { useSiteConfig } from "@/lib/use-site-config";

export function WhatsappButton() {
  const { config } = useSiteConfig();
  const phone = config.whatsappNumber || "54XXXXXXXXXX";

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent("Hola! Quiero info sobre eKartTrack")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)]"
      style={{ background: "#25D366" }}
      title="Chateá con nosotros por WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" fill="white" />
    </a>
  );
}
