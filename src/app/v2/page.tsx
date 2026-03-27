import { Hero } from "@/components/sections/hero";
import { Experiences } from "@/components/sections/experiences";
import { Track } from "@/components/sections/track";
import { Pricing } from "@/components/sections/pricing";
import { Leaderboard } from "@/components/sections/leaderboard";
import { Gallery } from "@/components/sections/gallery";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Experiences />
      <Track />
      <Pricing />
      <Leaderboard />
      <Gallery />
      <Contact />
    </>
  );
}
