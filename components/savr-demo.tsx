"use client";

import { useEffect, useMemo, useState } from "react";

import { ActionModal } from "@/components/action-modal";
import { BalanceCard } from "@/components/balance-card";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { BudgetCard } from "@/components/budget-card";
import { GoalCard } from "@/components/goal-card";
import { OfferCard } from "@/components/offer-card";
import { OfferDetailModal } from "@/components/offer-detail-modal";
import { PhoneFrame } from "@/components/phone-frame";
import { MobileScreen } from "@/components/mobile-screen";
import { RecurringCard } from "@/components/recurring-card";
import { SegmentedControl } from "@/components/segmented-control";
import { SpendBars, SavingsDonut } from "@/components/charts";
import { GlassCard, ScreenContainer, SectionHeader, StatChip, formatCurrency } from "@/components/ui";
import { appData } from "@/data/mock-data";
import { Offer, RecurringAction, RecurringPayment, TabId } from "@/types";
import { TransactionRow } from "@/components/transaction-row";

type EntryStage = "passcode" | "app";

function SavrWordmark({ centered = false }: { centered?: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}>
      <svg viewBox="0 0 132 96" className="h-16 w-[88px]" aria-hidden="true">
        <defs>
          <linearGradient id="savrBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f6fff" />
            <stop offset="100%" stopColor="#1140b3" />
          </linearGradient>
          <linearGradient id="savrGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd347" />
            <stop offset="100%" stopColor="#f2a900" />
          </linearGradient>
        </defs>
        <g transform="translate(8 8)">
          <path
            d="M16 16c0-6.4 7.1-10.3 12.5-7l45 27.3c5 3 5 10.2 0 13.2l-45 27.2C23.1 80 16 76.1 16 69.6V16Z"
            fill="url(#savrBlue)"
            transform="rotate(-33 44 40)"
          />
          <path
            d="M16 16c0-6.4 7.1-10.3 12.5-7l45 27.3c5 3 5 10.2 0 13.2l-45 27.2C23.1 80 16 76.1 16 69.6V16Z"
            fill="url(#savrGold)"
            transform="rotate(33 42 40)"
          />
          <path d="M22 52 82 50 39 78c-8 5.2-18.3-1.1-17-10.6Z" fill="rgba(0,0,0,0.16)" />
        </g>
      </svg>
      <div className="text-[52px] font-bold leading-none tracking-[-0.06em]">
        <span className="bg-gradient-to-b from-[#2d79ff] to-[#1140b3] bg-clip-text text-transparent">SAV</span>
        <span className="bg-gradient-to-b from-[#ffd347] to-[#f2a900] bg-clip-text text-transparent">R</span>
      </div>
    </div>
  );
}

