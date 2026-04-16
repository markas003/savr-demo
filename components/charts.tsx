import { BudgetCategory } from "@/types";
import { formatCurrency } from "@/components/ui";

export function SpendBars({ budgets }: { budgets: BudgetCategory[] }) {
  const max = Math.max(...budgets.map((item) => item.spent), 1);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-white">Spend by category</div>
      <div className="mt-4 space-y-3">
        {budgets.slice(0, 5).map((item) => (
          <div key={item.id}>
            <div className="mb-1 flex items-center justify-between text-[12px]">
              <span className="text-white/60">{item.category}</span>
              <span className="text-white">{formatCurrency(item.spent)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(item.spent / max) * 100}%`,
                  background: `linear-gradient(90deg, ${item.accent}, rgba(255,255,255,0.95))`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SavingsDonut({
  saved,
  remaining,
}: {
  saved: number;
  remaining: number;
}) {
  const total = saved + remaining;
  const angle = total === 0 ? 0 : (saved / total) * 360;
  const percentage = total === 0 ? 0 : Math.round((saved / total) * 100);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-white">Monthly SAVR impact</div>
      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative h-28 w-28 rounded-full"
          style={{
            background: `conic-gradient(#7eb7ff 0deg ${angle}deg, rgba(255,255,255,0.08) ${angle}deg 360deg)`,
          }}
        >
          <div className="absolute inset-3 rounded-full bg-[#09111f]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-white">{percentage}%</span>
            <span className="text-[11px] text-white/45">captured</span>
          </div>
        </div>
        <div className="space-y-3 text-[12px] text-white/60">
          <div>
            <div className="text-white">Saved this month</div>
            <div className="mt-0.5 text-emerald-300">{formatCurrency(saved)}</div>
          </div>
          <div>
            <div className="text-white">Missed opportunities</div>
            <div className="mt-0.5 text-[#ffbf7f]">{formatCurrency(remaining)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
