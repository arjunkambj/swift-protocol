import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";
import WalletContextProvider from "./context/WalletContext";
import { SOLANA_NETWORK } from "@/lib/jupiter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Add a conditional environment indicator for development mode
const isDevEnvironment = SOLANA_NETWORK === "devnet";

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
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased dark:bg-neutral-950`}
      >
        <WalletContextProvider>
          {/* Environment indicator for devnet */}
          {isDevEnvironment && (
            <div className="fixed top-0 left-0 right-0  dark:bg-neutral-950 text-black text-center text-sm py-1 z-50">
              Development Mode - Using Solana {SOLANA_NETWORK.toUpperCase()}
            </div>
          )}
          <Providers>{children}</Providers>
        </WalletContextProvider>
        <Script src="/hero-bg.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
