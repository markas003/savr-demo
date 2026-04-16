"use client";

import { Offer } from "@/types";
import { MerchantBadge, cx } from "@/components/ui";

export function OfferDetailModal({
  offer,
  copied,
  onClose,
  onCopyCode,
}: {
  offer: Offer | null;
  copied: boolean;
  onClose: () => void;
  onCopyCode: (code: string) => void;
}) {
  if (!offer) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/55 backdrop-blur-sm">
      <div className="w-full animate-rise rounded-t-[32px] border border-white/10 bg-[#0b1220] px-4 pb-8 pt-3 shadow-phone">
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-white/15" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <MerchantBadge label={offer.merchant} accent={offer.accent} />
            <div>
              <div className="text-lg font-semibold text-white">{offer.merchant}</div>
              <div className="text-sm text-white/50">{offer.title}</div>
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
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            {offer.channel === "instore" ? "In-store offer" : offer.channel === "inapp" ? "In-app offer" : "Online offer"}
          </div>
          <p className="mt-3 text-sm leading-6 text-white/70">{offer.description}</p>
          <div className="mt-4 flex items-center justify-between text-[12px] text-white/45">
            <span>{offer.expiry}</span>
            <span className="font-medium text-emerald-300">{offer.savingsHint}</span>
          </div>
        </div>

        {offer.channel !== "instore" && offer.code ? (
          <div className="mt-4 rounded-[26px] border border-visaBlue/20 bg-visaBlue/8 p-4">
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Discount code</div>
            <div className="mt-3 rounded-2xl border border-white/10 bg-[#07101f] px-4 py-3 text-center text-xl font-semibold tracking-[0.18em] text-white">
              {offer.code}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onCopyCode(offer.code!)}
                className={cx(
                  "rounded-2xl px-3 py-3 text-sm font-semibold transition",
                  copied ? "bg-emerald-400 text-slate-950" : "bg-white text-slate-950",
                )}
              >
                {copied ? "Code copied" : "Copy code"}
              </button>
              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white"
              >
                Visit store
              </button>
            </div>
            {offer.applyNote ? <p className="mt-3 text-[12px] leading-5 text-white/50">{offer.applyNote}</p> : null}
          </div>
        ) : null}

        {offer.channel === "instore" ? (
          <div className="mt-4 rounded-[26px] border border-visaGold/20 bg-visaGold/8 p-4">
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/45">Checkout QR</div>
            <div className="mt-3 flex items-center gap-4">
              <div className="grid h-28 w-28 grid-cols-6 gap-1 rounded-2xl bg-white p-3">
                {Array.from({ length: 36 }).map((_, index) => (
                  <span
                    key={index}
                    className={index % 3 === 0 || index % 5 === 0 ? "rounded-[2px] bg-slate-950" : "rounded-[2px] bg-white"}
                  />
                ))}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{offer.qrLabel}</div>
                <div className="mt-1 text-[12px] leading-5 text-white/55">
                  Show this at checkout. SAVR tags the session to your linked student wallet.
                </div>
                {offer.location ? <div className="mt-2 text-[12px] text-visaGold">{offer.location}</div> : null}
              </div>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-2xl bg-white px-3 py-3 text-sm font-semibold text-slate-950"
            >
              Show at checkout
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
