import { ExternalLinkKey } from "@/data/links";

export type AppTab = "account" | "benefits" | "difference" | "advisor";
export type SavrMode = "active" | "passive";
export type OfferType = "issuer reward" | "card-linked offer" | "public promo code" | "partner offer";
export type OfferStatus = "active" | "activation required" | "expiring soon" | "snoozed" | "favorite";
export type OfferChannel = "website" | "in-store" | "app";
export type SavingsStatus = "saved" | "missed" | "corrected" | "expiring";

export const userProfile = {
  name: "Francesca Liberatore",
  shortName: "Francesca",
  location: "Italy",
  profile: "Gen Z young professional",
  totalBalance: 11318.9,
  topCategories: ["Fashion", "Groceries", "Food delivery", "Transport"],
};

export const connectedAccounts = [
  { id: "intesa", name: "Intesa Sanpaolo Visa Debit", issuer: "Intesa Sanpaolo", type: "Visa debit", balance: 6840.2, linkKey: "intesa" as ExternalLinkKey },
  { id: "unicredit", name: "UniCredit Mastercard", issuer: "UniCredit", type: "Mastercard credit", balance: 1984.4, linkKey: "unicredit" as ExternalLinkKey },
  { id: "hype", name: "HYPE Card", issuer: "HYPE", type: "Prepaid card", balance: 981.5, linkKey: "hype" as ExternalLinkKey },
  { id: "revolut", name: "Revolut Card", issuer: "Revolut", type: "Multi-currency card", balance: 1512.8, linkKey: "revolut" as ExternalLinkKey },
  { id: "paypal", name: "PayPal", issuer: "PayPal", type: "Wallet", balance: 0, linkKey: "paypal" as ExternalLinkKey },
];

export const cardDetails = [
  {
    id: "intesa",
    activeBenefits: ["Nike: 8% issuer cashback", "Best current in-store fashion offer", "Counts toward SAVR saved-vs-missed tracking"],
    recommendedUse: ["Use at Nike stores", "Use for in-store fashion", "Use when SAVR shows an issuer cashback alert"],
  },
  {
    id: "unicredit",
    activeBenefits: ["Esselunga: grocery boost", "Trenitalia: travel reward", "Strong match for weekly essentials"],
    recommendedUse: ["Use at Esselunga", "Use for Trenitalia bookings", "Use when groceries exceed SAVR threshold"],
  },
  {
    id: "hype",
    activeBenefits: ["SHEIN: 10% cashback after activation", "Sephora: beauty offer fallback", "Good match for your fashion spend"],
    recommendedUse: ["Use for SHEIN after activation", "Use for beauty offers", "Use when SAVR flags missed fashion cashback"],
  },
  {
    id: "revolut",
    activeBenefits: ["Zara: best with public code SAVE10", "Glovo: free-delivery reward", "Reliable online checkout fallback"],
    recommendedUse: ["Use for Zara online", "Use in Glovo app", "Use when SAVR combines card + promo code"],
  },
  {
    id: "paypal",
    activeBenefits: ["Buyer protection on online checkout", "Wallet option when no card-linked offer wins", "Useful fallback for marketplaces"],
    recommendedUse: ["Use for marketplace purchases", "Use when SAVR finds no better card offer", "Use when buyer protection matters"],
  },
];

