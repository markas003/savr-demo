import { SavrDemo } from "@/components/savr-demo";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(76,141,255,0.18),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(247,196,90,0.1),_transparent_22%),linear-gradient(180deg,#03060f_0%,#06101d_55%,#03060f_100%)] px-6 py-10">
      <div className="absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.08]" />
      <div className="absolute left-1/2 top-24 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-visaBlue/10 blur-[120px]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center">
        <SavrDemo />
      </div>
    </main>
  );
}
