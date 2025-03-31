"use client";
import Navbar from "@/app/components/home/Navbar";
import Footer from "@/app/components/home/Footer";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-3">
            <div className="sticky top-24 bg-neutral-900 p-6 rounded-xl shadow-md border border-neutral-800">
              <h2 className="text-xl font-bold text-white mb-4">Contents</h2>
              <nav className="space-y-2">
                <a
                  href="#introduction"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  Introduction
                </a>
                <a
                  href="#getting-started"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  Getting Started
                </a>
                <a
                  href="#trading"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  Trading on Swift
                </a>
                <a
                  href="#task-manager"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  Task Manager
                </a>
                <a
                  href="#supported-tokens"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  Supported Tokens
                </a>
                <a
                  href="#architecture"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  Architecture
                </a>
                <a
                  href="#security"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  Security
                </a>
                <a
                  href="#roadmap"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  Roadmap
                </a>
                <a
                  href="#faq"
                  className="block py-1 text-neutral-300 hover:text-indigo-400 transition"
                >
                  FAQ
                </a>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-9">
            <div className="bg-neutral-900 rounded-xl shadow-lg p-8 border border-neutral-800">
              <section id="introduction" className="mb-12">
                <h1 className="text-3xl font-bold text-white mb-6">
                  Swift Protocol Documentation
                </h1>
                <p className="text-neutral-300 mb-4">
                  Welcome to the Swift Protocol documentation. This guide
                  provides comprehensive information on how to use the Swift
                  Protocol platform for trading on the Solana blockchain.
                </p>
                <p className="text-neutral-300 mb-4">
                  Swift Protocol is a decentralized exchange (DEX) built on
                  Solana, offering lightning-fast trades with minimal fees. Our
                  platform is designed to be intuitive for beginners while
                  offering advanced features for experienced traders.
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-4 my-6">
                  <p className="text-emerald-700 dark:text-emerald-400">
                    Swift Protocol is currently in beta. While the platform is
                    fully functional, we&apos;re continuously working to improve
                    the user experience and add new features.
                  </p>
                </div>
              </section>

              <section id="getting-started" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Getting Started
                </h2>
                <p className="text-neutral-300 mb-4">
                  To start using Swift Protocol, you&apos;ll need:
                </p>
                <ol className="list-decimal pl-6 space-y-3 text-neutral-300 mb-6">
                  <li>
                    A Solana-compatible wallet (Phantom, Solflare, or similar)
                  </li>
                  <li>SOL tokens for transaction fees</li>
                  <li>Tokens you wish to trade on the platform</li>
                </ol>
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Connecting Your Wallet
                </h3>
                <p className="text-neutral-300 mb-4">
                  To connect your wallet to Swift Protocol:
                </p>
                <ol className="list-decimal pl-6 space-y-3 text-neutral-300">
                  <li>
                    Navigate to the{" "}
                    <Link
                      href="/swap"
                      className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Swap page
                    </Link>
                  </li>
                  <li>
                    Click on the &quot;Connect Wallet&quot; button in the top
                    right
                  </li>
                  <li>Select your wallet provider from the list</li>
                  <li>Approve the connection request in your wallet</li>
                </ol>
              </section>

              <section id="trading" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Trading on Swift
                </h2>
                <p className="text-neutral-300 mb-4">
                  Swift Protocol offers an intuitive interface for trading
                  tokens on the Solana blockchain:
                </p>
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  Executing a Swap
                </h3>
                <ol className="list-decimal pl-6 space-y-3 text-neutral-300 mb-6">
                  <li>
                    Navigate to the{" "}
                    <Link
                      href="/swap"
                      className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Swap page
                    </Link>
                  </li>
                  <li>
                    Select the token you want to swap from in the
                    &quot;From&quot; field
                  </li>
                  <li>
                    Select the token you want to receive in the &quot;To&quot;
                    field
                  </li>
                  <li>Enter the amount you wish to swap</li>
                  <li>Adjust slippage tolerance if needed (default is 0.5%)</li>
                  <li>
                    Click &quot;Swap&quot; and confirm the transaction in your
                    wallet
                  </li>
                </ol>
                <div className="bg-neutral-800 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-white mb-2">Pro Tip</h4>
                  <p className="text-neutral-300">
                    For large trades, consider splitting your transaction into
                    smaller amounts to minimize price impact and slippage.
                  </p>
                </div>
              </section>

              <section id="task-manager" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Task Manager
                </h2>
                <p className="text-neutral-300 mb-4">
                  The Swift Protocol Task Manager helps you organize and keep
                  track of your trading activities:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-neutral-300 mb-6">
                  <li>
                    Create tasks related to trading, research, setup, or other
                    categories
                  </li>
                  <li>Track completion status of each task</li>
                  <li>Filter tasks by status (all, active, completed)</li>
                  <li>All tasks are stored locally in your browser</li>
                </ul>
                <p className="text-neutral-300">
                  <Link
                    href="/tasks"
                    className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Visit the Task Manager
                  </Link>{" "}
                  to start organizing your trading activities.
                </p>
              </section>

              <section id="supported-tokens" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Supported Tokens
                </h2>
                <p className="text-neutral-300 mb-4">
                  Swift Protocol supports a wide range of tokens on the Solana
                  blockchain, including:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-neutral-300 mb-6">
                  <li>Major cryptocurrencies (SOL)</li>
                  <li>Stablecoins (USDC, USDT)</li>
                  <li>DeFi tokens (RAY, SRM, ORCA, FIDA)</li>
                  <li>Meme coins (BONK, SAMO)</li>
                  <li>And many more!</li>
                </ul>
                <p className="text-neutral-300">
                  For a complete list of supported tokens and their details,
                  visit our{" "}
                  <Link
                    href="/swap"
                    className="text-indigo-400 hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Swap page
                  </Link>
                  .
                </p>
              </section>

              <section id="architecture" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Architecture
                </h2>
                <p className="text-neutral-300 mb-4">
                  Swift Protocol is built with a focus on security, efficiency,
                  and user experience:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-neutral-800 mb-6">
                    <thead className="bg-neutral-800">
                      <tr>
                        <th className="px-6 py-3 border-b border-neutral-700 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                          Component
                        </th>
                        <th className="px-6 py-3 border-b border-neutral-700 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-neutral-900 divide-y divide-neutral-800">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-300">
                          Frontend
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-300">
                          Next.js with TypeScript for a responsive and type-safe
                          user interface
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-300">
                          Styling
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-300">
                          Tailwind CSS for modern, responsive design
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-300">
                          Blockchain
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-300">
                          Solana blockchain for high throughput and low
                          transaction costs
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-300">
                          Smart Contracts
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-300">
                          Rust-based smart contracts for security and efficiency
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-300">
                          Routing Engine
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-300">
                          Proprietary algorithm for optimal routing across
                          liquidity pools
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="faq" className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      What are the fees for using Swift Protocol?
                    </h3>
                    <p className="text-neutral-300">
                      Swift Protocol charges a 0.3% fee on all trades. These
                      fees are used to maintain the platform, fund development,
                      and provide rewards to liquidity providers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Is Swift Protocol audited?
                    </h3>
                    <p className="text-neutral-300">
                      Yes, Swift Protocol has undergone multiple security audits
                      by leading blockchain security firms. Audit reports are
                      available upon request.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      How does Swift Protocol ensure the best prices?
                    </h3>
                    <p className="text-neutral-300">
                      Our proprietary routing engine searches across multiple
                      liquidity sources to find the optimal trading path with
                      the lowest slippage and best execution price.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Can I use Swift Protocol on mobile devices?
                    </h3>
                    <p className="text-neutral-300">
                      Yes, Swift Protocol is fully responsive and works on
                      mobile devices. Simply visit our website from your mobile
                      browser and connect your wallet.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
