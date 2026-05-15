"use client";

import { useState, type InputHTMLAttributes } from "react";

import { PhoneFrame } from "@/components/phone-frame";
import { MobileScreen } from "@/components/mobile-screen";
import { externalLinks, ExternalLinkKey } from "@/data/links";
import {
  advisorPrompts,
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
import { bestOfferForMerchant, recommendationScore, visibleReminderCount } from "@/lib/recommendations";

type Modal =
  | { type: "card"; id: string }
  | { type: "tink" }
  | { type: "offer"; id: string; action: "use" | "activate" | "details" }
  | { type: "snooze"; id: string }
  | { type: "settings"; section: string }
  | { type: "logout" }
  | { type: "ar" }
  | { type: "event"; id: string }
  | { type: "receipt"; id: string; mode: "upload" | "manual" }
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
  billingAddress: string;
};

const baselineSavedThisMonth = 318.9;
const baselineMissedThisMonth = 120;

const tabs: Array<{ id: AppTab; label: string; icon: string }> = [
  { id: "account", label: "Account", icon: "◼" },
  { id: "benefits", label: "Benefits", icon: "◆" },
  { id: "difference", label: "SAVR Difference", icon: "△" },
  { id: "advisor", label: "Personal Advisor", icon: "◎" },
];

const notificationTypes = ["website", "in-store", "app", "expiry", "new card suggestion"];
const thresholdOptions = [2, 5, 10];
const timingOptions = ["immediate", "after 30 seconds in store", "after 2 minutes in store", "only at checkout"];
const initialCards: ConnectedCard[] = connectedAccounts.map((card, index) => ({
  ...card,
  network: card.name.includes("Mastercard") ? "MC" : "VISA",
  last4: ["4821", "9034", "1177", "5562", "----"][index],
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
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 132 96" className="h-8 w-10 shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="phoneBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f6fff" />
            <stop offset="100%" stopColor="#1140b3" />
          </linearGradient>
          <linearGradient id="phoneGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd347" />
            <stop offset="100%" stopColor="#f2a900" />
          </linearGradient>
        </defs>
        <g transform="translate(8 8)">
          <path d="M16 16c0-6.4 7.1-10.3 12.5-7l45 27.3c5 3 5 10.2 0 13.2l-45 27.2C23.1 80 16 76.1 16 69.6V16Z" fill="url(#phoneBlue)" transform="rotate(-33 44 40)" />
          <path d="M16 16c0-6.4 7.1-10.3 12.5-7l45 27.3c5 3 5 10.2 0 13.2l-45 27.2C23.1 80 16 76.1 16 69.6V16Z" fill="url(#phoneGold)" transform="rotate(33 42 40)" />
        </g>
      </svg>
      <div className="text-xl font-black tracking-normal">
        <span className="bg-gradient-to-b from-[#2d79ff] to-[#1140b3] bg-clip-text text-transparent">SAV</span>
        <span className="bg-gradient-to-b from-[#ffd347] to-[#f2a900] bg-clip-text text-transparent">R</span>
      </div>
    </div>
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
    danger: "border border-red-300/20 bg-red-400/12 text-red-100",
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`rounded-2xl px-3 py-2 text-xs font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${classes[tone]} ${className}`}>
      {children}
    </button>
  );
}

