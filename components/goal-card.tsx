import { SavingsGoal } from "@/types";
import { formatCurrency, ProgressBar } from "@/components/ui";

export function GoalCard({ goal }: { goal: SavingsGoal }) {
  const progress = (goal.current / goal.target) * 100;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{goal.name}</div>
          <div className="mt-1 text-[12px] text-white/45">Target by {goal.deadline}</div>
        </div>
        <div className="rounded-full px-2 py-1 text-[11px] font-medium text-slate-950" style={{ backgroundColor: goal.accent }}>
          {Math.round(progress)}%
        </div>
      </div>
      <div className="mt-4">
        <ProgressBar value={progress} fillClassName="" />
      </div>
      <div className="mt-2 flex items-center justify-between text-[12px]">
        <span className="text-white">{formatCurrency(goal.current)}</span>
        <span className="text-white/45">{formatCurrency(goal.target)}</span>
      </div>
    </div>
  );
}
