"use client";

import { useState, type InputHTMLAttributes } from "react";

import { PhoneFrame } from "@/components/phone-frame";
import { MobileScreen } from "@/components/mobile-screen";
import { externalLinks, ExternalLinkKey } from "@/data/links";
import {
  AppTab,
  cardDetails,
  connectedAccounts,
  defaultFavorites,
  initialOffers,
  initialSavingsEvents,
  OfferChannel,
  OfferStatus,
  partnerLinks,
  recentTransactions,
  SavrMode,
  SavingsStatus,
  userProfile,
} from "@/data/mock-data";
import { bestOfferForMerchant, offerScore, visibleReminderCount } from "@/lib/recommendations";

type Modal =
  | { type: "card"; id: string }
  | { type: "bankReconnect" }
  | { type: "offer"; id: string; action: "use" | "activate" | "details" }
  | { type: "snooze"; id: string }
  | { type: "settings"; section: string }
  | { type: "logout" }
  | { type: "ar" }
  | { type: "event"; id: string }
  | { type: "receipt"; id: string; mode: "upload" | "manual" }
  | { type: "transaction"; id: string }
  | { type: "plugin"; key: ExternalLinkKey; name: string }
  | { type: "message"; title: string; body: string }
  | null;

type OfferState = Record<string, { status?: OfferStatus; favorite?: boolean; used?: boolean; activated?: boolean }>;
type EventState = Record<string, SavingsStatus>;
type ConnectedCard = (typeof connectedAccounts)[number] & {
  network?: string;
  last4?: string;
  default?: boolean;
};
type CardForm = {
  nickname: string;
  cardholder: string;
  number: string;
  expiry: string;
  cvv: string;
  issuer: string;
  network: string;
  cardType: string;
};

const baselineSavedThisMonth = 318.9;
const baselineMissedThisMonth = 120;

const tabs: Array<{ id: AppTab; label: string }> = [
  { id: "account", label: "Account" },
  { id: "benefits", label: "Rewards" },
  { id: "difference", label: "SAVR Difference" },
  { id: "advisor", label: "Personal Advisor" },
];

const notificationTypes = ["website", "in-store", "app", "expiry"];
const thresholdOptions = [2, 5, 10];
const timingOptions = ["0 seconds", "30 seconds", "1 minute", "1 minute 30 seconds", "2 minutes", "2 minutes 30 seconds", "3 minutes"];
const initialCards: ConnectedCard[] = connectedAccounts.map((card, index) => ({
  ...card,
  network: card.name.includes("Mastercard") ? "MC" : "VISA",
  last4: ["4821", "9034", "1177", "5562", "7749"][index],
  default: card.id === "intesa",
}));

function eur(value: number) {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value);
}

function openExternal(key: ExternalLinkKey) {
  window.open(externalLinks[key], "_blank", "noopener,noreferrer");
}

function SavrLogo() {
  return (
    <div className="flex items-center gap-2.5" aria-label="SAVR">
      <svg viewBox="0 0 72 48" className="h-8 w-12 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="savrLogoBlue" x1="8" y1="0" x2="58" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#23a8ff" />
            <stop offset="1" stopColor="#0b6cff" />
          </linearGradient>
          <linearGradient id="savrLogoGold" x1="6" y1="28" x2="56" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffe45c" />
            <stop offset="1" stopColor="#f4b000" />
          </linearGradient>
        </defs>
        <path d="M8 22 48 2c5-2.5 10 1.1 10 6.1 0 2.5-1.4 4.8-3.6 6L14.8 34C9.8 36.5 4 32.9 4 27.3c0-2.2 1.6-4.3 4-5.3Z" fill="url(#savrLogoBlue)" />
        <path d="M10 35 50 15c5-2.5 10 1.1 10 6.1 0 2.5-1.4 4.8-3.6 6L16.8 47C11.8 49.5 6 45.9 6 40.3c0-2.2 1.6-4.3 4-5.3Z" fill="url(#savrLogoGold)" />
      </svg>
      <div className="text-[24px] font-black leading-none tracking-normal">
        <span className="text-[#28a8ff]">SAV</span>
        <span className="text-[#ffd347]">R</span>
      </div>
    </div>
  );
}

function PasscodeLogo() {
  return (
    <div className="flex flex-col items-center" aria-label="SAVR">
      <svg viewBox="0 0 72 48" className="h-16 w-24 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="savrPasscodeBlue" x1="8" y1="0" x2="58" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#23a8ff" />
            <stop offset="1" stopColor="#0b6cff" />
          </linearGradient>
          <linearGradient id="savrPasscodeGold" x1="6" y1="28" x2="56" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffe45c" />
            <stop offset="1" stopColor="#f4b000" />
          </linearGradient>
        </defs>
        <path d="M8 22 48 2c5-2.5 10 1.1 10 6.1 0 2.5-1.4 4.8-3.6 6L14.8 34C9.8 36.5 4 32.9 4 27.3c0-2.2 1.6-4.3 4-5.3Z" fill="url(#savrPasscodeBlue)" />
        <path d="M10 35 50 15c5-2.5 10 1.1 10 6.1 0 2.5-1.4 4.8-3.6 6L16.8 47C11.8 49.5 6 45.9 6 40.3c0-2.2 1.6-4.3 4-5.3Z" fill="url(#savrPasscodeGold)" />
      </svg>
      <div className="mt-2 text-[44px] font-black leading-none tracking-normal">
        <span className="text-[#28a8ff]">SAV</span>
        <span className="text-[#ffd347]">R</span>
      </div>
    </div>
  );
}

function TabIcon({ id }: { id: AppTab }) {
  const common = "mx-auto h-5 w-5";
  if (id === "account") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
        <rect x="3.5" y="6" width="17" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 10h4.8M7 14h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === "benefits") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
        <path d="M4.5 11.4 11.4 4.5h6.1v6.1l-6.9 6.9a2.2 2.2 0 0 1-3.1 0l-3-3a2.2 2.2 0 0 1 0-3.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (id === "difference") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
        <path d="M5 18V6M5 18h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m8 15 3.2-3.2 2.4 2.4L18.5 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden="true">
      <path d="M5 7.8A4.8 4.8 0 0 1 9.8 3h4.4A4.8 4.8 0 0 1 19 7.8v3.6a4.8 4.8 0 0 1-4.8 4.8H11l-4.2 3v-3.4A4.8 4.8 0 0 1 5 11.4V7.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8.5h6M9 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ActionButton({
  children,
  onClick,
  tone = "primary",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "primary" | "secondary" | "quiet" | "danger";
  className?: string;
  disabled?: boolean;
}) {
  const classes = {
    primary: "bg-gradient-to-r from-[#2d79ff] to-[#ffd347] text-[#07111f]",
    secondary: "border border-white/12 bg-white/8 text-white",
    quiet: "bg-transparent text-white/68 hover:bg-white/7",
    danger: "border border-[#dc2626] bg-[#dc2626] text-white shadow-[0_10px_24px_rgba(220,38,38,0.24)]",
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`rounded-2xl px-3 py-2 text-xs font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${classes[tone]} ${className}`}>
      {children}
    </button>
  );
}

function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "blue" | "gold" | "green" }) {
  const classes = {
    default: "border border-white/10 bg-white/10 text-white/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
    blue: "border border-[#2d79ff]/30 bg-[#2d79ff]/16 text-[#9dccff] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
    gold: "border border-[#ffd347]/30 bg-[#ffd347]/16 text-[#ffd347] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
    green: "border border-[#7ee5a7]/30 bg-[#7ee5a7]/16 text-[#7ee5a7] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold leading-none ${classes[tone]}`}>{children}</span>;
}

function AppHeader({ onProfile }: { onProfile: () => void }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-[linear-gradient(180deg,rgba(247,249,252,0.96),rgba(247,249,252,0.86),transparent)] px-4 pb-3 pt-3 backdrop-blur-md">
      <SavrLogo />
      <button type="button" onClick={onProfile} aria-label="Open profile settings" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/8 text-sm font-bold">
        FL
      </button>
    </div>
  );
}

