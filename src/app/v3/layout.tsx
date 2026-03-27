import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar variant="luxury" />
      <main className="flex-1">{children}</main>
      <Footer variant="luxury" />
    </>
  );
}
