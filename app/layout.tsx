import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SAVR Demo",
  description: "Presentation-ready SAVR fintech prototype for Visa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-ink text-white antialiased">{children}</body>
    </html>
  );
}