function BottomTabs({ tab, setTab }: { tab: AppTab; setTab: (tab: AppTab) => void }) {
  return (
    <div data-dark-surface className="absolute inset-x-3 bottom-3 z-30 rounded-[28px] border border-white/10 bg-[#09111f]/96 p-2 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((item) => (
          <button key={item.id} type="button" data-tab-active={tab === item.id ? "true" : "false"} onClick={() => setTab(item.id)} className={`rounded-2xl px-1 py-2 text-center transition ${tab === item.id ? "bg-white/12 text-white" : "text-white/42"}`}>
            <TabIcon id={item.id} />
            <div className="mt-1 text-[10px] font-semibold leading-tight">{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ModalSheet({
  modal,
  close,
  app,
  onLock,
}: {
  modal: Modal;
  close: () => void;
  app: DemoState;
  onLock: () => void;
}) {
  if (!modal) return null;

  const offer = modal.type === "offer" || modal.type === "snooze" ? app.offers.find((item) => item.id === modal.id) : null;
  const card = modal.type === "card" ? app.cards.find((item) => item.id === modal.id) : null;
  const detail = modal.type === "card" ? cardDetails.find((item) => item.id === modal.id) : null;
  const event = modal.type === "event" || modal.type === "receipt" ? app.events.find((item) => item.id === modal.id) : null;
  const transaction = modal.type === "transaction" ? recentTransactions.find((item) => item.id === modal.id) : null;

  return (
    <div data-modal-backdrop className="absolute inset-0 z-50 flex items-end bg-black/58 backdrop-blur-sm" onClick={close}>
      <div data-dark-surface className="max-h-[82%] w-full overflow-y-auto rounded-t-[30px] border border-white/10 bg-[#08111f] p-4 shadow-2xl" onClick={(eventClick) => eventClick.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/16" />

        {modal.type === "bankReconnect" && (
          <SheetSection title="Secure reconnect">
            <p className="text-sm leading-6 text-white/64">Refresh your cards and spending insights through a secure bank connection flow.</p>
            <div className="mt-4 flex gap-2">
              <ActionButton onClick={() => { app.setBankConnected(true); app.setToast("Connection refreshed"); close(); }}>Confirm connection</ActionButton>
              <ActionButton tone="secondary" onClick={close}>Cancel</ActionButton>
            </div>
            <div className="mt-4 flex gap-3 text-sm">
              <ExternalTextLink linkKey="visa">Visa</ExternalTextLink>
            </div>
          </SheetSection>
        )}

        {card && (
          <SheetSection title={card.name}>
            <div className="grid gap-2 text-sm text-white/68">
              <p>Issuer: {card.issuer}</p>
              <p>Card type: {card.type}</p>
              <p>Card ending: •••• {card.last4 || "0000"}</p>
            </div>
            <h4 className="mt-4 text-sm font-bold">Current SAVR reward matches</h4>
            <div className="mt-2 grid gap-2">{(detail?.activeBenefits || ["Eligible for SAVR merchant matching", "Used when SAVR ranks payment options"]).map((item) => <Panel key={item}>{item.replace(/benefits/g, "rewards").replace(/benefit/g, "reward")}</Panel>)}</div>
            <h4 className="mt-4 text-sm font-bold">Best ways to use this card</h4>
            <div className="mt-2 flex flex-wrap gap-2">{(detail?.recommendedUse || ["New purchases", "Merchant offers"]).map((item) => <Pill key={item} tone="blue">{item}</Pill>)}</div>
          </SheetSection>
        )}

        {offer && modal.type === "offer" && (
          <SheetSection title={offer.merchant}>
            <div className="mt-4 grid gap-2">
              <TransactionDetailRow label="Best card" value={offer.bestCard} />
              <TransactionDetailRow label="Value" value={offerValueDetail(offer)} />
              <TransactionDetailRow label="Channel" value={formatChannel(offer.channel)} nowrap />
              <TransactionDetailRow label="Expires" value={offer.expiry} nowrap />
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-3">
              <p className="text-xs font-black uppercase tracking-[0.08em] text-white/40">Why this matters</p>
              <p className="mt-2 text-sm leading-6 text-white/68">{offer.why}</p>
            </div>
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/6 p-3">
              <p className="text-xs font-black uppercase tracking-[0.08em] text-white/40">How to redeem</p>
              <p className="mt-2 text-sm leading-6 text-white/68">{offer.restrictions}</p>
            </div>
            {modal.action === "use" && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-4">
                {offer.channel === "website" && (
                  <>
                    <p className="text-sm">Code: <span className="font-black text-[#ffd347]">{offer.code || "AUTO-SAVR"}</span></p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <ActionButton tone="secondary" onClick={() => navigator.clipboard?.writeText(offer.code || "AUTO-SAVR").then(() => app.setToast("Promo code copied")).catch(() => app.setToast("Promo code copied"))}>Copy code</ActionButton>
                      <ActionButton tone="secondary" onClick={() => openExternal(offer.linkKey)}>Merchant link</ActionButton>
                    </div>
                  </>
                )}
                {offer.channel === "in-store" && (
                  <div className="flex items-center gap-4">
                    <QrBox />
                    <p className="text-sm leading-6 text-white/66">Show this QR at checkout and pay with {offer.bestCard}.</p>
                  </div>
                )}
                {offer.channel === "app" && (
                  <>
                    <p className="text-sm text-white/66">Open app flow and copy code {offer.code || "SAVRAPP"}.</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <ActionButton tone="secondary" onClick={() => openExternal(offer.linkKey)}>Open app</ActionButton>
                      <ActionButton tone="secondary" onClick={() => navigator.clipboard?.writeText(offer.code || "SAVRAPP").then(() => app.setToast("App code copied")).catch(() => app.setToast("App code copied"))}>Copy code</ActionButton>
                    </div>
                  </>
                )}
              </div>
            )}
            {modal.action === "activate" && (
              <div className="mt-4 rounded-2xl border border-[#2d79ff]/30 bg-[#2d79ff]/12 p-4">
                <p className="text-sm font-bold">Issuer activation</p>
                <p className="mt-2 text-xs leading-5 text-white/62">SAVR will mark this reward as ready before you pay with {offer.bestCard}.</p>
              </div>
            )}
            <div className="mt-4 grid min-w-0 grid-cols-2 gap-2">
              <OfferActionButton tone={offerRequiresActivation(offer) ? "secondary" : "primary"} className="col-span-2" onClick={() => handleOfferPrimary(offer, app, close)}>{offerRequiresActivation(offer) ? "Activate" : "Use"}</OfferActionButton>
              <OfferActionButton onClick={() => { close(); app.setModal({ type: "snooze", id: offer.id }); }}>Snooze</OfferActionButton>
              <OfferActionButton onClick={() => app.favoriteOffer(offer.id)}>{offer.favorite ? "Unfavorite" : "Favorite"}</OfferActionButton>
            </div>
          </SheetSection>
        )}

        {offer && modal.type === "snooze" && (
          <SheetSection title={`Snooze ${offer.merchant}`}>
            <div className="grid gap-2">
              {["1 hour", "tomorrow", "next week", "don't remind me again"].map((duration) => (
                <button key={duration} type="button" onClick={() => { app.snoozeOffer(offer.id, duration); close(); }} className="rounded-2xl border border-white/10 bg-white/6 p-3 text-left text-sm capitalize">
                  {duration}
                </button>
              ))}
            </div>
          </SheetSection>
        )}

        {modal.type === "settings" && <SettingsSubScreen section={modal.section} app={app} close={close} />}

        {modal.type === "logout" && (
          <SheetSection title="Log out?">
            <p className="text-sm text-white/62">You will be signed out of SAVR on this phone.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionButton tone="danger" onClick={() => { close(); app.setSettingsOpen(false); onLock(); }}>Confirm log out</ActionButton>
              <ActionButton tone="secondary" onClick={close}>Cancel</ActionButton>
            </div>
          </SheetSection>
        )}

        {modal.type === "ar" && (
          <SheetSection title="AR Store Scanner">
            <div className="relative h-80 overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(45,121,255,0.22),transparent_38%),#02050b]">
              <div className="absolute inset-6 rounded-3xl border border-[#ffd347]/55" />
              <div className="absolute left-5 top-12 rounded-2xl bg-black/70 p-3 text-xs">Nike offer detected: 8% cashback with Intesa</div>
              <div className="absolute bottom-16 right-5 rounded-2xl bg-black/70 p-3 text-xs">Sephora offer detected: EUR 8 saving</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionButton onClick={() => { app.favoriteOffer("nike-intesa"); app.setToast("Nike saved from AR scanner"); }}>Save offer</ActionButton>
              <ActionButton tone="secondary" onClick={() => { app.useOffer("sephora-hype"); close(); }}>Use offer</ActionButton>
              <ActionButton className="col-span-2" tone="quiet" onClick={close}>Close scanner</ActionButton>
            </div>
          </SheetSection>
        )}

        {event && modal.type === "event" && (
          <SheetSection title={event.merchant}>
            <p className="text-sm text-white/66">{event.description}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Panel>Status: {app.eventStatuses[event.id] || event.status}</Panel>
              <Panel>Amount: {eur(event.amount)}</Panel>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionButton onClick={() => { app.correctEvent(event.id); close(); }}>Mark corrected</ActionButton>
              <ActionButton tone="secondary" onClick={() => { app.setModal({ type: "receipt", id: event.id, mode: "upload" }); }}>Add receipt</ActionButton>
              <ActionButton tone="secondary" onClick={() => { app.setModal({ type: "receipt", id: event.id, mode: "manual" }); }}>Manual correction</ActionButton>
            </div>
          </SheetSection>
        )}

        {event && modal.type === "receipt" && (
          <SheetSection title={modal.mode === "upload" ? "Upload receipt" : "Manual correction"}>
            <p className="text-sm text-white/66">Simulated receipt accepted for {event.merchant}. SAVR recalculates the saved and missed totals.</p>
            <ActionButton className="mt-4 w-full" onClick={() => { app.correctEvent(event.id); close(); }}>Confirm correction</ActionButton>
          </SheetSection>
        )}

        {modal.type === "plugin" && (
          <SheetSection title={`${modal.name} plug-in`}>
            <p className="text-sm leading-6 text-white/66">SAVR can answer your card and offer questions inside this assistant.</p>
            <ActionButton className="mt-4 w-full" onClick={() => openExternal(modal.key)}>Open {modal.name}</ActionButton>
          </SheetSection>
        )}

        {transaction && modal.type === "transaction" && (
          <SheetSection title={transaction.merchant}>
            <div className="grid gap-2">
              <TransactionDetailRow label="Card used" value={transaction.card} />
              <TransactionDetailRow label="Category" value={transaction.category} nowrap />
              <TransactionDetailRow label="Amount spent" value={eur(transaction.amount)} nowrap />
              <TransactionDetailRow label={transaction.savrStatus === "missed" ? "Missed saving" : transaction.savrAmount === 0 ? "SAVR result" : "Saved"} value={transaction.savrAmount === 0 ? "No better offer found" : eur(transaction.savrAmount)} tone={transaction.savrStatus === "missed" ? "missed" : "saved"} nowrap />
            </div>
            <div className="mt-4 rounded-2xl border border-[#2d79ff]/25 bg-[#2d79ff]/10 p-4">
              <p className="text-sm font-black">SAVR insights</p>
              <p className="mt-2 text-sm leading-6 text-white/66">{transactionInsight(transaction.merchant)}</p>
              <p className="mt-3 text-sm leading-6 text-white/66">{transaction.redemption}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionButton onClick={() => { app.setTransactionsOpen(false); app.setTab("benefits"); close(); }}>View matching rewards</ActionButton>
              <ActionButton tone="secondary" onClick={() => { app.setTab("advisor"); close(); }}>Ask advisor</ActionButton>
            </div>
          </SheetSection>
        )}

        {modal.type === "message" && (
          <SheetSection title={modal.title}>
            <p className="text-sm leading-6 text-white/66">{modal.body}</p>
            <ActionButton className="mt-4 w-full" onClick={close}>Done</ActionButton>
          </SheetSection>
        )}
      </div>
    </div>
  );
}

function SheetSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-black tracking-normal">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-white/10 bg-white/6 p-3 text-xs text-white/68">{children}</div>;
}

function TransactionDetailRow({
  label,
  value,
  tone = "default",
  nowrap = false,
}: {
  label: string;
  value: string;
  tone?: "default" | "saved" | "missed";
  nowrap?: boolean;
}) {
  const valueColor = tone === "saved" ? "text-[#7ee5a7]" : tone === "missed" ? "text-[#ff8f80]" : "text-white/76";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-3 text-xs">
      <p className="text-white/42">{label}</p>
      <p className={`mt-1 min-w-0 font-black leading-5 ${valueColor} ${nowrap ? "truncate whitespace-nowrap" : "break-words"}`}>{value}</p>
    </div>
  );
}

function ExternalTextLink({ linkKey, children }: { linkKey: ExternalLinkKey; children: React.ReactNode }) {
  return (
    <a href={externalLinks[linkKey]} target="_blank" rel="noopener noreferrer" className="text-[#69a8ff] underline decoration-white/20 underline-offset-4">
      {children}
    </a>
  );
}

function QrBox() {
  return (
    <div className="grid h-28 w-28 grid-cols-6 gap-1 rounded-2xl bg-white p-3">
      {Array.from({ length: 36 }).map((_, index) => <span key={index} className={(index % 3 === 0 || index % 5 === 0) ? "rounded-sm bg-black" : "rounded-sm bg-white"} />)}
    </div>
  );
}

function transactionInsight(merchant: string) {
  const insights: Record<string, string> = {
    Zara: "SAVR found a better checkout path: Revolut Card plus public code SAVE10 would capture about EUR 7.50 on a similar basket.",
    Esselunga: "This fits your grocery pattern. UniCredit Mastercard is the right card when the basket clears the groceries boost threshold.",
    Glovo: "Your delivery spend is frequent. SAVR checks Revolut delivery rewards and reminds you before in-app checkout.",
    Nike: "This transaction matched an issuer reward. Intesa Visa is the best card for Nike in-store cashback.",
    Trenitalia: "Transport spend maps to UniCredit travel rewards. SAVR watches expiry dates and app checkout moments.",
    Spotify: "No stronger active reward was found for this subscription, so SAVR keeps it classified but does not surface a reminder.",
    SHEIN: "SAVR flagged a missed HYPE cashback opportunity and will prioritize this merchant in future fashion reminders.",
    Sephora: "Beauty offers are expiring soon. SAVR recommends checking HYPE and partner codes before paying.",
  };
  return insights[merchant] || "SAVR checks the merchant, category, card used, active issuer rewards, public codes, and missed-saving history for the next best action.";
}

function TransactionOutcome({ tx, compact = false }: { tx: (typeof recentTransactions)[number]; compact?: boolean }) {
  const missed = tx.savrStatus === "missed";
  const neutral = tx.savrAmount === 0;
  const text = neutral ? "No saving missed" : `${missed ? "Missed" : "Saved"} ${eur(tx.savrAmount)}`;
  return (
    <span className={`whitespace-nowrap ${compact ? "text-[11px]" : "text-xs"} font-black ${missed ? "text-[#ff8f80]" : "text-[#7ee5a7]"}`}>
      {text}
    </span>
  );
}

function offerValueLabel(offer: ReturnType<typeof useDemoState>["offers"][number]) {
  const lower = offer.title.toLowerCase();
  const percentMatch = offer.title.match(/\d+%/);
  if (offer.id === "zara-revolut") return "Save 10%";
  if (percentMatch && lower.includes("cashback")) return `${percentMatch[0]} cashback`;
  if (percentMatch) return `${percentMatch[0]} off`;
  if (lower.includes("cashback")) return "Cashback varies";
  if (lower.includes("free deliver")) return "Free delivery";
  return `Save ${eur(offer.estimatedSaving)}`;
}

function offerValueDetail(offer: ReturnType<typeof useDemoState>["offers"][number]) {
  const lower = offer.title.toLowerCase();
  const percentMatch = offer.title.match(/\d+%/);
  if (percentMatch && lower.includes("cashback")) return `${percentMatch[0]} cashback based on your final basket`;
  if (percentMatch) return `${percentMatch[0]} reward based on your final basket`;
  if (lower.includes("cashback")) return "Cashback amount depends on your final spend";
  if (lower.includes("free deliver")) return `Usually worth ${eur(offer.estimatedSaving)}`;
  return eur(offer.estimatedSaving);
}

function offerRequiresActivation(offer: ReturnType<typeof useDemoState>["offers"][number]) {
  return offer.status === "activation required" && !offer.activated;
}

function formatChannel(channel: OfferChannel) {
  return channel === "in-store" ? "In-store" : channel.charAt(0).toUpperCase() + channel.slice(1);
}

function transactionSavedTotal() {
  return recentTransactions
    .filter((tx) => tx.savrStatus === "saved" && tx.savrAmount > 0)
    .reduce((sum, tx) => sum + tx.savrAmount, 0);
}

function formatOfferType(type: string) {
  return (type.charAt(0).toUpperCase() + type.slice(1)).replace(/benefit/g, "reward");
}

function offerPriority(offer: ReturnType<typeof useDemoState>["offers"][number], app: DemoState) {
  let priority = app.scoreOffer(offer.id);
  if (offer.status === "expiring soon") priority += 28;
  if (offer.favorite) priority += 18;
  if (offer.status === "activation required") priority += 8;
  if (offer.channel === "in-store" && app.mode === "active") priority += 6;
  return priority;
}

function handleOfferPrimary(offer: ReturnType<typeof useDemoState>["offers"][number], app: DemoState, close?: () => void) {
  if (offerRequiresActivation(offer)) {
    app.activateOffer(offer.id);
    app.setModal({ type: "offer", id: offer.id, action: "activate" });
    return;
  }

  if (offer.channel === "in-store") {
    app.setModal({ type: "offer", id: offer.id, action: "use" });
    return;
  }

  if (offer.channel === "website" && offer.type === "public promo code" && offer.code) {
    navigator.clipboard?.writeText(offer.code).catch(() => undefined);
    app.useOffer(offer.id);
    close?.();
    return;
  }

  app.setModal({ type: "offer", id: offer.id, action: "use" });
}

function isExpiryReminder(offer: ReturnType<typeof useDemoState>["offers"][number]) {
  return offer.status === "expiring soon" || ["Tonight", "Tomorrow"].includes(offer.expiry);
}

type DemoState = ReturnType<typeof useDemoState>;

function useDemoState() {
  const [tab, setTab] = useState<AppTab>("account");
  const [modal, setModal] = useState<Modal>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cardManagerOpen, setCardManagerOpen] = useState(false);
  const [transactionsOpen, setTransactionsOpen] = useState(false);
  const [allBenefitsOpen, setAllBenefitsOpen] = useState(false);
  const [allSavingsOpen, setAllSavingsOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [cards, setCards] = useState<ConnectedCard[]>(initialCards);
  const [mode, setMode] = useState<SavrMode>("active");
  const [threshold, setThreshold] = useState(5);
  const [customThreshold, setCustomThreshold] = useState(7);
  const [timing, setTiming] = useState("2 minutes");
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    website: true,
    "in-store": true,
    app: true,
    expiry: true,
  });
  const [favoriteStores, setFavoriteStores] = useState(defaultFavorites.stores);
  const [favoriteCategories, setFavoriteCategories] = useState(defaultFavorites.categories);
  const [offerState, setOfferState] = useState<OfferState>({});
  const [eventStatuses, setEventStatuses] = useState<EventState>({});
  const [toast, setToast] = useState("");
  const [bankConnected, setBankConnected] = useState(true);

  const offers = initialOffers.map((offer) => ({
    ...offer,
    status: offerState[offer.id]?.status || offer.status,
    favorite: offerState[offer.id]?.favorite ?? (offer.status === "favorite" || favoriteStores.includes(offer.merchant)),
    used: Boolean(offerState[offer.id]?.used),
    activated: Boolean(offerState[offer.id]?.activated),
  }));

  const events = initialSavingsEvents.map((event) => ({ ...event, status: eventStatuses[event.id] || event.status }));

  function useOffer(id: string) {
    const offer = initialOffers.find((item) => item.id === id);
    if (!offer) return;
    setOfferState((current) => ({ ...current, [id]: { ...current[id], used: true, activated: true, status: "active" } }));
    setEventStatuses((current) => ({ ...current, [`used-${id}`]: "saved" }));
    setToast(`${offer.merchant} saving captured: ${eur(offer.estimatedSaving)}`);
  }

  function activateOffer(id: string) {
    const offer = initialOffers.find((item) => item.id === id);
    if (!offer) return;
    setOfferState((current) => ({ ...current, [id]: { ...current[id], activated: true, status: "active" } }));
    setToast(`${offer.merchant} reward activated`);
  }

  function snoozeOffer(id: string, duration: string) {
    setOfferState((current) => ({ ...current, [id]: { ...current[id], status: "snoozed" } }));
    setToast(`Offer snoozed until ${duration}`);
  }

  function favoriteOffer(id: string) {
    const offer = initialOffers.find((item) => item.id === id);
    setOfferState((current) => ({ ...current, [id]: { ...current[id], favorite: !(current[id]?.favorite ?? offer?.status === "favorite") } }));
    if (offer) setToast(`${offer.merchant} favorite updated`);
  }

  function correctEvent(id: string) {
    const event = initialSavingsEvents.find((item) => item.id === id);
    setEventStatuses((current) => ({ ...current, [id]: "corrected" }));
    if (event) setToast(`${event.merchant} corrected`);
  }

  function scoreOffer(id: string) {
    const offer = offers.find((item) => item.id === id);
    if (!offer) return 0;
    return offerScore({
      merchant: offer.merchant,
      category: offer.category,
      channel: offer.channel,
      connectedCards: cards.map((card) => card.name),
      activeBenefits: cardDetails.flatMap((card) => card.activeBenefits),
      expiry: offer.expiry,
      mode,
      threshold,
      favoriteStores,
      favoriteCategories,
      missedMerchants,
    });
  }

  function resetDemo() {
    setTab("account");
    setModal(null);
    setSettingsOpen(false);
    setCardManagerOpen(false);
    setTransactionsOpen(false);
    setAllBenefitsOpen(false);
    setAllSavingsOpen(false);
    setSignedOut(false);
    setCards(initialCards);
    setMode("active");
    setThreshold(5);
    setCustomThreshold(7);
    setTiming("2 minutes");
    setNotifications({ website: true, "in-store": true, app: true, expiry: true });
    setFavoriteStores(defaultFavorites.stores);
    setFavoriteCategories(defaultFavorites.categories);
    setOfferState({});
    setEventStatuses({});
    setToast("Demo reset");
    setBankConnected(true);
  }

  const missedMerchants = events.filter((event) => event.status === "missed").map((event) => event.merchant);

  return {
    tab,
    setTab,
    modal,
    setModal,
    settingsOpen,
    setSettingsOpen,
    cardManagerOpen,
    setCardManagerOpen,
    transactionsOpen,
    setTransactionsOpen,
    allBenefitsOpen,
    setAllBenefitsOpen,
    allSavingsOpen,
    setAllSavingsOpen,
    signedOut,
    setSignedOut,
    cards,
    setCards,
    mode,
    setMode,
    threshold,
    setThreshold,
    customThreshold,
    setCustomThreshold,
    timing,
    setTiming,
    notifications,
    setNotifications,
    favoriteStores,
    setFavoriteStores,
    favoriteCategories,
    setFavoriteCategories,
    offers,
    events,
    eventStatuses,
    toast,
    setToast,
    bankConnected,
    setBankConnected,
    useOffer,
    activateOffer,
    snoozeOffer,
    favoriteOffer,
    correctEvent,
    resetDemo,
    missedMerchants,
    scoreOffer,
  };
}

