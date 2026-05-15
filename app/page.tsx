import { SavrDemo } from "@/components/savr-demo";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#03060f_0%,#06101d_55%,#03060f_100%)]">
      <div className="absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.08]" />
      <div className="relative">
        <SavrDemo />
      </div>
    </main>
  );
}
