import { PropsWithChildren } from "react";

export function PhoneFrame({ children }: PropsWithChildren) {
  return (
    <div className="relative mx-auto w-[390px] max-w-[calc(100vw-32px)]">
      <div className="absolute inset-0 rounded-[54px] bg-black/30 blur-3xl" />
      <div className="relative rounded-[54px] border border-white/12 bg-[#05070d] p-[10px] shadow-phone">
        <div className="rounded-[44px] bg-gradient-to-b from-white/10 to-white/0 p-[2px]">
          <div className="relative h-[844px] overflow-hidden rounded-[42px] bg-[#040812] max-sm:h-[780px]">
            <div className="pointer-events-none absolute left-1/2 top-3 z-30 h-7 w-36 -translate-x-1/2 rounded-full bg-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
            <div className="absolute inset-0 overflow-hidden rounded-[42px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(126,183,255,0.24),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(247,196,90,0.12),_transparent_28%),linear-gradient(180deg,#08111f_0%,#06101d_55%,#040812_100%)]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