export const recentTransactions = [
  { id: "r1", merchant: "Zara", category: "Fashion", originalAmount: 75, amount: 67.5, card: "Revolut Card", savrStatus: "saved", savrAmount: 7.5, redemption: "Applied code SAVE10 at checkout." },
  { id: "r2", merchant: "Esselunga", category: "Groceries", originalAmount: 52.4, amount: 48.4, card: "UniCredit Mastercard", savrStatus: "saved", savrAmount: 4, redemption: "Paid with UniCredit Mastercard to capture the grocery boost." },
  { id: "r3", merchant: "Glovo", category: "Food delivery", originalAmount: 24.4, amount: 24.4, card: "Revolut Card", savrStatus: "missed", savrAmount: 2.99, redemption: "Activate the Revolut delivery reward before checkout." },
  { id: "r4", merchant: "Nike", category: "Fashion", originalAmount: 150, amount: 138, card: "Intesa Sanpaolo Visa Debit", savrStatus: "saved", savrAmount: 12, redemption: "Paid with Intesa Visa for 8% cashback." },
  { id: "r5", merchant: "Trenitalia", category: "Transport", originalAmount: 46.9, amount: 40.9, card: "UniCredit Mastercard", savrStatus: "saved", savrAmount: 6, redemption: "Paid with UniCredit Mastercard in the booking flow." },
  { id: "r6", merchant: "Spotify", category: "Subscriptions", originalAmount: 5.99, amount: 5.99, card: "HYPE Card", savrStatus: "saved", savrAmount: 0, redemption: "No stronger active reward was available for this payment." },
  { id: "r7", merchant: "SHEIN", category: "Fashion", originalAmount: 50, amount: 50, card: "HYPE Card", savrStatus: "missed", savrAmount: 5, redemption: "Activate HYPE cashback before paying." },
  { id: "r8", merchant: "Sephora", category: "Beauty", originalAmount: 84, amount: 84, card: "HYPE Card", savrStatus: "missed", savrAmount: 8, redemption: "Use code BEAUTY8 or show the in-store QR before the offer expires." },
];

export const initialOffers = [
  {
    id: "nike-intesa",
    merchant: "Nike",
    title: "8% cashback with Intesa Visa",
    type: "issuer reward" as OfferType,
    estimatedSaving: 12,
    bestCard: "Intesa Sanpaolo Visa Debit",
    channel: "in-store" as OfferChannel,
    expiry: "May 28",
    status: "active" as OfferStatus,
    category: "Fashion",
    linkKey: "nike" as ExternalLinkKey,
    code: "",
    why: "Use Intesa Visa in store to earn the strongest active fashion cashback available on this purchase.",
    restrictions: "Pay with Intesa Visa at checkout. Cashback is calculated on the final paid amount and posts after the transaction settles.",
  },
  {
    id: "zara-revolut",
    merchant: "Zara",
    title: "Best card: Revolut + public code SAVE10",
    type: "public promo code" as OfferType,
    estimatedSaving: 7.5,
    bestCard: "Revolut Card",
    channel: "website" as OfferChannel,
    expiry: "Tonight",
    status: "favorite" as OfferStatus,
    category: "Fashion",
    linkKey: "zara" as ExternalLinkKey,
    code: "SAVE10",
    why: "Use Revolut Card and apply SAVE10 because the public code beats the available card cashback on this basket.",
    restrictions: "Enter SAVE10 at website checkout. The code applies to eligible baskets above EUR 60 and may not combine with sale pricing.",
  },
  {
    id: "shein-hype",
    merchant: "SHEIN",
    title: "10% cashback with HYPE",
    type: "card-linked offer" as OfferType,
    estimatedSaving: 5,
    bestCard: "HYPE Card",
    channel: "website" as OfferChannel,
    expiry: "June 2",
    status: "activation required" as OfferStatus,
    category: "Fashion",
    linkKey: "shein" as ExternalLinkKey,
    code: "",
    why: "Activate HYPE before checkout to capture cashback on a fashion purchase that would otherwise be easy to miss.",
    restrictions: "Activate the offer first, then pay with HYPE. Cashback is capped at EUR 10 and is based on the final paid amount.",
  },
  {
    id: "glovo-revolut",
    merchant: "Glovo",
    title: "3 free deliveries with Revolut Premium",
    type: "issuer reward" as OfferType,
    estimatedSaving: 2.99,
    bestCard: "Revolut Card",
    channel: "app" as OfferChannel,
    expiry: "This month",
    status: "activation required" as OfferStatus,
    category: "Food delivery",
    linkKey: "glovo" as ExternalLinkKey,
    code: "REVDELIVERY",
    why: "Activate the Revolut delivery reward before ordering so the free delivery saving is applied in the app.",
    restrictions: "Use the Glovo app after activation and pay with Revolut. The reward must be active before checkout.",
  },
  {
    id: "esselunga-unicredit",
    merchant: "Esselunga",
    title: "Groceries boost with UniCredit",
    type: "card-linked offer" as OfferType,
    estimatedSaving: 4,
    bestCard: "UniCredit Mastercard",
    channel: "in-store" as OfferChannel,
    expiry: "June 10",
    status: "active" as OfferStatus,
    category: "Groceries",
    linkKey: "esselunga" as ExternalLinkKey,
    code: "",
    why: "Use UniCredit for larger grocery shops because this card-linked offer is the best active match for Esselunga.",
    restrictions: "Pay with UniCredit Mastercard in participating stores. The saving depends on the final basket total.",
  },
  {
    id: "sephora-hype",
    merchant: "Sephora",
    title: "Beauty offer expiring soon",
    type: "partner offer" as OfferType,
    estimatedSaving: 8,
    bestCard: "HYPE Card",
    channel: "website" as OfferChannel,
    expiry: "Tomorrow",
    status: "activation required" as OfferStatus,
    category: "Beauty",
    linkKey: "sephora" as ExternalLinkKey,
    code: "BEAUTY8",
    why: "Use this beauty offer before it expires; it is the strongest available Sephora saving in your current rewards.",
    restrictions: "Use BEAUTY8 online or show the in-store QR where accepted before paying.",
  },
  {
    id: "trenitalia-unicredit",
    merchant: "Trenitalia",
    title: "Travel reward with UniCredit",
    type: "issuer reward" as OfferType,
    estimatedSaving: 6,
    bestCard: "UniCredit Mastercard",
    channel: "app" as OfferChannel,
    expiry: "June 15",
    status: "active" as OfferStatus,
    category: "Transport",
    linkKey: "trenitalia" as ExternalLinkKey,
    code: "",
    why: "Use UniCredit for train bookings because it is the best active travel reward on your connected cards.",
    restrictions: "Pay with UniCredit Mastercard in the Trenitalia app or on the website before the offer expires.",
  },
];

