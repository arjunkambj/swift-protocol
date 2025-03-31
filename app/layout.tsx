import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swift Protocol | Fast & Efficient Decentralized Exchange on Solana",
  description:
    "Swift Protocol offers lightning-fast token swaps with optimal routing and minimal fees on the Solana blockchain.",
  keywords: [
    "Solana",
    "DEX",
    "Decentralized Exchange",
    "Crypto",
    "DeFi",
    "Swap",
    "Token",
    "Blockchain",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  authors: [
    {
      name: "Swift Protocol Team",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Script src="/hero-bg.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
