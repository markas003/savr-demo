import { BudgetCategory } from "@/types";
import { formatCurrency, ProgressBar } from "@/components/ui";

export function BudgetCard({ budget }: { budget: BudgetCategory }) {
  const progress = (budget.spent / budget.budget) * 100;
  const overspent = budget.spent > budget.budget;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-white">{budget.category}</div>
          <div className="mt-1 text-[12px] text-white/45">
            {formatCurrency(budget.spent)} of {formatCurrency(budget.budget)}
          </div>
        </div>
        <div className={`text-sm font-semibold ${overspent ? "text-[#ffae8d]" : "text-white"}`}>
          {Math.round(progress)}%
        </div>
      </div>
      <div className="mt-3">
        <ProgressBar
          value={progress}
          fillClassName={overspent ? "from-[#ff8b69] to-[#ffbf7f]" : undefined}
        />
      </div>
      <div className="mt-2 text-[11px] text-white/45">
        {overspent ? "Above target. SAVR suggests using current grocery and transport discounts." : "On track"}
      </div>
    </div>
  );
}
