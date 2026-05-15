import { ExternalLinkKey } from "@/data/links";

export type AppTab = "account" | "benefits" | "difference" | "advisor";
export type SavrMode = "active" | "passive";
export type OfferType = "issuer benefit" | "card-linked offer" | "public promo code" | "partner offer";
export type OfferStatus = "active" | "activation required" | "expiring soon" | "snoozed" | "favorite";
export type OfferChannel = "website" | "in-store" | "app";
export type SavingsStatus = "saved" | "missed" | "corrected" | "expiring";

export const userProfile = {
  name: "Francesca Liberatore",
  shortName: "Francesca",
  location: "Milan, Italy",
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
    activeBenefits: ["8% cashback at Nike", "Local merchant cashback", "Visa purchase protection"],
    recommendedUse: ["Nike", "Physical retail", "Italian merchant offers"],
  },
  {
    id: "unicredit",
    activeBenefits: ["Esselunga grocery boost", "Trenitalia travel rewards", "Travel insurance"],
    recommendedUse: ["Groceries", "Transport", "Travel bookings"],
  },
  {
    id: "hype",
    activeBenefits: ["10% SHEIN cashback", "Youth merchant offers", "Instant card alerts"],
    recommendedUse: ["SHEIN", "Fashion", "Beauty"],
  },
  {
    id: "revolut",
    activeBenefits: ["3 free Glovo deliveries", "FX-friendly checkout", "Public code fallback"],
    recommendedUse: ["Zara online", "Glovo", "Travel websites"],
  },
  {
    id: "paypal",
    activeBenefits: ["Buyer protection", "Fast wallet checkout"],
    recommendedUse: ["Marketplaces", "Online checkout"],
  },
];

export const recentTransactions = [
  { id: "r1", merchant: "Zara", category: "Fashion", amount: 75, card: "Revolut Card" },
  { id: "r2", merchant: "Esselunga", category: "Groceries", amount: 52.4, card: "UniCredit Mastercard" },
  { id: "r3", merchant: "Glovo", category: "Food delivery", amount: 24.4, card: "Revolut Card" },
  { id: "r4", merchant: "Nike", category: "Fashion", amount: 150, card: "Intesa Sanpaolo Visa Debit" },
  { id: "r5", merchant: "Trenitalia", category: "Transport", amount: 46.9, card: "UniCredit Mastercard" },
  { id: "r6", merchant: "Spotify", category: "Subscriptions", amount: 5.99, card: "HYPE Card" },
  { id: "r7", merchant: "SHEIN", category: "Fashion", amount: 50, card: "HYPE Card" },
  { id: "r8", merchant: "Sephora", category: "Beauty", amount: 84, card: "HYPE Card" },
];

