import { initialOffers, OfferChannel, SavrMode } from "@/data/mock-data";

export function recommendationScore({
  merchant,
  category,
  channel,
  connectedCards,
  activeBenefits,
  expiry,
  mode,
  threshold,
  favoriteStores,
  favoriteCategories,
  missedMerchants,
}: {
  merchant: string;
  category: string;
  channel: OfferChannel;
  connectedCards?: string[];
  activeBenefits?: string[];
  expiry?: string;
  mode: SavrMode;
  threshold: number;
  favoriteStores: string[];
  favoriteCategories: string[];
  missedMerchants: string[];
}) {
  const offer = initialOffers.find((item) => item.merchant.toLowerCase() === merchant.toLowerCase());
  if (!offer) return 0;

  let score = offer.estimatedSaving >= threshold ? 40 : 10;
  if (offer.channel === channel) score += 20;
  if (connectedCards?.includes(offer.bestCard)) score += 12;
  if (activeBenefits?.some((benefit) => benefit.toLowerCase().includes(merchant.toLowerCase()) || benefit.toLowerCase().includes(category.toLowerCase()))) score += 12;
  if ((expiry || offer.expiry).toLowerCase().includes("tomorrow") || (expiry || offer.expiry).toLowerCase().includes("tonight")) score += mode === "active" ? 18 : 6;
  if (favoriteStores.includes(merchant)) score += 15;
  if (favoriteCategories.includes(category)) score += 15;
  if (missedMerchants.includes(merchant)) score += 20;
  if (offer.status === "expiring soon") score += mode === "active" ? 15 : 5;
  if (mode === "active") score += 10;
  return score;
}

export function bestOfferForMerchant({
  merchant,
  mode,
  threshold,
  favoriteStores,
  favoriteCategories,
  missedMerchants,
}: {
  merchant: string;
  mode: SavrMode;
  threshold: number;
  favoriteStores: string[];
  favoriteCategories: string[];
  missedMerchants: string[];
}) {
  const offer = initialOffers.find((item) => item.merchant.toLowerCase() === merchant.toLowerCase());
  if (!offer) return null;

  return {
    ...offer,
    score: recommendationScore({
      merchant: offer.merchant,
      category: offer.category,
      channel: offer.channel,
      mode,
      threshold,
      favoriteStores,
      favoriteCategories,
      missedMerchants,
    }),
  };
}

export function visibleReminderCount(mode: SavrMode) {
  return mode === "active" ? 3 : 1;
}
