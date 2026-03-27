import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavbarFooterWrapper } from "@/components/navbar-footer-wrapper";
import { VersionSwitcher } from "@/components/version-switcher";
import { WhatsappButton } from "@/components/whatsapp-button";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eKartTrack | Pista Recreativa de Kartings Eléctricos",
  description: "Viví la adrenalina de la velocidad en nuestra pista de kartings eléctricos. Experiencia de carrera profesional, segura y ecológica. ¡Reservá tu turno ahora!",
  keywords: ["karting", "karting eléctrico", "pista de karting", "carreras", "eKartTrack", "kartings recreativos"],
  openGraph: {
    title: "eKartTrack | Pista Recreativa de Kartings Eléctricos",
    description: "Viví la adrenalina de la velocidad en nuestra pista de kartings eléctricos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid #222',
            },
          }}
        />
        <NavbarFooterWrapper>
          {children}
        </NavbarFooterWrapper>
        <VersionSwitcher />
        <WhatsappButton />
      </body>
    </html>
  );
}
