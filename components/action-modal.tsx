"use client";

import { RecurringAction, RecurringPayment } from "@/types";
import { formatCurrency } from "@/components/ui";

export function ActionModal({
  item,
  action,
  onClose,
}: {
  item: RecurringPayment | null;
  action: RecurringAction | null;
  onClose: () => void;
}) {
  if (!item || !action) {
    return null;
  }

  const isCancel = action === "cancel";

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/55 backdrop-blur-sm">
      <div className="w-full animate-rise rounded-t-[32px] border border-white/10 bg-[#0b1220] px-4 pb-8 pt-3 shadow-phone">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/15" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">
              {isCancel ? "Cancel subscription" : "Reduce recurring cost"}
            </div>
            <h3 className="mt-2 text-xl font-semibold text-white">{item.provider}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70"
          >
            Close
          </button>
        </div>

        <div className="mt-5 rounded-[26px] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm text-white/60">
            <span>Current payment</span>
            <span className="font-semibold text-white">{formatCurrency(item.amount)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-white/60">
            <span>Next billing</span>
            <span className="font-medium text-white">{item.nextBilling}</span>
          </div>
          {item.estimatedSavings ? (
            <div className="mt-2 flex items-center justify-between text-sm text-white/60">
              <span>Estimated savings</span>
              <span className="font-medium text-emerald-300">{formatCurrency(item.estimatedSavings)}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-[26px] border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-medium text-white">
            {isCancel ? "What SAVR would do" : "Recommended lower-cost option"}
          </div>
          <p className="mt-2 text-[13px] leading-6 text-white/60">{item.recommendation}</p>
          {item.statusNote ? (
            <div className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[12px] text-emerald-300">
              {item.statusNote}
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white"
            onClick={onClose}
          >
            Keep current
          </button>
          <button
            type="button"
            className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
              isCancel ? "bg-[#ffad95] text-slate-950" : "bg-white text-slate-950"
            }`}
            onClick={onClose}
          >
            {isCancel ? "Confirm cancel demo" : "Apply demo suggestion"}
          </button>
        </div>
      </div>
    </div>
  );
}
