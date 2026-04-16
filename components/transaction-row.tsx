import { Transaction } from "@/types";
import { MerchantBadge, cx, formatCurrency } from "@/components/ui";

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const outgoing = transaction.direction === "debit";

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/4 px-3 py-3">
      <MerchantBadge label={transaction.merchant} accent={transaction.accent} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-white">{transaction.merchant}</div>
        <div className="text-[11px] text-white/45">
          {transaction.category} · {transaction.source}
        </div>
      </div>
      <div className="text-right">
        <div className={cx("text-sm font-semibold", outgoing ? "text-white" : "text-emerald-300")}>
          {outgoing ? "-" : "+"}
          {formatCurrency(transaction.amount)}
        </div>
        <div className="text-[11px] text-white/40">{transaction.timestamp}</div>
      </div>
    </div>
  );
}
