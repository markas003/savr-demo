import { Account } from "@/types";
import { formatCurrency } from "@/components/ui";

export function BalanceCard({
  totalBalance,
  monthlySaved,
  accounts,
}: {
  totalBalance: number;
  monthlySaved: number;
  accounts: Account[];
}) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(76,141,255,0.26),rgba(9,16,36,0.92)_58%,rgba(247,196,90,0.16))] p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.28em] text-white/55">SAVR net overview</div>
          <div className="mt-3 text-[36px] font-semibold tracking-tight text-white">
            {formatCurrency(totalBalance)}
          </div>
          <div className="mt-1 text-sm text-emerald-300">+{formatCurrency(monthlySaved)} saved this month</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-right">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/45">Visa ready</div>
          <div className="mt-1 text-sm font-semibold text-white">5 accounts linked</div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {accounts.slice(0, 4).map((account) => (
          <div key={account.id} className="rounded-2xl border border-white/10 bg-black/15 px-3 py-3">
            <div className="text-[11px] text-white/55">{account.name}</div>
            <div className="mt-1 text-sm font-semibold text-white">{formatCurrency(account.balance)}</div>
            <div className="mt-0.5 text-[11px] text-white/40">{account.type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
