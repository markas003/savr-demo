export const externalLinks = {
  visa: "https://www.visa.com",
  intesa: "https://www.intesasanpaolo.com",
  unicredit: "https://www.unicredit.it",
  hype: "https://www.hype.it",
  revolut: "https://www.revolut.com",
  paypal: "https://www.paypal.com",
  zara: "https://www.zara.com",
  shein: "https://www.shein.com",
  glovo: "https://glovoapp.com",
  nike: "https://www.nike.com",
  esselunga: "https://www.esselunga.it",
  sephora: "https://www.sephora.it",
  trenitalia: "https://www.trenitalia.com",
  chatgpt: "https://chatgpt.com",
  gemini: "https://gemini.google.com",
  claude: "https://claude.ai",
  grok: "https://x.ai/grok",
} as const;

export type ExternalLinkKey = keyof typeof externalLinks;
