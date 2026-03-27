import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar variant="default" />
      <main className="flex-1">{children}</main>
      <Footer variant="default" />
    </>
  );
}