function AccountScreen({ app }: { app: DemoState }) {
  return (
    <ScreenPad>
      <h1 className="text-2xl font-black tracking-normal">Hi Francesca</h1>
      <div className="mt-4 rounded-[28px] border border-[#2d79ff]/30 bg-[#2d79ff]/12 p-5">
        <p className="text-xs text-white/52">Total balance</p>
        <p className="mt-2 text-4xl font-black tracking-normal">{eur(userProfile.totalBalance)}</p>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/16 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase text-white/42">SAVR Difference</p>
              <p className="mt-1 text-sm font-black text-[#7ee5a7]">{eur(transactionSavedTotal())} saved this month</p>
            </div>
            <button type="button" onClick={() => app.setTab("difference")} className="rounded-full bg-[#ffd347] px-3 py-1.5 text-[11px] font-black text-black">View</button>
          </div>
        </div>
      </div>

      <SectionTitle title="Cards" action="Manage cards" onClick={() => app.setCardManagerOpen(true)} />
      <div className="grid gap-3">
        {app.cards.map((card) => (
          <CardListRow key={card.id} card={card} onClick={() => app.setModal({ type: "card", id: card.id })} />
        ))}
      </div>

      <SectionTitle title="Recent transactions" action="See all" onClick={() => app.setTransactionsOpen(true)} />
      <div className="grid gap-2">
        {recentTransactions.slice(0, 4).map((tx) => (
          <button key={tx.id} type="button" onClick={() => app.setModal({ type: "transaction", id: tx.id })} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left">
            <div>
              <p className="text-sm font-semibold">{tx.merchant}</p>
              <p className="text-xs text-white/42">{tx.category} · {tx.card}</p>
              <div className="mt-1"><TransactionOutcome tx={tx} compact /></div>
            </div>
            <span className="shrink-0 whitespace-nowrap text-sm">{eur(tx.amount)}</span>
          </button>
        ))}
      </div>
    </ScreenPad>
  );
}

