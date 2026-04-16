"use client";

import { cx } from "@/components/ui";

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cx(
              "rounded-[14px] px-3 py-2.5 text-sm transition duration-200",
              active
                ? "bg-gradient-to-r from-visaBlue to-visaBlueSoft text-slate-950"
                : "text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
