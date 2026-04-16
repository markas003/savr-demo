"use client";

import { PropsWithChildren, ReactNode } from "react";

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function GlassCard({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-white/10 bg-white/6 p-4 shadow-panel backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <div className="mb-1 text-[10px] uppercase tracking-[0.28em] text-white/40">
            {eyebrow}
          </div>
        ) : null}
        <h3 className="text-[15px] font-semibold tracking-tight text-white">{title}</h3>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function ScreenContainer({
  children,
  padded = true,
}: PropsWithChildren<{ padded?: boolean }>) {
  return (
    <div className={cx("flex min-h-full flex-col", padded && "px-4 pb-28 pt-3")}>
      {children}
    </div>
  );
}

export function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "gold" | "slate";
}) {
  const toneMap = {
    blue: "border-visaBlue/30 bg-visaBlue/12",
    gold: "border-visaGold/30 bg-visaGold/12",
    slate: "border-white/10 bg-white/5",
  };

  return (
    <div className={cx("rounded-2xl border px-3 py-3", toneMap[tone])}>
      <div className="text-[11px] text-white/55">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  fillClassName,
}: {
  value: number;
  className?: string;
  fillClassName?: string;
}) {
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className={cx("h-full rounded-full bg-gradient-to-r from-visaBlue to-visaBlueSoft", fillClassName)}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export function MerchantBadge({
  label,
  accent,
  size = "md",
}: {
  label: string;
  accent: string;
  size?: "sm" | "md";
}) {
  const initials = label
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const sizeClasses = size === "sm" ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm";

  return (
    <div
      className={cx(
        "flex items-center justify-center rounded-2xl font-semibold text-slate-950 shadow-floating",
        sizeClasses,
      )}
      style={{ background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.95))` }}
    >
      {initials}
    </div>
  );
}