export const initialSavingsEvents = [
  { id: "e1", merchant: "Nike", category: "Fashion", source: "issuer rewards", description: "Saved EUR 12 using Intesa Visa", amount: 12, status: "saved" as SavingsStatus },
  { id: "e2", merchant: "Zara", category: "Fashion", source: "public promo codes", description: "Saved EUR 7.50 using SAVE10", amount: 7.5, status: "saved" as SavingsStatus },
  { id: "e3", merchant: "Glovo", category: "Food delivery", source: "issuer rewards", description: "Missed EUR 2.99 free delivery", amount: 2.99, status: "missed" as SavingsStatus },
  { id: "e4", merchant: "SHEIN", category: "Fashion", source: "card recommendations", description: "Missed EUR 5 HYPE cashback", amount: 5, status: "missed" as SavingsStatus },
  { id: "e5", merchant: "Esselunga", category: "Groceries", source: "merchant offers", description: "Saved EUR 4 with UniCredit groceries offer", amount: 4, status: "saved" as SavingsStatus },
  { id: "e6", merchant: "Sephora", category: "Beauty", source: "merchant offers", description: "Expiring offer not used yet", amount: 8, status: "expiring" as SavingsStatus },
  { id: "e7", merchant: "Spotify", category: "Subscriptions", source: "card recommendations", description: "No better reward found", amount: 0, status: "saved" as SavingsStatus },
];

export const defaultFavorites = {
  stores: ["Zara", "Esselunga", "Glovo", "SHEIN", "Sephora"],
  categories: ["Fashion", "Groceries", "Food delivery", "Transport", "Beauty", "Travel"],
};

export const partnerLinks = [
  ["Visa", "visa"],
  ["Intesa Sanpaolo", "intesa"],
  ["UniCredit", "unicredit"],
  ["HYPE", "hype"],
  ["Revolut", "revolut"],
  ["PayPal", "paypal"],
  ["Zara", "zara"],
  ["SHEIN", "shein"],
  ["Glovo", "glovo"],
  ["Nike", "nike"],
  ["Esselunga", "esselunga"],
  ["Sephora", "sephora"],
  ["Trenitalia", "trenitalia"],
  ["ChatGPT", "chatgpt"],
  ["Gemini", "gemini"],
  ["Claude", "claude"],
  ["Grok", "grok"],
] as const;

export const advisorPrompts = [
  "Best card for Zara",
  "Best card for groceries",
  "Where did I miss savings?",
  "Rewards expiring soon",
  "New card suggestions",
  "Ask SAVR through ChatGPT",
];