function CardListRow({ card, onClick }: { card: ConnectedCard; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="w-full max-w-full overflow-hidden rounded-[22px] border border-white/10 bg-white/6 p-3 text-left transition hover:bg-white/9">
      <div className="flex items-center gap-3">
        <IssuerLogo issuer={card.issuer} cardName={card.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-black leading-tight">{cardDisplayName(card)}</p>
          <p className="mt-1 truncate text-[11px] text-white/48">•••• {card.last4 || "0000"} · {card.issuer}</p>
        </div>
        {card.default ? <span className="shrink-0 rounded-full bg-[#ffd347] px-2 py-1 text-[10px] font-black text-black">Default</span> : null}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/34">Balance</span>
        <span className="text-sm font-black text-white">{eur(card.balance)}</span>
      </div>
    </button>
  );
}

function cardDisplayName(card: ConnectedCard) {
  const names: Record<string, string> = {
    intesa: "Intesa Visa Debit",
    unicredit: "UniCredit Mastercard",
    hype: "HYPE",
    revolut: "Revolut",
    paypal: "PayPal",
  };
  return names[card.id] || card.name;
}

function IssuerLogo({ issuer, cardName }: { issuer?: string; cardName?: string }) {
  const source = `${issuer || ""} ${cardName || ""}`.toLowerCase();
  let label = "Visa";
  let classes = "bg-[#1b67ff] text-white";
  if (source.includes("intesa")) {
    label = "Intesa";
    classes = "bg-[#007a5e] text-white";
  } else if (source.includes("unicredit")) {
    label = "UniCredit";
    classes = "bg-[#d71920] text-white";
  } else if (source.includes("hype")) {
    label = "HYPE";
    classes = "bg-[#6f3cff] text-white";
  } else if (source.includes("revolut")) {
    label = "Revolut";
    classes = "bg-black text-white";
  } else if (source.includes("paypal")) {
    label = "PayPal";
    classes = "bg-[#0070ba] text-white";
  }

  return (
    <div data-brand-logo className={`grid h-10 w-12 shrink-0 place-items-center rounded-2xl px-1 text-center text-[8px] font-black leading-none ${classes}`}>
      {label}
    </div>
  );
}

function CardManagerScreen({ app }: { app: DemoState }) {
  const emptyForm: CardForm = {
    nickname: "",
    cardholder: userProfile.name,
    number: "",
    expiry: "",
    cvv: "",
    issuer: "",
    network: "Visa",
    cardType: "Debit",
  };
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<CardForm>(emptyForm);

  function update(field: keyof CardForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addCard() {
    const digits = form.number.replace(/\D/g, "");
    const last4 = digits.slice(-4) || "0000";
    const issuer = form.issuer.trim() || "New issuer";
    const cardType = form.cardType.trim() || "Card";
    const network = form.network.trim() || "Visa";
    const name = form.nickname.trim() || `${issuer} ${network} ${cardType}`;
    const id = `card-${Date.now()}`;

    app.setCards([
      ...app.cards,
      {
        id,
        name,
        issuer,
        type: `${network} ${cardType}`.trim(),
        balance: 0,
        linkKey: "visa",
        network: network.toUpperCase().slice(0, 4),
        last4,
        default: app.cards.length === 0,
      },
    ]);
    app.setToast(`${name} added`);
    setForm(emptyForm);
    setAdding(false);
  }

  function removeCard(id: string) {
    const removed = app.cards.find((card) => card.id === id);
    const remaining = app.cards.filter((card) => card.id !== id);
    const hasDefault = remaining.some((card) => card.default);
    app.setCards(remaining.map((card, index) => ({ ...card, default: hasDefault ? card.default : index === 0 })));
    if (removed) app.setToast(`${removed.name} removed`);
  }

  function setDefault(id: string) {
    app.setCards(app.cards.map((card) => ({ ...card, default: card.id === id })));
    const card = app.cards.find((item) => item.id === id);
    if (card) app.setToast(`${card.name} set as default`);
  }

  const canAdd = form.cardholder.trim() && form.number.replace(/\D/g, "").length >= 12 && form.expiry.trim() && form.cvv.trim() && form.issuer.trim();

  return (
    <div className="absolute inset-0 z-40 w-full max-w-full overflow-hidden bg-[#050816] [touch-action:pan-y]">
      <div className="flex items-center justify-between px-4 py-4">
        <button type="button" onClick={() => app.setCardManagerOpen(false)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-[#07111f] shadow-sm">Back</button>
        <h2 className="text-lg font-black">Manage cards</h2>
        <button type="button" onClick={() => setAdding((current) => !current)} className="rounded-full bg-[#ffd347] px-3 py-1.5 text-sm font-black text-black">{adding ? "Close" : "Add"}</button>
      </div>
      <div className="h-[calc(100%-72px)] overflow-y-auto overflow-x-hidden px-4 pb-44 [touch-action:pan-y]">
        <div className="grid max-w-full gap-3 overflow-hidden">
          {app.cards.map((card) => (
            <div key={card.id} className="max-w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/6 p-3">
              <CardListRow card={card} onClick={() => app.setModal({ type: "card", id: card.id })} />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ActionButton tone={card.default ? "primary" : "secondary"} onClick={() => setDefault(card.id)}>{card.default ? "Default card" : "Set default"}</ActionButton>
                <ActionButton tone="danger" onClick={() => removeCard(card.id)}>Remove</ActionButton>
              </div>
            </div>
          ))}
        </div>

        {adding ? (
          <div className="mt-5 rounded-[28px] border border-[#2d79ff]/25 bg-[#2d79ff]/10 p-4">
            <h3 className="text-sm font-black">Add new card</h3>
            <div className="mt-4 grid gap-3">
              <CardInput label="Card nickname" value={form.nickname} placeholder="e.g. Intesa Visa Debit" onChange={(value) => update("nickname", value)} />
              <CardInput label="Cardholder name" value={form.cardholder} placeholder="Francesca Liberatore" onChange={(value) => update("cardholder", value)} />
              <CardInput label="Card number" value={form.number} placeholder="1234 5678 9012 3456" inputMode="numeric" onChange={(value) => update("number", value)} />
              <div className="grid grid-cols-2 gap-3">
                <CardInput label="Expiry" value={form.expiry} placeholder="MM/YY" onChange={(value) => update("expiry", value)} />
                <CardInput label="CVV" value={form.cvv} placeholder="123" inputMode="numeric" onChange={(value) => update("cvv", value)} />
              </div>
              <CardInput label="Issuer / bank" value={form.issuer} placeholder="e.g. Intesa Sanpaolo" onChange={(value) => update("issuer", value)} />
              <div className="grid grid-cols-2 gap-3">
                <CardSelect label="Network" value={form.network} options={["Visa", "Mastercard", "Amex"]} onChange={(value) => update("network", value)} />
                <CardSelect label="Card type" value={form.cardType} options={["Debit", "Credit", "Prepaid", "Premium"]} onChange={(value) => update("cardType", value)} />
              </div>
              <ActionButton className="w-full" onClick={addCard} tone={canAdd ? "primary" : "secondary"} disabled={!canAdd}>Add card to SAVR</ActionButton>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CardInput({
  label,
  value,
  placeholder,
  inputMode,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase text-white/44">{label}</span>
      <input value={value} placeholder={placeholder} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#2d79ff]" />
    </label>
  );
}

function CardSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase text-white/44">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-[#09111f] px-3 py-3 text-sm text-white outline-none transition focus:border-[#2d79ff]">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function TransactionsScreen({ app }: { app: DemoState }) {
  return (
    <div className="absolute inset-0 z-40 bg-[#050816]">
      <div className="flex items-center justify-between px-4 py-4">
        <button type="button" onClick={() => app.setTransactionsOpen(false)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-[#07111f] shadow-sm">Back</button>
        <h2 className="text-lg font-black">All transactions</h2>
        <span className="w-[58px]" aria-hidden="true" />
      </div>
      <div className="h-[calc(100%-72px)] overflow-y-auto overflow-x-hidden px-4 pb-44">
        <div className="grid gap-2">
          {recentTransactions.map((tx) => (
            <button key={tx.id} type="button" onClick={() => app.setModal({ type: "transaction", id: tx.id })} className="rounded-2xl border border-white/10 bg-white/6 p-4 text-left">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{tx.merchant}</p>
                  <p className="mt-1 text-xs text-white/46">{tx.category}</p>
                </div>
                <span className="text-sm font-black">{eur(tx.amount)}</span>
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 text-xs leading-4 text-white/48">{tx.card}</p>
                <span className="shrink-0"><TransactionOutcome tx={tx} /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AllSavingsScreen({ app }: { app: DemoState }) {
  const savingsRows = recentTransactions.filter((tx) => tx.savrAmount > 0);
  return (
    <div className="absolute inset-0 z-40 bg-[#050816] text-white">
      <div className="flex items-center justify-between px-4 py-4">
        <button type="button" onClick={() => app.setAllSavingsOpen(false)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-[#07111f] shadow-sm">Back</button>
        <h2 className="text-lg font-black">All savings</h2>
        <span className="w-[58px]" aria-hidden="true" />
      </div>
      <div className="h-[calc(100%-72px)] overflow-y-auto overflow-x-hidden px-4 pb-44">
        <div className="grid gap-3">
          {savingsRows.map((tx) => <RecentSavingRow key={tx.id} tx={tx} app={app} />)}
        </div>
      </div>
    </div>
  );
}

function AllBenefitsScreen({ app }: { app: DemoState }) {
  const [filter, setFilter] = useState("All");
  const offers = [...app.offers].sort((left, right) => offerPriority(right, app) - offerPriority(left, app));
  const filterOptions = ["All", "Website", "In-store", "App", "Issuer reward", "Card-linked offer", "Public promo code", "Partner offer", "Favourites"];
  const filteredOffers = offers.filter((offer) => {
    if (filter === "All") return true;
    if (filter === "Favourites") return offer.favorite;
    if (filter === "Website" || filter === "In-store" || filter === "App") return formatChannel(offer.channel) === filter;
    return formatOfferType(offer.type) === filter;
  });
  const activeCount = offers.filter((offer) => offer.status !== "snoozed").length;
  const estimatedTotal = offers.reduce((sum, offer) => sum + offer.estimatedSaving, 0);

  return (
    <div className="absolute inset-0 z-40 bg-[#050816] text-white">
      <div className="flex items-center justify-between px-4 py-4">
        <button type="button" onClick={() => app.setAllBenefitsOpen(false)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-[#07111f] shadow-sm">Back</button>
        <h2 className="text-lg font-black">All rewards</h2>
        <span className="w-[58px]" aria-hidden="true" />
      </div>
      <div className="h-[calc(100%-72px)] overflow-y-auto overflow-x-hidden px-4 pb-44">
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Available now" value={String(activeCount)} />
          <Metric label="Tracked value" value={eur(estimatedTotal)} tone="gold" />
        </div>
        <SectionTitle title="Filter rewards" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button key={option} type="button" onClick={() => setFilter(option)} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-bold ${filter === option ? "border-[#ffd347]/50 bg-[#ffd347]/18 text-[#ffd347]" : "border-white/10 bg-white/7 text-white/62"}`}>
              {option}
            </button>
          ))}
        </div>
        <SectionTitle title="Aggregated offers" />
        <div className="grid gap-3">
          {filteredOffers.map((offer) => <OfferCard key={offer.id} offer={offer} app={app} />)}
        </div>
      </div>
    </div>
  );
}

function BenefitsScreen({ app }: { app: DemoState }) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const orderedOffers = [...app.offers].sort((left, right) => offerPriority(right, app) - offerPriority(left, app));
  const reminders = orderedOffers
    .filter((offer) => offer.status !== "snoozed" && offer.estimatedSaving >= app.threshold);
  const showAll = (key: string) => {
    setExpandedSections((current) => ({ ...current, [key]: true }));
    app.setAllBenefitsOpen(true);
  };
  return (
    <ScreenPad>
      <h1 className="text-2xl font-black tracking-normal">Rewards</h1>

      <BenefitOfferSection
        title="Recommended for you"
        offers={reminders}
        app={app}
        expanded={expandedSections.recommended}
        limit={visibleReminderCount(app.mode)}
        onShowAll={() => showAll("recommended")}
      />

      <BenefitOfferSection title="In-store saving nearby" offers={orderedOffers.filter((offer) => offer.channel === "in-store")} app={app} expanded={expandedSections.inStore} onShowAll={() => showAll("inStore")} />
      <BenefitOfferSection title="Expiring soon" offers={orderedOffers.filter((offer) => isExpiryReminder(offer))} app={app} expanded={expandedSections.expiring} onShowAll={() => showAll("expiring")} />
      <BenefitOfferSection title="Favourited offers" offers={orderedOffers.filter((offer) => offer.favorite)} app={app} expanded={expandedSections.favourites} onShowAll={() => showAll("favourites")} />
    </ScreenPad>
  );
}

function BenefitOfferSection({
  title,
  offers,
  app,
  expanded,
  limit = 2,
  onShowAll,
}: {
  title: string;
  offers: ReturnType<typeof useDemoState>["offers"];
  app: DemoState;
  expanded?: boolean;
  limit?: number;
  onShowAll: () => void;
}) {
  const visibleOffers = expanded ? offers : offers.slice(0, limit);
  return (
    <>
      <SectionTitle title={title} action="See all" onClick={onShowAll} />
      {visibleOffers.length ? (
        <div className="grid gap-3">{visibleOffers.map((offer) => <OfferCard key={offer.id} offer={offer} app={app} />)}</div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-white/6 p-4 text-sm text-white/58">No offers here right now.</div>
      )}
    </>
  );
}

function OfferCard({ offer, app }: { offer: ReturnType<typeof useDemoState>["offers"][number]; app: DemoState }) {
  return (
    <div className="max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/6 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <button type="button" onClick={() => app.setModal({ type: "offer", id: offer.id, action: "details" })} className="flex w-full min-w-0 items-start gap-3 text-left">
        <IssuerLogo issuer={offer.bestCard} cardName={offer.bestCard} />
        <div className="min-w-0 flex-1">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
            <div className="min-w-0">
              <p className="font-bold">{offer.merchant}</p>
            </div>
            <p className="max-w-[104px] truncate rounded-full border border-[#7ee5a7]/25 bg-[#7ee5a7]/12 px-2.5 py-1 text-center text-[10px] font-black leading-none text-[#7ee5a7]">{offerValueLabel(offer)}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Pill tone="blue">{formatOfferType(offer.type)}</Pill>
            <Pill>{formatChannel(offer.channel)}</Pill>
          </div>
          <div className="mt-3 grid gap-1 text-xs text-white/48">
            <p className="truncate">Best card: {offer.bestCard}</p>
            <p className="truncate">Expires: {offer.expiry}</p>
          </div>
        </div>
      </button>
      <div className="mt-4">
        <OfferActionButton className="w-full" tone={offerRequiresActivation(offer) ? "secondary" : "primary"} onClick={() => handleOfferPrimary(offer, app)}>{offerRequiresActivation(offer) ? "Activate" : "Use"}</OfferActionButton>
      </div>
    </div>
  );
}

function OfferActionButton({
  children,
  onClick,
  tone = "default",
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  tone?: "default" | "primary" | "secondary";
  className?: string;
}) {
  const styles = {
    default: "border-white/10 bg-white/7 text-white/78 hover:bg-white/11",
    primary: "border-[#2d79ff]/40 bg-[#2d79ff]/18 text-white hover:bg-[#2d79ff]/26",
    secondary: "border-[#ffd347]/35 bg-[#ffd347]/14 text-[#ffd347] hover:bg-[#ffd347]/20",
  };
  return (
    <button type="button" onClick={onClick} className={`min-w-0 rounded-2xl border px-3 py-2.5 text-xs font-black transition active:scale-[0.98] ${styles[tone]} ${className}`}>
      <span className="block truncate">{children}</span>
    </button>
  );
}

function ReminderCard({ title, body, actions }: { title: string; body: string; actions: Array<[string, () => void]> }) {
  return (
    <div className="rounded-3xl border border-[#2d79ff]/30 bg-[#2d79ff]/12 p-4">
      <p className="font-bold">{title}</p>
      <p className="mt-2 text-xs leading-5 text-white/62">{body}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">{actions.map(([label, action]) => <ActionButton key={label} tone="secondary" onClick={action}>{label}</ActionButton>)}</div>
    </div>
  );
}

function DifferenceScreen({ app }: { app: DemoState }) {
  const savedTransactions = recentTransactions.filter((tx) => tx.savrStatus === "saved" && tx.savrAmount > 0);
  const missedTransactions = recentTransactions.filter((tx) => tx.savrStatus === "missed" && tx.savrAmount > 0);
  const saved = transactionSavedTotal();
  const missed = missedTransactions.reduce((sum, tx) => sum + tx.savrAmount, 0);

  return (
    <ScreenPad>
      <h1 className="text-2xl font-black tracking-normal">SAVR Difference</h1>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Money saved" value={eur(saved)} />
        <Metric label="Missed savings" value={eur(missed)} tone="gold" />
        <Metric label="Offers used" value={String(savedTransactions.length)} />
        <Metric label="Offers missed" value={String(missedTransactions.length)} tone="gold" />
      </div>
      <SectionTitle title="Breakdown by category" />
      <CategoryBreakdown />
      <SectionTitle title="Recent savings" action="See all" onClick={() => app.setAllSavingsOpen(true)} />
      <div className="grid gap-3">
        {recentTransactions.filter((tx) => tx.savrAmount > 0).slice(0, 4).map((tx) => <RecentSavingRow key={tx.id} tx={tx} app={app} />)}
      </div>
    </ScreenPad>
  );
}

function Metric({ label, value, tone = "blue" }: { label: string; value: string; tone?: "blue" | "gold" }) {
  return <div className="rounded-3xl border border-white/10 bg-white/6 p-4"><p className="text-xs text-white/46">{label}</p><p className={`mt-2 text-xl font-black tracking-normal ${tone === "gold" ? "text-[#ef4444]" : "text-[#16a34a]"}`}>{value}</p></div>;
}

function CategoryBreakdown() {
  const categories = ["Fashion", "Groceries", "Food delivery", "Transport", "Subscriptions", "Beauty"];
  const values = categories.map((category) => ({
    category,
    saved: recentTransactions
      .filter((tx) => tx.category === category && tx.savrStatus === "saved")
      .reduce((sum, tx) => sum + tx.savrAmount, 0),
    missed: recentTransactions
      .filter((tx) => tx.category === category && tx.savrStatus === "missed")
      .reduce((sum, tx) => sum + tx.savrAmount, 0),
  }));
  const max = Math.max(...values.map((item) => item.saved + item.missed), 1);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/6 p-4">
      <div className="grid gap-4">
        {values.map(({ category, saved, missed }) => {
          const total = saved + missed;
          const savedWidth = total ? (saved / max) * 100 : 0;
          const missedWidth = total ? (missed / max) * 100 : 0;
          return (
          <div key={category}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-black tracking-normal">{category}</p>
              <p className="shrink-0 text-sm font-black text-white/58"><span className="text-[#16a34a]">{eur(saved)}</span> <span className="text-[#ef4444]">+{eur(missed)}</span></p>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/8">
              <div className="flex h-full">
                <div className="h-full bg-[#16a34a]" style={{ width: `${savedWidth}%` }} />
                <div className="h-full bg-[#ef4444]" style={{ width: `${missedWidth}%` }} />
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentSavingRow({ tx, app }: { tx: (typeof recentTransactions)[number]; app: DemoState }) {
  const missed = tx.savrStatus === "missed";
  return (
    <button type="button" onClick={() => app.setModal({ type: "transaction", id: tx.id })} className="rounded-2xl border border-white/10 bg-white/6 p-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{tx.merchant}</p>
          <p className="mt-1 truncate text-xs text-white/46">{tx.category} · {tx.card}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-sm font-black ${missed ? "text-[#ff8f80]" : "text-[#7ee5a7]"}`}>{missed ? "-" : "+"}{eur(tx.savrAmount)}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/34">{missed ? "Missed" : "Saved"}</p>
        </div>
      </div>
    </button>
  );
}

function InsightCard({
  title,
  body,
  action,
  onClick,
}: {
  title: string;
  body: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
      <p className="text-sm font-black">{title}</p>
      <p className="mt-2 text-xs leading-5 text-white/62">{body}</p>
      <ActionButton className="mt-3 w-full" tone="secondary" onClick={onClick}>{action}</ActionButton>
    </div>
  );
}

function AdvisorScreen({ app }: { app: DemoState }) {
  return (
    <ScreenPad>
      <h1 className="text-2xl font-black tracking-normal">Personal Advisor</h1>
      <SectionTitle title="SAVR insights" />
      <div className="grid gap-3">
        <InsightCard
          title="Fashion is where you miss most"
          body="Your missed savings are concentrated in fashion purchases, especially SHEIN and Sephora. Keep fashion alerts active before online checkout."
          action="View fashion offers"
          onClick={() => app.setTab("benefits")}
        />
        <InsightCard
          title="Your favourite categories are shifting"
          body="You have recently spent more on shoes and sportswear. Add Nike and footwear to your favourites so SAVR can prioritise those offers."
          action="Edit favourites"
          onClick={() => app.setModal({ type: "settings", section: "Favourites" })}
        />
        <InsightCard
          title="Last month was strong"
          body="You captured most available savings on groceries, transport, and Zara checkout. Your biggest opportunity is still activating rewards before paying."
          action="Review savings"
          onClick={() => app.setTab("difference")}
        />
      </div>
      <SectionTitle title="Third-party AI plug-in" />
      <div className="grid grid-cols-2 gap-2">
        {[
          ["ChatGPT", "chatgpt"],
          ["Gemini", "gemini"],
          ["Claude", "claude"],
          ["Grok", "grok"],
        ].map(([name, key]) => <button key={name} type="button" onClick={() => app.setModal({ type: "plugin", key: key as ExternalLinkKey, name })} className="rounded-2xl border border-white/10 bg-white/6 p-3 text-left text-sm">{name}</button>)}
      </div>
    </ScreenPad>
  );
}

function SettingsScreen({ app }: { app: DemoState }) {
  const rows = ["Account details", "Cards", "Favorite stores", "Favorite categories", "Alert preferences", "Notification settings", "Privacy / data permissions", "Help & support", "Terms and privacy"];
  function openRow(row: string) {
    if (row === "Cards") {
      app.setSettingsOpen(false);
      app.setCardManagerOpen(true);
      return;
    }
    app.setModal({ type: "settings", section: row });
  }
  return (
    <div className="absolute inset-0 z-40 bg-[#050816]">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-xl font-black">Profile</h2>
        <button type="button" onClick={() => app.setSettingsOpen(false)} className="rounded-full border border-white/10 px-3 py-1.5 text-sm">Close</button>
      </div>
      <div className="h-[calc(100%-72px)] overflow-y-auto overflow-x-hidden px-4 pb-44">
        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#2d79ff] to-[#ffd347] font-black text-black">FL</div>
            <div><p className="font-bold">{userProfile.name}</p></div>
          </div>
        </div>
        <SectionTitle title="Settings" />
        <div className="grid gap-2">{rows.map((row) => <button key={row} type="button" onClick={() => openRow(row)} className="rounded-2xl border border-white/10 bg-white/6 p-3 text-left text-sm">{row}</button>)}</div>
        <ActionButton className="mt-4 w-full" tone="danger" onClick={() => app.setModal({ type: "logout" })}>Log out</ActionButton>
      </div>
    </div>
  );
}

function SettingsSubScreen({ section, app, close }: { section: string; app: DemoState; close: () => void }) {
  if (section === "Account details") {
    return (
      <SheetSection title="Account details">
        <AccountDetailsForm close={close} />
      </SheetSection>
    );
  }
  if (section === "Alert preferences") {
    const timingIndex = Math.max(0, timingOptions.indexOf(app.timing));
    return (
      <SheetSection title="Alert preferences">
        <SectionTitle title="SAVR mode" />
        <div className="grid grid-cols-2 gap-2">
          <ActionButton onClick={() => app.setMode("active")} tone={app.mode === "active" ? "primary" : "secondary"}>Active</ActionButton>
          <ActionButton onClick={() => app.setMode("passive")} tone={app.mode === "passive" ? "primary" : "secondary"}>Passive</ActionButton>
        </div>
        <p className="mt-3 text-xs leading-5 text-white/48">{app.mode === "active" ? "SAVR proactively surfaces offers at your favorite stores, nearby stores, and likely spending moments." : "SAVR only reminds you at checkout or when you directly check SAVR."}</p>
        <SectionTitle title="Threshold" />
        <input type="range" min={1} max={20} value={app.threshold} onChange={(event) => { const value = Number(event.target.value); app.setThreshold(value); app.setCustomThreshold(value); }} className="w-full accent-[#9dccff]" />
        <p className="mt-2 text-sm text-white/82">Custom threshold: EUR {app.threshold}</p>
        <SectionTitle title="Timing" />
        <input type="range" min={0} max={timingOptions.length - 1} value={timingIndex} onChange={(event) => app.setTiming(timingOptions[Number(event.target.value)])} className="w-full accent-[#9dccff]" />
        <p className="mt-2 text-sm text-white/82">Timing: {app.timing}</p>
        <ActionButton className="mt-4 w-full" onClick={close}>Save alert preferences</ActionButton>
      </SheetSection>
    );
  }
  if (section === "Notification settings") {
    return (
      <SheetSection title="Notification settings">
        <div className="grid gap-2">{notificationTypes.map((item) => <ToggleRow key={item} label={item} active={app.notifications[item]} onClick={() => app.setNotifications({ ...app.notifications, [item]: !app.notifications[item] })} />)}</div>
      </SheetSection>
    );
  }
  if (section === "Privacy / data permissions") {
    return (
      <SheetSection title="Privacy / data permissions">
        <p className="text-sm leading-6 text-white/66">Review how SAVR uses card, transaction, offer, and notification data.</p>
        <ActionButton className="mt-4 w-full" onClick={() => undefined}>Open privacy page</ActionButton>
      </SheetSection>
    );
  }
  if (section === "Help & support") {
    return (
      <SheetSection title="Help & support">
        <p className="text-sm leading-6 text-white/66">Get support for cards, offers, notifications, account access, and savings corrections.</p>
        <ActionButton className="mt-4 w-full" onClick={() => undefined}>Open help centre</ActionButton>
      </SheetSection>
    );
  }
  if (section === "Terms and privacy") {
    return (
      <SheetSection title="Terms and privacy">
        <p className="text-sm leading-6 text-white/66">Read SAVR terms, privacy notice, cookie settings, and card-linking conditions.</p>
        <ActionButton className="mt-4 w-full" onClick={() => undefined}>Open terms page</ActionButton>
      </SheetSection>
    );
  }
  if (section === "Favourites") {
    const stores = ["Zara", "Nike", "Esselunga", "Glovo", "SHEIN", "Sephora", "Trenitalia"];
    const categories = ["Fashion", "Groceries", "Food delivery", "Transport", "Beauty", "Travel", "Subscriptions", "Footwear"];
    return (
      <SheetSection title="Edit favourites">
        <SectionTitle title="Favorite stores" />
        <EditablePills values={stores} selected={app.favoriteStores} setSelected={app.setFavoriteStores} addLabel="Add store" />
        <SectionTitle title="Favorite categories" />
        <EditablePills values={categories} selected={app.favoriteCategories} setSelected={app.setFavoriteCategories} addLabel="Add category" />
      </SheetSection>
    );
  }
  if (section === "Favorite stores") {
    const all = ["Zara", "Nike", "Esselunga", "Glovo", "SHEIN", "Sephora", "Trenitalia"];
    return <SheetSection title={section}><EditablePills values={all} selected={app.favoriteStores} setSelected={app.setFavoriteStores} addLabel="Add store" /></SheetSection>;
  }
  if (section === "Favorite categories") {
    const all = ["Fashion", "Groceries", "Food delivery", "Transport", "Beauty", "Travel", "Subscriptions", "Footwear"];
    return <SheetSection title={section}><EditablePills values={all} selected={app.favoriteCategories} setSelected={app.setFavoriteCategories} addLabel="Add category" /></SheetSection>;
  }
  if (section === "Partners & links" || section === "Terms and privacy") {
    return (
      <SheetSection title={section}>
        <div className="grid grid-cols-2 gap-2">
          {partnerLinks.map(([label, key]) => <a key={key} href={externalLinks[key]} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/6 p-3 text-sm text-[#69a8ff]">{label}</a>)}
        </div>
      </SheetSection>
    );
  }
  return (
    <SheetSection title={section}>
      <p className="text-sm leading-6 text-white/66">Update your {section.toLowerCase()} preferences here.</p>
      <ActionButton className="mt-4 w-full" onClick={() => { app.setToast(`${section} saved`); close(); }}>Save demo preference</ActionButton>
    </SheetSection>
  );
}

function AccountDetailsForm({ close }: { close: () => void }) {
  const [details, setDetails] = useState({
    name: userProfile.name,
    email: "francesca.liberatore@example.com",
    phone: "+39 333 482 1190",
    dob: "14/09/2001",
    address: "Via Torino 24",
    city: "Milan",
    postalCode: "20123",
    country: "Italy",
    residency: "Italy",
  });
  const update = (key: keyof typeof details, value: string) => setDetails((current) => ({ ...current, [key]: value }));
  return (
    <>
      <div className="grid gap-3">
        <CardInput label="Full name" value={details.name} placeholder="Full name" onChange={(value) => update("name", value)} />
        <CardInput label="Email" value={details.email} placeholder="Email" onChange={(value) => update("email", value)} />
        <CardInput label="Phone" value={details.phone} placeholder="Phone" onChange={(value) => update("phone", value)} />
        <CardInput label="Date of birth" value={details.dob} placeholder="DD/MM/YYYY" onChange={(value) => update("dob", value)} />
        <CardInput label="Street address" value={details.address} placeholder="Street address" onChange={(value) => update("address", value)} />
        <CardInput label="City" value={details.city} placeholder="City" onChange={(value) => update("city", value)} />
        <CardInput label="Postal code" value={details.postalCode} placeholder="Postal code" onChange={(value) => update("postalCode", value)} />
        <CardInput label="Country" value={details.country} placeholder="Country" onChange={(value) => update("country", value)} />
        <CardInput label="Tax residency" value={details.residency} placeholder="Country" onChange={(value) => update("residency", value)} />
      </div>
      <ActionButton className="mt-4 w-full" onClick={close}>Save account details</ActionButton>
    </>
  );
}

function EditablePills({ values, selected, setSelected, addLabel }: { values: string[]; selected: string[]; setSelected: (values: string[]) => void; addLabel: string }) {
  const [draft, setDraft] = useState("");
  const options = Array.from(new Set([...values, ...selected]));
  function addValue() {
    const value = draft.trim();
    if (!value) return;
    setSelected(selected.includes(value) ? selected : [...selected, value]);
    setDraft("");
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((value) => {
          const active = selected.includes(value);
          return <button key={value} type="button" onClick={() => setSelected(active ? selected.filter((item) => item !== value) : [...selected, value])} className={`rounded-full px-3 py-2 text-xs ${active ? "bg-[#ffd347] text-black" : "bg-white/8 text-white/60"}`}>{value}</button>;
        })}
      </div>
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={addLabel} className="min-w-0 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#2d79ff]" />
        <ActionButton tone="secondary" onClick={addValue}>Add</ActionButton>
      </div>
    </div>
  );
}

function ToggleRow({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/6 p-3 text-left text-sm capitalize">
      {label}
      <span className={`h-6 w-11 rounded-full p-1 ${active ? "bg-[#2d79ff]" : "bg-white/14"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${active ? "translate-x-5" : ""}`} /></span>
    </button>
  );
}

function ScreenPad({ children }: { children: React.ReactNode }) {
  return <div className="w-full max-w-full overflow-x-hidden px-4 pb-44 pt-1 [touch-action:pan-y]">{children}</div>;
}

function SectionTitle({ title, action, onClick }: { title: string; action?: string; onClick?: () => void }) {
  return (
    <div className="mb-3 mt-6 flex items-center justify-between gap-3">
      <h2 className="text-sm font-black tracking-normal">{title}</h2>
      {action && onClick ? <button type="button" onClick={onClick} className="text-xs text-[#69a8ff]">{action}</button> : null}
    </div>
  );
}

function LockedState({ app }: { app: DemoState }) {
  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-[#f7f9fc] px-6 text-center text-[#07111f]">
      <div>
        <SavrLogo />
        <h1 className="mt-8 text-2xl font-black">Signed out</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">You are signed out of SAVR on this phone.</p>
        <ActionButton className="mt-6 w-full" onClick={() => { app.setSignedOut(false); app.setToast("Welcome back"); }}>Return to SAVR</ActionButton>
      </div>
    </div>
  );
}

function PasscodeScreen({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function press(value: string) {
    setError("");
    const next = `${code}${value}`.slice(0, 4);
    setCode(next);
    if (next.length === 4) {
      if (next === "0007") {
        onUnlock();
      } else {
        setError("Incorrect passcode");
        setCode("");
      }
    }
  }

  return (
    <div className="absolute inset-0 z-[80] flex flex-col bg-[#f7f9fc] px-6 py-8 text-center text-[#07111f]">
      <div className="mt-10 flex justify-center">
        <PasscodeLogo />
      </div>
      <div className="mt-16">
        <p className="text-sm text-slate-500">Enter passcode</p>
        <div className="mt-5 flex justify-center gap-3">
          {[0, 1, 2, 3].map((item) => <span key={item} className={`h-3 w-3 rounded-full ${code.length > item ? "bg-[#ffd347]" : "bg-slate-300"}`} />)}
        </div>
        <p className="mt-4 h-5 text-xs text-[#ff8f80]">{error}</p>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-3 pb-10">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((value) => (
          <button key={value} type="button" onClick={() => press(value)} className="grid h-16 place-items-center rounded-full border border-slate-200 bg-white text-xl font-black shadow-sm active:scale-[0.98]">{value}</button>
        ))}
        <span />
        <button type="button" onClick={() => press("0")} className="grid h-16 place-items-center rounded-full border border-slate-200 bg-white text-xl font-black shadow-sm active:scale-[0.98]">0</button>
        <button type="button" aria-label="Delete digit" onClick={() => setCode((current) => current.slice(0, -1))} className="grid h-16 place-items-center rounded-full border border-slate-200 bg-white shadow-sm active:scale-[0.98]">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
            <path d="M10 6 4 12l6 6h8.5A2.5 2.5 0 0 0 21 15.5v-7A2.5 2.5 0 0 0 18.5 6H10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="m11 9 6 6M17 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function SavrDemo() {
  const app = useDemoState();
  const [unlocked, setUnlocked] = useState(false);
  const screen =
    app.tab === "account" ? <AccountScreen app={app} /> :
    app.tab === "benefits" ? <BenefitsScreen app={app} /> :
    app.tab === "difference" ? <DifferenceScreen app={app} /> :
    <AdvisorScreen app={app} />;

  return (
    <div className="flex h-screen items-start justify-center overflow-hidden px-4 py-0">
      <PhoneFrame>
        <MobileScreen>
          <div className={`relative flex-1 overflow-hidden [touch-action:pan-y] ${unlocked ? "light-app text-[#07111f]" : "text-white"}`}>
            {!unlocked ? (
              <PasscodeScreen onUnlock={() => setUnlocked(true)} />
            ) : (
              <>
                <AppHeader onProfile={() => app.setSettingsOpen(true)} />
                <div className="h-full overflow-y-auto overflow-x-hidden [touch-action:pan-y]">{screen}</div>
                <BottomTabs tab={app.tab} setTab={app.setTab} />
                {app.settingsOpen && <SettingsScreen app={app} />}
                {app.cardManagerOpen && <CardManagerScreen app={app} />}
                {app.transactionsOpen && <TransactionsScreen app={app} />}
                {app.allBenefitsOpen && <AllBenefitsScreen app={app} />}
                {app.allSavingsOpen && <AllSavingsScreen app={app} />}
                {app.signedOut && <LockedState app={app} />}
                <ModalSheet modal={app.modal} close={() => app.setModal(null)} app={app} onLock={() => setUnlocked(false)} />
              </>
            )}
          </div>
        </MobileScreen>
      </PhoneFrame>
    </div>
  );
}
