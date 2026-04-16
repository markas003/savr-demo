import { PropsWithChildren } from "react";

export function MobileScreen({ children }: PropsWithChildren) {
  return (
    <div className="relative flex h-full flex-col text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-44 bg-gradient-to-b from-visaBlue/12 to-transparent" />
      <div className="relative z-10 flex items-center justify-between px-5 pb-2 pt-5 text-[12px] font-medium tracking-[0.18em] text-white/80">
        <span>9:41</span>
        <div className="flex items-center gap-1 text-[10px] tracking-normal">
          <span>5G</span>
          <span className="h-2.5 w-6 rounded-full border border-white/30">
            <span className="block h-full w-4 rounded-full bg-white/80" />
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