function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "blue" | "gold" | "green" }) {
  const classes = {
    default: "bg-white/8 text-white/60",
    blue: "bg-[#2d79ff]/14 text-[#8fc2ff]",
    gold: "bg-[#ffd347]/14 text-[#ffd347]",
    green: "bg-[#7ee5a7]/14 text-[#7ee5a7]",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes[tone]}`}>{children}</span>;
}

function AppHeader({ onProfile }: { onProfile: () => void }) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-[linear-gradient(180deg,rgba(5,8,22,0.96),rgba(5,8,22,0.76),transparent)] px-4 pb-3 pt-3 backdrop-blur-md">
      <SavrLogo />
      <button type="button" onClick={onProfile} aria-label="Open profile settings" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/8 text-sm font-bold">
        FL
      </button>
    </div>
  );
}

function BottomTabs({ tab, setTab }: { tab: AppTab; setTab: (tab: AppTab) => void }) {
  return (
    <div className="absolute inset-x-3 bottom-3 z-30 rounded-[28px] border border-white/10 bg-[#09111f]/96 p-2 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((item) => (
          <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`rounded-2xl px-1 py-2 text-center transition ${tab === item.id ? "bg-white/12 text-white" : "text-white/42"}`}>
            <div className="text-sm">{item.icon}</div>
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
}: {
  modal: Modal;
  close: () => void;
  app: DemoState;
}) {
  if (!modal) return null;

  const offer = modal.type === "offer" || modal.type === "snooze" ? app.offers.find((item) => item.id === modal.id) : null;
  const card = modal.type === "card" ? app.cards.find((item) => item.id === modal.id) : null;
  const detail = modal.type === "card" ? cardDetails.find((item) => item.id === modal.id) : null;
  const event = modal.type === "event" || modal.type === "receipt" ? app.events.find((item) => item.id === modal.id) : null;

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/58 backdrop-blur-sm" onClick={close}>
      <div className="max-h-[82%] w-full overflow-y-auto rounded-t-[30px] border border-white/10 bg-[#08111f] p-4 shadow-2xl" onClick={(eventClick) => eventClick.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/16" />

        {modal.type === "tink" && (
          <SheetSection title="Tink secure reconnect">
            <p className="text-sm leading-6 text-white/64">Demo secure connection. SAVR refreshes card and spending insights through a Tink-style consent flow.</p>
            <div className="mt-4 flex gap-2">
              <ActionButton onClick={() => { app.setTinkConnected(true); app.setToast("Tink connection refreshed"); close(); }}>Confirm connection</ActionButton>
              <ActionButton tone="secondary" onClick={close}>Cancel</ActionButton>
            </div>
            <div className="mt-4 flex gap-3 text-sm">
              <ExternalTextLink linkKey="tink">Tink</ExternalTextLink>
              <ExternalTextLink linkKey="visa">Visa</ExternalTextLink>
            </div>
          </SheetSection>
        )}

        {card && (
          <SheetSection title={card.name}>
            <div className="grid gap-2 text-sm text-white/68">
              <p>Issuer: {card.issuer}</p>
              <p>Card type: {card.type}</p>
              <p>Connected status: connected</p>
              <p>Card ending: •••• {card.last4 || "0000"}</p>
            </div>
            <h4 className="mt-4 text-sm font-bold">Active benefits</h4>
            <div className="mt-2 grid gap-2">{(detail?.activeBenefits || ["Eligible for SAVR merchant matching", "Used in best-card recommendations"]).map((item) => <Panel key={item}>{item}</Panel>)}</div>
            <h4 className="mt-4 text-sm font-bold">Recommended use cases</h4>
            <div className="mt-2 flex flex-wrap gap-2">{(detail?.recommendedUse || ["New purchases", "Merchant offers"]).map((item) => <Pill key={item} tone="blue">{item}</Pill>)}</div>
            <ActionButton className="mt-4 w-full" onClick={() => openExternal(card.linkKey)}>Open issuer website</ActionButton>
          </SheetSection>
        )}

        {offer && modal.type === "offer" && (
          <SheetSection title={offer.merchant}>
            <p className="text-sm text-white/60">{offer.title}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Panel>Best card: {offer.bestCard}</Panel>
              <Panel>Saving: {eur(offer.estimatedSaving)}</Panel>
              <Panel>Channel: {offer.channel}</Panel>
              <Panel>Expiry: {offer.expiry}</Panel>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/66">{offer.why}</p>
            <p className="mt-2 text-xs leading-5 text-white/42">{offer.restrictions}</p>
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
                    <p className="text-sm leading-6 text-white/66">Show this demo QR at checkout and pay with {offer.bestCard}.</p>
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
                <p className="mt-2 text-xs leading-5 text-white/62">Simulated deep link opened for {offer.bestCard}. SAVR records the benefit as activated before checkout.</p>
              </div>
            )}
            {modal.action === "details" && (
              <div className="mt-4 grid gap-2">
                <Panel>Recommendation score: {app.scoreOffer(offer.id)}</Panel>
                <Panel>Favorite match: {app.favoriteStores.includes(offer.merchant) || app.favoriteCategories.includes(offer.category) ? "yes" : "no"}</Panel>
                <Panel>Previous missed saving: {app.missedMerchants.includes(offer.merchant) ? "yes" : "no"}</Panel>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionButton onClick={() => { modal.action === "activate" ? app.activateOffer(offer.id) : app.useOffer(offer.id); close(); }}>{modal.action === "activate" ? "Activate demo" : "Confirm use"}</ActionButton>
              <ActionButton tone="secondary" onClick={() => openExternal(offer.linkKey)}>Open partner</ActionButton>
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
            <p className="text-sm text-white/62">This signs Francesca out of the demo phone and shows a locked state.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionButton tone="danger" onClick={() => { app.setSignedOut(true); close(); }}>Confirm log out</ActionButton>
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
              <ActionButton tone="quiet" onClick={() => { app.setTab("advisor"); close(); }}>View recommendation</ActionButton>
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
            <p className="text-sm leading-6 text-white/66">Demo plug-in enabled: SAVR can answer card and offer questions inside this assistant.</p>
            <div className="mt-4 rounded-2xl bg-white/6 p-3 text-sm">@SAVR what card should I use at Zara?<br /><span className="text-[#7ee5a7]">Use Revolut + SAVE10 today. Estimated saving: EUR 7.50. I can also remind you before checkout.</span></div>
            <ActionButton className="mt-4 w-full" onClick={() => openExternal(modal.key)}>Open {modal.name}</ActionButton>
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

type DemoState = ReturnType<typeof useDemoState>;

function useDemoState() {
  const [tab, setTab] = useState<AppTab>("account");
  const [modal, setModal] = useState<Modal>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cardManagerOpen, setCardManagerOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const [cards, setCards] = useState<ConnectedCard[]>(initialCards);
  const [mode, setMode] = useState<SavrMode>("active");
  const [threshold, setThreshold] = useState(5);
  const [customThreshold, setCustomThreshold] = useState(7);
  const [timing, setTiming] = useState("after 2 minutes in store");
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    website: true,
    "in-store": true,
    app: true,
    expiry: true,
    "new card suggestion": false,
  });
  const [favoriteStores, setFavoriteStores] = useState(defaultFavorites.stores);
  const [favoriteCategories, setFavoriteCategories] = useState(defaultFavorites.categories);
  const [offerState, setOfferState] = useState<OfferState>({});
  const [eventStatuses, setEventStatuses] = useState<EventState>({});
  const [toast, setToast] = useState("");
  const [tinkConnected, setTinkConnected] = useState(true);

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
    setToast(`${offer.merchant} benefit activated`);
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
    return recommendationScore({
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
    setSignedOut(false);
    setCards(initialCards);
    setMode("active");
    setThreshold(5);
    setCustomThreshold(7);
    setTiming("after 2 minutes in store");
    setNotifications({ website: true, "in-store": true, app: true, expiry: true, "new card suggestion": false });
    setFavoriteStores(defaultFavorites.stores);
    setFavoriteCategories(defaultFavorites.categories);
    setOfferState({});
    setEventStatuses({});
    setToast("Demo reset");
    setTinkConnected(true);
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
    tinkConnected,
    setTinkConnected,
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
      </div>

      <SectionTitle title="Connected cards" action="Manage cards" onClick={() => app.setCardManagerOpen(true)} />
      <div className="grid gap-3">
        {app.cards.map((card) => (
          <CardListRow key={card.id} card={card} onClick={() => app.setModal({ type: "card", id: card.id })} />
        ))}
      </div>

      <SectionTitle title="Tink-powered insight" />
      <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
        <p className="text-sm font-bold">Top categories: fashion, groceries, delivery, transport</p>
        <p className="mt-2 text-xs leading-5 text-white/52">SAVR uses Tink-style transaction insights to infer purchase moments and match cards, merchant offers, and issuer benefits.</p>
      </div>

      <SectionTitle title="Recent transactions" />
      <div className="grid gap-2">
        {recentTransactions.map((tx) => (
          <button key={tx.id} type="button" onClick={() => app.setModal({ type: "message", title: tx.merchant, body: `${tx.card} · ${tx.category} · ${eur(tx.amount)}. SAVR checks this pattern for future reminders.` })} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left">
            <div>
              <p className="text-sm font-semibold">{tx.merchant}</p>
              <p className="text-xs text-white/42">{tx.category} · {tx.card}</p>
            </div>
            <span className="text-sm">{eur(tx.amount)}</span>
          </button>
        ))}
      </div>
    </ScreenPad>
  );
}

function CardListRow({ card, onClick }: { card: ConnectedCard; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/6 p-3 text-left transition hover:bg-white/9">
      <div className={`grid h-10 w-12 shrink-0 place-items-center rounded-2xl text-[11px] font-black ${card.default ? "bg-[#1b67ff] text-white" : "bg-[#111318] text-white"}`}>
        {card.network || "VISA"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black">{card.name}</p>
        <p className="mt-1 truncate text-xs text-white/48">•••• {card.last4 || "0000"} · {card.issuer}</p>
      </div>
      {card.default ? <span className="rounded-full bg-[#ffd347] px-2.5 py-1 text-[10px] font-black text-black">Default</span> : null}
    </button>
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
    billingAddress: "Milan, Italy",
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
    <div className="absolute inset-0 z-40 bg-[#050816]">
      <div className="flex items-center justify-between px-4 py-4">
        <button type="button" onClick={() => app.setCardManagerOpen(false)} className="rounded-full border border-white/10 px-3 py-1.5 text-sm">Back</button>
        <h2 className="text-lg font-black">Manage cards</h2>
        <button type="button" onClick={() => setAdding((current) => !current)} className="rounded-full bg-[#ffd347] px-3 py-1.5 text-sm font-black text-black">{adding ? "Close" : "Add"}</button>
      </div>
      <div className="h-[calc(100%-72px)] overflow-y-auto px-4 pb-28">
        <div className="grid gap-3">
          {app.cards.map((card) => (
            <div key={card.id} className="rounded-[24px] border border-white/10 bg-white/6 p-3">
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
              <CardInput label="Billing address" value={form.billingAddress} placeholder="Street, city, country" onChange={(value) => update("billingAddress", value)} />
              <div className="rounded-2xl border border-white/10 bg-white/6 p-3 text-xs leading-5 text-white/56">
                Demo only: card data is stored locally in this browser session and no banking connection is made.
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

function BenefitsScreen({ app }: { app: DemoState }) {
  const reminders = app.offers
    .filter((offer) => offer.status !== "snoozed" && offer.estimatedSaving >= app.threshold)
    .sort((left, right) => app.scoreOffer(right.id) - app.scoreOffer(left.id))
    .slice(0, visibleReminderCount(app.mode));
  const passiveCopy = app.mode === "passive" ? "Passive mode keeps this available only when Francesca checks SAVR or reaches checkout." : null;
  return (
    <ScreenPad>
      <h1 className="text-2xl font-black tracking-normal">Benefits</h1>
      <ModeNotice app={app} />

      <SectionTitle title="Recommended for Francesca" />
      <div className="grid gap-3">{reminders.map((offer) => <OfferCard key={offer.id} offer={offer} app={app} />)}</div>

      <SectionTitle title="Website reminder enabled" />
      <ReminderCard title={app.mode === "active" ? "Zara checkout detected" : "Zara saving available if checked"} body={`${passiveCopy || "SAVR recommends Revolut + code SAVE10."} Minimum saving threshold: EUR ${app.threshold}.`} actions={[
        ["Copy code", () => navigator.clipboard?.writeText("SAVE10").then(() => app.setToast("SAVE10 copied")).catch(() => app.setToast("SAVE10 copied"))],
        ["Apply demo saving", () => app.useOffer("zara-revolut")],
        ["Snooze", () => app.setModal({ type: "snooze", id: "zara-revolut" })],
        ["Open Zara", () => openExternal("zara")],
      ]} />

      {app.mode === "active" ? (
        <>
          <SectionTitle title="Nearby offer detected" />
          <ReminderCard title="Nike Milano" body={`Use Intesa Visa for 8% cashback. Timing: ${app.timing}.`} actions={[
            ["Show QR", () => app.setModal({ type: "offer", id: "nike-intesa", action: "use" })],
            ["Mark as used", () => app.useOffer("nike-intesa")],
            ["Snooze", () => app.setModal({ type: "snooze", id: "nike-intesa" })],
            ["Open map", () => app.setModal({ type: "message", title: "Demo location", body: "Nike Milano geo-fence opened in simulated map view." })],
          ]} />
        </>
      ) : (
        <>
          <SectionTitle title="In-store reminders" />
          <ReminderCard title="Nearby offers paused" body="Nike Milano and Sephora in-store reminders are available if Francesca opens SAVR. Switch to Active mode for proactive geo-fenced alerts." actions={[
            ["Switch active", () => app.setMode("active")],
            ["Check Nike", () => app.setModal({ type: "offer", id: "nike-intesa", action: "details" })],
          ]} />
        </>
      )}

      <SectionTitle title="Merchant offers" />
      <div className="grid gap-3">{app.offers.filter((offer) => offer.type !== "issuer benefit").map((offer) => <OfferCard key={offer.id} offer={offer} app={app} />)}</div>

      <SectionTitle title="Issuer benefits" />
      <div className="grid gap-3">{app.offers.filter((offer) => offer.type === "issuer benefit").map((offer) => <OfferCard key={offer.id} offer={offer} app={app} />)}</div>

      <SectionTitle title="Expiring soon" />
      <div className="grid gap-3">{app.offers.filter((offer) => offer.status === "expiring soon").map((offer) => <OfferCard key={offer.id} offer={offer} app={app} />)}</div>

      <SectionTitle title="Favorite stores" />
      <div className="flex flex-wrap gap-2">{app.favoriteStores.map((store) => <button key={store} type="button" onClick={() => app.setFavoriteStores(app.favoriteStores.filter((item) => item !== store))} className="rounded-full bg-[#ffd347]/14 px-3 py-2 text-xs text-[#ffd347]">{store}</button>)}</div>

      <SectionTitle title="AR Store Scanner" />
      <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
        <p className="text-sm text-white/64">Simulated camera view detects card-linked benefits on shelves and storefronts.</p>
        <ActionButton className="mt-3 w-full" onClick={() => app.setModal({ type: "ar" })}>Open AR Scanner</ActionButton>
      </div>
    </ScreenPad>
  );
}

function OfferCard({ offer, app }: { offer: ReturnType<typeof useDemoState>["offers"][number]; app: DemoState }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#2d79ff] to-[#ffd347] text-sm font-black text-[#06101e]">{offer.merchant.slice(0, 2).toUpperCase()}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold">{offer.merchant}</p>
              <p className="mt-1 text-xs text-white/54">{offer.title}</p>
            </div>
            <p className="text-sm font-black text-[#7ee5a7]">{eur(offer.estimatedSaving)}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Pill tone="blue">{offer.type}</Pill>
            <Pill>{offer.channel}</Pill>
            <Pill tone={offer.status === "expiring soon" ? "gold" : offer.status === "active" ? "green" : "default"}>{offer.status}</Pill>
            {offer.favorite && <Pill tone="gold">favorite</Pill>}
            {offer.activated && <Pill tone="blue">activated</Pill>}
            {offer.used && <Pill tone="green">used</Pill>}
          </div>
          <p className="mt-3 text-xs text-white/48">Best card: {offer.bestCard} · score {app.scoreOffer(offer.id)} · expires {offer.expiry}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <ActionButton onClick={() => app.setModal({ type: "offer", id: offer.id, action: "use" })}>Use</ActionButton>
        <ActionButton tone="secondary" onClick={() => app.setModal({ type: "offer", id: offer.id, action: "activate" })}>Activate</ActionButton>
        <ActionButton tone="quiet" onClick={() => app.setModal({ type: "snooze", id: offer.id })}>Snooze</ActionButton>
        <ActionButton tone="quiet" onClick={() => app.favoriteOffer(offer.id)}>{offer.favorite ? "Unfavorite" : "Favorite"}</ActionButton>
        <ActionButton className="col-span-2" tone="quiet" onClick={() => app.setModal({ type: "offer", id: offer.id, action: "details" })}>Details</ActionButton>
      </div>
    </div>
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
  const correctedValue = initialSavingsEvents
    .filter((event) => app.eventStatuses[event.id] === "corrected" && event.status === "missed")
    .reduce((sum, event) => sum + event.amount, 0);
  const usedOfferValue = app.offers.filter((offer) => offer.used).reduce((sum, offer) => sum + offer.estimatedSaving, 0);
  const saved = baselineSavedThisMonth + correctedValue + usedOfferValue;
  const missed = Math.max(0, baselineMissedThisMonth - correctedValue);
  const filterOptions: SavingsStatus[] = ["saved", "missed", "corrected", "expiring"];
  const [filter, setFilter] = useState<SavingsStatus | "all">("all");
  const visible = filter === "all" ? app.events : app.events.filter((event) => event.status === filter);

  return (
    <ScreenPad>
      <h1 className="text-2xl font-black tracking-normal">SAVR Difference</h1>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric label="Money saved" value={eur(saved || 318.9)} />
        <Metric label="Missed savings" value={eur(missed || 120)} tone="gold" />
        <Metric label="Offers used" value={String(8 + app.offers.filter((offer) => offer.used).length)} />
        <Metric label="Offers missed" value="5" tone="gold" />
      </div>
      <div className="mt-4 rounded-3xl border border-white/10 bg-white/6 p-4">
        <div className="flex justify-between text-xs text-white/52"><span>Saved</span><span>Missed</span></div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#ffd347]/18"><div className="h-full rounded-full bg-[#2d79ff]" style={{ width: `${Math.min(82, (saved / Math.max(saved + missed, 1)) * 100)}%` }} /></div>
      </div>
      <SectionTitle title="Breakdown by category" />
      <Breakdown labels={["Fashion", "Groceries", "Food delivery", "Transport", "Subscriptions", "Beauty"]} />
      <SectionTitle title="Breakdown by source" />
      <Breakdown labels={["issuer benefits", "merchant offers", "public promo codes", "card recommendations"]} />
      <SectionTitle title="Timeline" />
      <div className="mb-3 flex flex-wrap gap-2">
        {["all", ...filterOptions].map((item) => <button key={item} type="button" onClick={() => setFilter(item as SavingsStatus | "all")} className={`rounded-full px-3 py-1.5 text-xs ${filter === item ? "bg-white text-black" : "bg-white/8 text-white/60"}`}>{item}</button>)}
      </div>
      <div className="grid gap-3">
        {visible.map((event) => (
          <div key={event.id} className="rounded-2xl border border-white/10 bg-white/6 p-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <button type="button" onClick={() => app.setModal({ type: "event", id: event.id })} className="min-w-0 flex-1 text-left">
                <p className="font-semibold">{event.merchant}</p>
                <p className="mt-1 text-xs text-white/46">{event.description}</p>
              </button>
              <Pill tone={event.status === "missed" || event.status === "expiring" ? "gold" : "green"}>{event.status}</Pill>
            </div>
            <div className="mt-3 flex gap-2">
              <ActionButton tone="secondary" onClick={() => app.correctEvent(event.id)}>Mark corrected</ActionButton>
              <ActionButton tone="quiet" onClick={() => app.setModal({ type: "receipt", id: event.id, mode: "upload" })}>Add receipt</ActionButton>
              <ActionButton tone="quiet" onClick={() => app.setModal({ type: "receipt", id: event.id, mode: "manual" })}>Manual</ActionButton>
              <ActionButton tone="quiet" onClick={() => app.setTab("advisor")}>View recommendation</ActionButton>
            </div>
          </div>
        ))}
      </div>
    </ScreenPad>
  );
}

function Metric({ label, value, tone = "blue" }: { label: string; value: string; tone?: "blue" | "gold" }) {
  return <div className="rounded-3xl border border-white/10 bg-white/6 p-4"><p className="text-xs text-white/46">{label}</p><p className={`mt-2 text-xl font-black tracking-normal ${tone === "gold" ? "text-[#ffd347]" : "text-white"}`}>{value}</p></div>;
}

function Breakdown({ labels }: { labels: string[] }) {
  return (
    <div className="grid gap-2">
      {labels.map((label, index) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex justify-between text-xs"><span>{label}</span><span>{Math.max(18, 76 - index * 11)}%</span></div>
          <div className="mt-2 h-2 rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-[#2d79ff] to-[#ffd347]" style={{ width: `${Math.max(18, 76 - index * 11)}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

function AdvisorScreen({ app }: { app: DemoState }) {
  const [messages, setMessages] = useState<Array<{ who: "user" | "savr"; text: string }>>([
    { who: "savr", text: "Ask me which card, benefit, or offer Francesca should use before paying." },
  ]);

  function answer(prompt: string) {
    const zara = bestOfferForMerchant({ merchant: "Zara", mode: app.mode, threshold: app.threshold, favoriteStores: app.favoriteStores, favoriteCategories: app.favoriteCategories, missedMerchants: app.missedMerchants });
    const responses: Record<string, string> = {
      "Best card for Zara": `For Zara, use your Revolut Card and apply code SAVE10. Estimated saving: ${eur(zara?.estimatedSaving || 7.5)}. If the public code fails, HYPE has a fallback cashback offer.`,
      "Best card for groceries": "Use UniCredit Mastercard at Esselunga. It matches your grocery pattern and beats your current threshold when baskets exceed EUR 60.",
      "Where did I miss savings?": "You missed EUR 120 this month, mainly from fashion and delivery. The biggest missed opportunities were SHEIN cashback, Glovo free delivery, and one Sephora expiring offer.",
      "Benefits expiring soon": "Sephora expires tomorrow and UniCredit travel rewards expire soon. Active mode can remind you before checkout.",
      "New card suggestions": "Based on recurring fashion, groceries, and delivery spend, SAVR suggests comparing cards with stronger fashion cashback and delivery benefits. Estimated incremental monthly saving: EUR 14-22.",
      "Ask SAVR through ChatGPT": "@SAVR what card should I use at Zara? Use Revolut + SAVE10 today. Estimated saving: EUR 7.50. I can also remind you before checkout.",
    };
    setMessages((current) => [...current, { who: "user", text: prompt }, { who: "savr", text: responses[prompt] }]);
  }

  return (
    <ScreenPad>
      <h1 className="text-2xl font-black tracking-normal">Personal Advisor</h1>
      <div className="mt-4 grid gap-2">
        {messages.map((message, index) => (
          <div key={`${message.who}-${index}`} className={`max-w-[88%] rounded-3xl p-3 text-sm leading-6 ${message.who === "user" ? "ml-auto bg-[#2d79ff] text-white" : "bg-white/8 text-white/70"}`}>{message.text}</div>
        ))}
      </div>
      <SectionTitle title="Quick actions" />
      <div className="grid gap-2">{advisorPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => answer(prompt)} className="rounded-2xl border border-white/10 bg-white/6 p-3 text-left text-sm">{prompt}</button>)}</div>
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
  const rows = ["Account details", "Connected cards", "Favorite stores", "Favorite categories", "Alert preferences", "Third-party AI plug-in settings", "AR scanner preferences", "Notification settings", "Privacy / data permissions", "Help & support", "Terms and privacy", "Partners & links"];
  return (
    <div className="absolute inset-0 z-40 bg-[#050816]">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-xl font-black">Profile</h2>
        <button type="button" onClick={() => app.setSettingsOpen(false)} className="rounded-full border border-white/10 px-3 py-1.5 text-sm">Close</button>
      </div>
      <div className="h-[calc(100%-72px)] overflow-y-auto px-4 pb-24">
        <div className="rounded-3xl border border-white/10 bg-white/6 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#2d79ff] to-[#ffd347] font-black text-black">FL</div>
            <div><p className="font-bold">{userProfile.name}</p><p className="text-xs text-white/48">{userProfile.location} · {userProfile.profile}</p></div>
          </div>
        </div>
        <SectionTitle title="SAVR mode" />
        <div className="grid grid-cols-2 gap-2">
          <ActionButton onClick={() => app.setMode("active")} tone={app.mode === "active" ? "primary" : "secondary"}>Active</ActionButton>
          <ActionButton onClick={() => app.setMode("passive")} tone={app.mode === "passive" ? "primary" : "secondary"}>Passive</ActionButton>
        </div>
        <p className="mt-3 text-xs leading-5 text-white/48">{app.mode === "active" ? "SAVR proactively surfaces offers at favorite stores, nearby stores, and likely spending moments." : "SAVR only reminds at checkout or when Francesca directly checks SAVR."}</p>
        <SectionTitle title="Threshold" />
        <div className="grid grid-cols-4 gap-2">
          {thresholdOptions.map((value) => <ActionButton key={value} tone={app.threshold === value ? "primary" : "secondary"} onClick={() => app.setThreshold(value)}>EUR {value}</ActionButton>)}
          <ActionButton tone="secondary" onClick={() => app.setThreshold(app.customThreshold)}>Custom</ActionButton>
        </div>
        <input type="range" min={1} max={20} value={app.customThreshold} onChange={(event) => app.setCustomThreshold(Number(event.target.value))} className="mt-3 w-full" />
        <p className="text-xs text-white/46">Custom threshold: EUR {app.customThreshold}</p>
        <SectionTitle title="Timing" />
        <div className="grid gap-2">{timingOptions.map((item) => <button key={item} type="button" onClick={() => app.setTiming(item)} className={`rounded-2xl border p-3 text-left text-sm ${app.timing === item ? "border-[#ffd347] bg-[#ffd347]/12" : "border-white/10 bg-white/6"}`}>{item}</button>)}</div>
        <SectionTitle title="Notification types" />
        <div className="grid gap-2">{notificationTypes.map((item) => <ToggleRow key={item} label={item} active={app.notifications[item]} onClick={() => app.setNotifications({ ...app.notifications, [item]: !app.notifications[item] })} />)}</div>
        <SectionTitle title="Settings" />
        <div className="grid gap-2">{rows.map((row) => <button key={row} type="button" onClick={() => app.setModal({ type: "settings", section: row })} className="rounded-2xl border border-white/10 bg-white/6 p-3 text-left text-sm">{row}</button>)}</div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <ActionButton tone="secondary" onClick={app.resetDemo}>Reset demo</ActionButton>
          <ActionButton tone="danger" onClick={() => app.setModal({ type: "logout" })}>Log out</ActionButton>
        </div>
      </div>
    </div>
  );
}

