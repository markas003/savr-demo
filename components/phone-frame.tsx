import { PropsWithChildren } from "react";

export function PhoneFrame({ children }: PropsWithChildren) {
  return (
    <div className="relative mx-auto aspect-[390/844] h-[min(844px,100vh)] max-h-[844px] max-w-[calc(100vw-32px)]">
      <div className="absolute inset-0 rounded-[54px] bg-black/30 blur-3xl" />
      <div className="relative h-full rounded-[54px] border border-white/12 bg-[#05070d] p-[10px] shadow-phone">
        <div className="h-full rounded-[44px] bg-white p-[2px]">
          <div className="relative h-full overflow-hidden rounded-[42px] bg-white">
            <div className="pointer-events-none absolute left-1/2 top-3 z-30 h-7 w-36 -translate-x-1/2 rounded-full bg-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
            <div className="absolute inset-0 overflow-hidden rounded-[42px] border border-white/10 bg-white">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
