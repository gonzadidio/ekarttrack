"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function NavbarFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // V2 (original green) and V3 (luxury) have their own layouts
  const isV2 = pathname.startsWith("/v2");
  const isV3 = pathname.startsWith("/v3");

  if (isV2 || isV3) {
    return <>{children}</>;
  }

  // Root (/) uses cyberpunk theme
  return (
    <>
      <Navbar variant="cyberpunk" />
      <main className="flex-1">{children}</main>
      <Footer variant="cyberpunk" />
    </>
  );
}
