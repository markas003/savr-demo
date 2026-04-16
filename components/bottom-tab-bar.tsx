"use client";

import type { ReactNode } from "react";

import { TabId } from "@/types";
import { cx } from "@/components/ui";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <path d="M4 11.5L12 5l8 6.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 10.5V19h11v-8.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19v-4.5h4V19" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DiscountsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <path d="M7 5.5h8.5a3 3 0 0 1 3 3V17a2 2 0 0 1-2 2H8.5a3 3 0 0 1-3-3V7.5a2 2 0 0 1 2-2Z" strokeLinecap="round" />
      <path d="M9.25 9.25c.55-.58 1.32-.9 2.15-.9 1.55 0 2.85 1.08 2.85 2.45 0 1.18-.88 1.96-2.3 2.36l-.94.27c-.92.26-1.36.61-1.36 1.18 0 .71.67 1.2 1.66 1.2.95 0 1.72-.39 2.28-1.1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 7.4v9.2" strokeLinecap="round" />
    </svg>
  );
}

function SavingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <path d="M6 13.5c0-3.6 2.73-6.5 6.1-6.5 2.76 0 5.09 1.8 5.8 4.3.7.1 1.6.7 1.6 1.9 0 1.3-.9 2.3-2.3 2.3h-1.1c-.5 1.5-1.9 2.5-3.6 2.5H10c-2.2 0-4-1.8-4-4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18v1.2a.8.8 0 0 0 .8.8h2.4a.8.8 0 0 0 .8-.8V18" strokeLinecap="round" />
      <path d="M12 6V4.7" strokeLinecap="round" />
      <path d="M10.1 11.6c.38-.45 1-.73 1.65-.73 1.03 0 1.87.68 1.87 1.57 0 .76-.55 1.24-1.47 1.5l-.63.18c-.63.18-.94.42-.94.83 0 .48.45.81 1.13.81.64 0 1.17-.27 1.56-.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RecurringIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[18px] w-[18px]">
      <path d="M7 7a7 7 0 0 1 11 2" strokeLinecap="round" />
      <path d="M18 9V5.5H14.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 17a7 7 0 0 1-11-2" strokeLinecap="round" />
      <path d="M6 15v3.5h3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const tabs: Array<{ id: TabId; label: string; icon: ReactNode }> = [
  { id: "home", label: "Home", icon: <HomeIcon /> },
  { id: "discounts", label: "Discounts", icon: <DiscountsIcon /> },
  { id: "savings", label: "Savings", icon: <SavingsIcon /> },
  { id: "recurring", label: "Recurring", icon: <RecurringIcon /> },
];

export function BottomTabBar({
  activeTab,
  onChange,
}: {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}) {
  return (
    <div className="absolute inset-x-3 bottom-3 z-30 rounded-[30px] border border-white/10 bg-[#0a1223]/90 p-2 shadow-floating backdrop-blur-2xl">
      <div className="grid grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cx(
                "rounded-2xl px-2 py-2.5 text-center transition duration-200",
                active ? "bg-white/12 text-white" : "text-white/45 hover:bg-white/6 hover:text-white/80",
              )}
            >
              <div className="flex justify-center leading-none">{tab.icon}</div>
              <div className="mt-1 text-[11px] font-medium">{tab.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
