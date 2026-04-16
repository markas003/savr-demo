"use client";

import { Offer } from "@/types";
import { MerchantBadge, cx } from "@/components/ui";

export function OfferCard({
  offer,
  onSelect,
}: {
  offer: Offer;
  onSelect: (offer: Offer) => void;
}) {
  const channelLabel =
    offer.channel === "online" ? "Online" : offer.channel === "instore" ? "In-store" : "In-app";

  return (
    <button
      type="button"
      onClick={() => onSelect(offer)}
      className="w-full rounded-[26px] border border-white/10 bg-white/6 p-4 text-left shadow-panel transition duration-200 hover:-translate-y-0.5 hover:bg-white/8"
    >
      <div className="flex items-start gap-3">
        <MerchantBadge label={offer.merchant} accent={offer.accent} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-[15px] font-semibold text-white">{offer.merchant}</div>
            <span
              className={cx(
                "rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.22em]",
                offer.channel === "instore"
                  ? "bg-visaGold/16 text-visaGold"
                  : "bg-visaBlue/16 text-visaBlueSoft",
              )}
            >
              {channelLabel}
            </span>
          </div>
          <div className="mt-1 text-[13px] font-medium text-white/90">{offer.title}</div>
          <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-white/55">{offer.description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-white/50">
        <span>{offer.expiry}</span>
        <span className="font-medium text-emerald-300">{offer.savingsHint}</span>
      </div>
    </button>
  );
}