export const initialOffers = [
  {
    id: "nike-intesa",
    merchant: "Nike",
    title: "8% cashback with Intesa Visa",
    type: "issuer benefit" as OfferType,
    estimatedSaving: 12,
    bestCard: "Intesa Sanpaolo Visa Debit",
    channel: "in-store" as OfferChannel,
    expiry: "May 28",
    status: "active" as OfferStatus,
    category: "Fashion",
    linkKey: "nike" as ExternalLinkKey,
    code: "",
    why: "Francesca is near Nike Milano and this is her highest value in-store fashion benefit.",
    restrictions: "Use Intesa Visa at checkout. Cashback posts within 5 business days.",
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
    why: "A public code beats card cashback on this basket; Revolut is still recommended for checkout reliability.",
    restrictions: "Code applies above EUR 60 and may not stack with sale items.",
  },
  {
    id: "shein-hype",
    merchant: "SHEIN",
    title: "10% cashback with HYPE",
    type: "card-linked offer" as OfferType,
    estimatedSaving: 5,
    bestCard: "HYPE Card",
    channel: "website" as OfferChannel,
    expiry: "Jun 02",
    status: "activation required" as OfferStatus,
    category: "Fashion",
    linkKey: "shein" as ExternalLinkKey,
    code: "",
    why: "HYPE cashback matches Francesca's recurring fashion spend and previous missed SHEIN saving.",
    restrictions: "Activate before checkout. Cashback is capped at EUR 10.",
  },
  {
    id: "glovo-revolut",
    merchant: "Glovo",
    title: "3 free deliveries with Revolut Premium",
    type: "issuer benefit" as OfferType,
    estimatedSaving: 2.99,
    bestCard: "Revolut Card",
    channel: "app" as OfferChannel,
    expiry: "This month",
    status: "activation required" as OfferStatus,
    category: "Food delivery",
    linkKey: "glovo" as ExternalLinkKey,
    code: "REVDELIVERY",
    why: "Francesca orders delivery twice a week and missed this benefit last month.",
    restrictions: "Requires Revolut Premium benefit activation before payment.",
  },
  {
    id: "esselunga-unicredit",
    merchant: "Esselunga",
    title: "Groceries boost with UniCredit",
    type: "card-linked offer" as OfferType,
    estimatedSaving: 4,
    bestCard: "UniCredit Mastercard",
    channel: "in-store" as OfferChannel,
    expiry: "Jun 10",
    status: "active" as OfferStatus,
    category: "Groceries",
    linkKey: "esselunga" as ExternalLinkKey,
    code: "",
    why: "Groceries are a top category and this clears Francesca's EUR 5 threshold when basket is above EUR 60.",
    restrictions: "Use UniCredit Mastercard in participating stores.",
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
    status: "expiring soon" as OfferStatus,
    category: "Beauty",
    linkKey: "sephora" as ExternalLinkKey,
    code: "BEAUTY8",
    why: "Beauty is a favorite category and this partner code expires tomorrow.",
    restrictions: "Code works online and in-store QR redemptions.",
  },
  {
    id: "trenitalia-unicredit",
    merchant: "Trenitalia",
    title: "Travel reward with UniCredit",
    type: "issuer benefit" as OfferType,
    estimatedSaving: 6,
    bestCard: "UniCredit Mastercard",
    channel: "app" as OfferChannel,
    expiry: "Jun 15",
    status: "active" as OfferStatus,
    category: "Transport",
    linkKey: "trenitalia" as ExternalLinkKey,
    code: "",
    why: "UniCredit travel rewards match Francesca's Milan to Rome train pattern.",
    restrictions: "Use UniCredit Mastercard in Trenitalia app or website.",
  },
];

export const initialSavingsEvents = [
  { id: "e1", merchant: "Nike", category: "Fashion", source: "issuer benefits", description: "Saved EUR 12 using Intesa Visa", amount: 12, status: "saved" as SavingsStatus },
  { id: "e2", merchant: "Zara", category: "Fashion", source: "public promo codes", description: "Saved EUR 7.50 using SAVE10", amount: 7.5, status: "saved" as SavingsStatus },
  { id: "e3", merchant: "Glovo", category: "Food delivery", source: "issuer benefits", description: "Missed EUR 2.99 free delivery", amount: 2.99, status: "missed" as SavingsStatus },
  { id: "e4", merchant: "SHEIN", category: "Fashion", source: "card recommendations", description: "Missed EUR 5 HYPE cashback", amount: 5, status: "missed" as SavingsStatus },
  { id: "e5", merchant: "Esselunga", category: "Groceries", source: "merchant offers", description: "Saved EUR 4 with UniCredit groceries offer", amount: 4, status: "saved" as SavingsStatus },
  { id: "e6", merchant: "Sephora", category: "Beauty", source: "merchant offers", description: "Expiring offer not used yet", amount: 8, status: "expiring" as SavingsStatus },
  { id: "e7", merchant: "Spotify", category: "Subscriptions", source: "card recommendations", description: "No better benefit found", amount: 0, status: "saved" as SavingsStatus },
];

export const defaultFavorites = {
  stores: ["Zara", "Nike", "Esselunga", "Glovo", "SHEIN", "Sephora"],
  categories: ["Fashion", "Groceries", "Food delivery", "Transport", "Beauty", "Travel"],
};

export const partnerLinks = [
  ["Visa", "visa"],
  ["Tink", "tink"],
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
  "Benefits expiring soon",
  "New card suggestions",
  "Ask SAVR through ChatGPT",
];
