"use client";

import { RecurringAction, RecurringPayment } from "@/types";
import { MerchantBadge, formatCurrency } from "@/components/ui";

export function RecurringCard({
  payment,
  onAction,
}: {
  payment: RecurringPayment;
  onAction: (payment: RecurringPayment, action: RecurringAction) => void;
}) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/6 p-4">
      <div className="flex items-start gap-3">
        <MerchantBadge label={payment.provider} accent={payment.accent} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[15px] font-semibold text-white">{payment.provider}</div>
              <div className="mt-1 text-[12px] text-white/45">
                {payment.category} · {payment.frequency}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-white">{formatCurrency(payment.amount)}</div>
              <div className="text-[11px] text-white/40">{payment.nextBilling}</div>
            </div>
          </div>
          <p className="mt-3 text-[12px] leading-5 text-white/55">{payment.recommendation}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {payment.action === "cancel" ? (
          <button
            type="button"
            onClick={() => onAction(payment, "cancel")}
            className="flex-1 rounded-2xl border border-[#ff8f80]/20 bg-[#ff8f80]/10 px-3 py-2.5 text-sm font-medium text-[#ffbea7]"
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAction(payment, "reduce")}
            className="flex-1 rounded-2xl border border-visaBlue/20 bg-visaBlue/10 px-3 py-2.5 text-sm font-medium text-visaBlueSoft"
          >
            Reduce
          </button>
        )}
        <button
          type="button"
          onClick={() => onAction(payment, payment.action)}
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white"
        >
          View
        </button>
      </div>
    </div>
  );
}