function SettingsSubScreen({ section, app, close }: { section: string; app: DemoState; close: () => void }) {
  if (section === "Favorite stores") {
    const all = ["Zara", "Nike", "Esselunga", "Glovo", "SHEIN", "Sephora", "Trenitalia"];
    return <SheetSection title={section}><EditablePills values={all} selected={app.favoriteStores} setSelected={app.setFavoriteStores} /></SheetSection>;
  }
  if (section === "Favorite categories") {
    const all = ["Fashion", "Groceries", "Food delivery", "Transport", "Beauty", "Travel", "Subscriptions"];
    return <SheetSection title={section}><EditablePills values={all} selected={app.favoriteCategories} setSelected={app.setFavoriteCategories} /></SheetSection>;
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
      <p className="text-sm leading-6 text-white/66">{section} updated in the demo. This screen simulates the production settings flow inside the phone.</p>
      <ActionButton className="mt-4 w-full" onClick={() => { app.setToast(`${section} saved`); close(); }}>Save demo preference</ActionButton>
    </SheetSection>
  );
}

function EditablePills({ values, selected, setSelected }: { values: string[]; selected: string[]; setSelected: (values: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => {
        const active = selected.includes(value);
        return <button key={value} type="button" onClick={() => setSelected(active ? selected.filter((item) => item !== value) : [...selected, value])} className={`rounded-full px-3 py-2 text-xs ${active ? "bg-[#ffd347] text-black" : "bg-white/8 text-white/60"}`}>{value}</button>;
      })}
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

function ModeNotice({ app }: { app: DemoState }) {
  return <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-3 text-xs leading-5 text-white/60">{app.mode === "active" ? "Active mode: proactive reminders at favorite stores, nearby stores, and likely spending moments." : "Passive mode: only checkout and direct SAVR checks are shown."}</div>;
}

function ScreenPad({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pb-44 pt-1">{children}</div>;
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
    <div className="absolute inset-0 z-50 grid place-items-center bg-[#050816] px-6 text-center">
      <div>
        <SavrLogo />
        <h1 className="mt-8 text-2xl font-black">Signed out</h1>
        <p className="mt-3 text-sm leading-6 text-white/58">Francesca is logged out of the demo phone.</p>
        <ActionButton className="mt-6 w-full" onClick={() => { app.setSignedOut(false); app.setToast("Returned to demo"); }}>Return to demo</ActionButton>
      </div>
    </div>
  );
}

export function SavrDemo() {
  const app = useDemoState();
  const screen =
    app.tab === "account" ? <AccountScreen app={app} /> :
    app.tab === "benefits" ? <BenefitsScreen app={app} /> :
    app.tab === "difference" ? <DifferenceScreen app={app} /> :
    <AdvisorScreen app={app} />;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <PhoneFrame>
        <MobileScreen>
          <div className="relative flex-1 overflow-hidden text-white">
            <AppHeader onProfile={() => app.setSettingsOpen(true)} />
            <div className="h-full overflow-y-auto">{screen}</div>
            <BottomTabs tab={app.tab} setTab={app.setTab} />
            {app.settingsOpen && <SettingsScreen app={app} />}
            {app.cardManagerOpen && <CardManagerScreen app={app} />}
            {app.signedOut && <LockedState app={app} />}
            <ModalSheet modal={app.modal} close={() => app.setModal(null)} app={app} />
            {app.toast && (
              <button type="button" onClick={() => app.setToast("")} className="absolute inset-x-5 top-20 z-[60] rounded-2xl border border-white/10 bg-[#0b1425] p-3 text-left text-xs shadow-2xl">
                {app.toast}
              </button>
            )}
          </div>
        </MobileScreen>
      </PhoneFrame>
    </div>
  );
}