function ProfileSheet({
  open,
  onClose,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  if (!open) {
    return null;
  }

  const sections = [
    "Profile",
    "Connected accounts",
    "Cards and payments",
    "Notifications",
    "Security",
    "Help center",
    "Legal",
  ];

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/55 backdrop-blur-sm">
      <div className="w-full animate-rise rounded-t-[32px] border border-white/10 bg-[#0b1220] px-4 pb-8 pt-3 shadow-phone">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/15" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-visaBlueSoft to-visaGold text-lg font-semibold text-slate-950">
              MS
            </div>
            <div>
              <div className="text-lg font-semibold text-white">Marco S.</div>
              <div className="text-sm text-white/50">Student plan · Verified</div>
            </div>
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
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Account overview</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-[11px] text-white/45">Plan</div>
              <div className="mt-1 text-sm font-semibold text-white">SAVR Student</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-[11px] text-white/45">Region</div>
              <div className="mt-1 text-sm font-semibold text-white">Italy</div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {sections.map((item) => (
            <button
              key={item}
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/7"
            >
              <span className="text-sm text-white">{item}</span>
              <span className="text-white/35">›</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-between rounded-2xl border border-[#ff8f80]/20 bg-[#ff8f80]/10 px-4 py-3 text-left transition hover:bg-[#ff8f80]/15"
          >
            <span className="text-sm text-[#ffbea7]">Logout</span>
            <span className="text-[#ffbea7]/60">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function AppTopBar({ onProfileOpen }: { onProfileOpen: () => void }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-[linear-gradient(180deg,rgba(5,8,22,0.94),rgba(5,8,22,0.7),transparent)] px-4 pb-3 pt-3 backdrop-blur-md">
      <div className="text-[11px] uppercase tracking-[0.28em] text-white/38">SAVR</div>
      <button
        type="button"
        onClick={onProfileOpen}
        aria-label="Open profile and settings"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/7 transition hover:bg-white/10"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-visaBlueSoft to-visaGold text-xs font-semibold text-slate-950">
          MS
        </div>
      </button>
    </div>
  );
}

function HomeScreen({ onProfileOpen }: { onProfileOpen: () => void }) {
  return (
    <ScreenContainer padded={false}>
      <AppTopBar onProfileOpen={onProfileOpen} />
      <div className="px-4 pb-28 pt-1">
        <div className="mb-5">
          <h1 className="text-[30px] font-semibold tracking-tight text-white">All your money. Smarter.</h1>
        </div>

        <BalanceCard
          totalBalance={appData.totalBalance}
          monthlySaved={appData.monthlySaved}
          accounts={appData.accounts}
        />

        <div className="mt-4 grid grid-cols-2 gap-2">
          {appData.stats.map((stat) => (
            <StatChip key={stat.id} label={stat.label} value={stat.value} tone={stat.tone} />
          ))}
        </div>

        <GlassCard className="mt-4">
          <SectionHeader eyebrow="Linked institutions" title="Connected accounts" />
          <div className="space-y-3">
            {appData.accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/4 px-3 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-white">{account.name}</div>
                  <div className="mt-1 text-[11px] text-white/45">{account.type}</div>
                </div>
                <div className="text-right text-sm font-semibold text-white">{formatCurrency(account.balance)}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="mt-4">
          <SectionHeader
            eyebrow="Unified feed"
            title="Recent activity"
            action={<span className="text-[11px] text-white/45">Live sync</span>}
          />
          <div className="space-y-3">
            {appData.transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </GlassCard>
      </div>
    </ScreenContainer>
  );
}

function DiscountsScreen({
  activeFilter,
  onFilterChange,
  onSelectOffer,
  onProfileOpen,
}: {
  activeFilter: "online" | "instore";
  onFilterChange: (value: "online" | "instore") => void;
  onSelectOffer: (offer: Offer) => void;
  onProfileOpen: () => void;
}) {
  const filteredOffers = useMemo(() => {
    if (activeFilter === "online") {
      return appData.offers.filter((offer) => offer.channel === "online" || offer.channel === "inapp");
    }

    return appData.offers.filter((offer) => offer.channel === "instore");
  }, [activeFilter]);

  return (
    <ScreenContainer padded={false}>
      <AppTopBar onProfileOpen={onProfileOpen} />
      <div className="px-4 pb-28 pt-1">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-[0.32em] text-white/40">Save before you spend</div>
          <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-white">Discounts</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            SAVR matches relevant offers to your spending patterns across study, food, shopping, and travel.
          </p>
        </div>

        <SegmentedControl
          options={[
            { value: "online", label: "Online" },
            { value: "instore", label: "In-store" },
          ]}
          value={activeFilter}
          onChange={onFilterChange}
        />

        {activeFilter === "online" ? (
          <div className="mt-3 rounded-2xl border border-visaBlue/15 bg-visaBlue/10 px-3 py-3 text-[12px] leading-5 text-white/65">
            Includes in-app offers where the discount applies after adding the code in the merchant app.
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {filteredOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} onSelect={onSelectOffer} />
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}

function SavingsScreen({ onProfileOpen }: { onProfileOpen: () => void }) {
  return (
    <ScreenContainer padded={false}>
      <AppTopBar onProfileOpen={onProfileOpen} />
      <div className="px-4 pb-28 pt-1">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-[0.32em] text-white/40">Track progress</div>
          <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-white">Savings</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Budgets, goals, and captured savings opportunities in one student-friendly view.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="rounded-[26px] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Monthly saved</div>
            <div className="mt-2 text-2xl font-semibold text-white">{formatCurrency(appData.monthlySaved)}</div>
            <div className="mt-1 text-[12px] text-emerald-300">+18% vs March</div>
          </GlassCard>
          <GlassCard className="rounded-[26px] p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Missed this month</div>
            <div className="mt-2 text-2xl font-semibold text-white">{formatCurrency(appData.missedSavings)}</div>
            <div className="mt-1 text-[12px] text-[#ffbf7f]">Mostly food delivery</div>
          </GlassCard>
        </div>

        <div className="mt-4 grid gap-3">
          <SavingsDonut saved={appData.impactSaved} remaining={appData.missedSavings} />
          <SpendBars budgets={appData.budgets} />
        </div>

        <GlassCard className="mt-4">
          <SectionHeader title="Budgets" eyebrow="Spend vs budget" />
          <div className="space-y-3">
            {appData.budgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div>
        </GlassCard>

        <GlassCard className="mt-4">
          <SectionHeader title="Savings goals" eyebrow="Goal tracking" />
          <div className="space-y-3">
            {appData.goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </GlassCard>
      </div>
    </ScreenContainer>
  );
}

function RecurringScreen({
  onOpenAction,
  onProfileOpen,
}: {
  onOpenAction: (payment: RecurringPayment, action: RecurringAction) => void;
  onProfileOpen: () => void;
}) {
  return (
    <ScreenContainer padded={false}>
      <AppTopBar onProfileOpen={onProfileOpen} />
      <div className="px-4 pb-28 pt-1">
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-[0.32em] text-white/40">Optimize recurring costs</div>
          <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-white">Recurring</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            SAVR surfaces subscriptions and essential bills that can be cancelled or reduced.
          </p>
        </div>

        <GlassCard>
          <SectionHeader title="Upcoming payments" eyebrow="Next 14 days" />
          <div className="space-y-3">
            {appData.recurring.map((payment) => (
              <RecurringCard key={payment.id} payment={payment} onAction={onOpenAction} />
            ))}
          </div>
        </GlassCard>
      </div>
    </ScreenContainer>
  );
}

function PasscodeScreen({
  pin,
  error,
  onDigit,
  onDelete,
}: {
  pin: string;
  error: string | null;
  onDigit: (digit: string) => void;
  onDelete: () => void;
}) {
  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <div className="pointer-events-auto absolute inset-0 z-40 bg-[linear-gradient(180deg,#0a1220_0%,#08111f_48%,#050816_100%)] px-6 py-8">
      <div className="flex h-full flex-col items-center">
        <div className="mt-20">
          <SavrWordmark centered />
        </div>

        <div className="mt-14 flex gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full border ${
                index < pin.length ? "border-visaBlue bg-visaBlue" : "border-white/20 bg-transparent"
              }`}
            />
          ))}
        </div>

        <div className="mt-6 min-h-6 text-sm text-[#ffbea7]">{error ?? ""}</div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {keypad.map((key, index) =>
            key ? (
              <button
                key={key}
                type="button"
                onPointerUp={() => (key === "⌫" ? onDelete() : onDigit(key))}
                className="touch-manipulation flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xl font-medium text-white transition hover:bg-white/10 active:scale-[0.98] active:bg-white/12"
              >
                {key}
              </button>
            ) : (
              <div key={`spacer-${index}`} className="h-16 w-16" />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export function SavrDemo() {
  const [entryStage, setEntryStage] = useState<EntryStage>("passcode");
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [activeDiscountFilter, setActiveDiscountFilter] = useState<"online" | "instore">("online");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedRecurring, setSelectedRecurring] = useState<RecurringPayment | null>(null);
  const [selectedRecurringAction, setSelectedRecurringAction] = useState<RecurringAction | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedCode) {
      return;
    }

    const timer = window.setTimeout(() => setCopiedCode(false), 1400);
    return () => window.clearTimeout(timer);
  }, [copiedCode]);

  useEffect(() => {
    if (entryStage !== "passcode" || pin.length !== 4) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (pin === "0007") {
        setEntryStage("app");
        setPin("");
        setPinError(null);
        return;
      }

      setPin("");
      setPinError("Wrong password. Try again.");
    }, 120);

    return () => window.clearTimeout(timer);
  }, [entryStage, pin]);

  const renderAppScreen = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onProfileOpen={() => setProfileOpen(true)} />;
      case "discounts":
        return (
          <DiscountsScreen
            activeFilter={activeDiscountFilter}
            onFilterChange={setActiveDiscountFilter}
            onSelectOffer={setSelectedOffer}
            onProfileOpen={() => setProfileOpen(true)}
          />
        );
      case "savings":
        return <SavingsScreen onProfileOpen={() => setProfileOpen(true)} />;
      case "recurring":
        return (
          <RecurringScreen
            onOpenAction={(payment, action) => {
              setSelectedRecurring(payment);
              setSelectedRecurringAction(action);
            }}
            onProfileOpen={() => setProfileOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  const handleDigit = (digit: string) => {
    setPin((current) => {
      if (current.length >= 4) {
        return current;
      }

      return `${current}${digit}`;
    });
    setPinError(null);
  };

  const handleDelete = () => {
    setPin((current) => current.slice(0, -1));
    setPinError(null);
  };

  return (
    <PhoneFrame>
      <MobileScreen>
        <div className="relative flex-1 overflow-hidden">
          {entryStage === "app" ? (
            <>
              <div className="h-full overflow-y-auto pb-24">{renderAppScreen()}</div>
              <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
              <ProfileSheet
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                onLogout={() => {
                  setProfileOpen(false);
                  setSelectedOffer(null);
                  setSelectedRecurring(null);
                  setSelectedRecurringAction(null);
                  setPin("");
                  setPinError(null);
                  setEntryStage("passcode");
                }}
              />
              <OfferDetailModal
                offer={selectedOffer}
                copied={copiedCode}
                onClose={() => setSelectedOffer(null)}
                onCopyCode={async (code) => {
                  try {
                    await navigator.clipboard.writeText(code);
                  } catch {
                    // Clipboard can be unavailable in some demo contexts; keep the UI response.
                  }
                  setCopiedCode(true);
                }}
              />
              <ActionModal
                item={selectedRecurring}
                action={selectedRecurringAction}
                onClose={() => {
                  setSelectedRecurring(null);
                  setSelectedRecurringAction(null);
                }}
              />
            </>
          ) : null}

          {entryStage === "passcode" ? (
            <PasscodeScreen pin={pin} error={pinError} onDigit={handleDigit} onDelete={handleDelete} />
          ) : null}
        </div>
      </MobileScreen>
    </PhoneFrame>
  );
}
