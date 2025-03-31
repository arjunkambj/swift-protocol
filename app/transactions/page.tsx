"use client";
import { useEffect, useState } from "react";
import { useWalletContext } from "@/app/context/WalletContext";
import { supabase } from "@/lib/supabase";
import Navbar from "@/app/components/home/Navbar";
import Footer from "@/app/components/home/Footer";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { CUSTOM_FEE_BPS, FEE_RECIPIENT } from "@/lib/jupiter";

interface Transaction {
  id: string;
  from_token: string;
  to_token: string;
  from_amount: number;
  to_amount: number;
  wallet_address: string;
  tx_signature: string;
  timestamp: number;
  created_at: string;
}

export default function TransactionsPage() {
  const { isConnected, publicKey, connecting } = useWalletContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect for fetching transactions when wallet connects
  useEffect(() => {
    if (isConnected && publicKey) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [isConnected, publicKey]);

  const fetchTransactions = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      // Check if Supabase is available
      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        setError("Transaction history is not available in this environment");
        setLoading(false);
        return;
      }

      const { data, error: supabaseError } = await supabase
        .from("swap_transactions")
        .select("*")
        .eq("wallet_address", publicKey)
        .order("timestamp", { ascending: false });

      if (supabaseError) {
        console.error("Error fetching transactions:", supabaseError);
        setError(`Failed to load transactions: ${supabaseError.message}`);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setError("Failed to load transactions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  function formatDate(timestamp: number) {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return "Invalid date";
    }
  }

  function shortenSignature(signature: string) {
    if (!signature || typeof signature !== "string") return "N/A";
    return signature.slice(0, 8) + "..." + signature.slice(-8);
  }

  // Add a helper function to show fee information
  function formatFeeInfo(amount: number, tokenSymbol: string) {
    const fee = (amount * CUSTOM_FEE_BPS) / 10000;
    return `${fee.toFixed(6)} ${tokenSymbol} (${CUSTOM_FEE_BPS / 100}%)`;
  }

  return (
    <div className="h-screen dark:bg-neutral-950 font-inter flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Transaction History
            </h1>
            <Link
              href="/swap"
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              ← Back to Swap
            </Link>
          </div>

          {!isConnected ? (
            <div className="bg-neutral-900 rounded-xl p-10 text-center shadow-lg border border-neutral-800">
              <h3 className="text-xl font-semibold text-white mb-6">
                Connect your wallet to view transaction history
              </h3>
              <div className="flex justify-center">
                <WalletMultiButton className="py-3 px-4 rounded-xl font-medium bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200" />
              </div>
            </div>
          ) : loading || connecting ? (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-10 w-10 text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="bg-neutral-900 rounded-xl p-10 text-center shadow-lg border border-neutral-800">
              <h3 className="text-xl font-semibold text-white mb-3">
                Error loading transactions
              </h3>
              <p className="text-red-400 mb-6">{error}</p>
              <button
                onClick={() => fetchTransactions()}
                className="inline-block py-3 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-neutral-900 rounded-xl p-10 text-center shadow-lg border border-neutral-800">
              <h3 className="text-xl font-semibold text-white mb-3">
                No transactions found
              </h3>
              <p className="text-neutral-400 mb-6">
                Once you complete a swap, your transactions will appear here.
              </p>
              <Link
                href="/swap"
                className="inline-block py-3 px-6 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors duration-200"
              >
                Make a Swap
              </Link>
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-800">
                  <thead className="bg-neutral-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        To
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Fee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                        Transaction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-neutral-800/20">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                          {formatDate(tx.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-white">
                              {tx.from_amount} {tx.from_token}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {tx.to_amount} {tx.to_token}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-indigo-400">
                            {formatFeeInfo(tx.to_amount, tx.to_token)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={`https://explorer.solana.com/tx/${tx.tx_signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            {shortenSignature(tx.tx_signature)}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Only show fee recipient info if there are transactions */}
          {transactions.length > 0 && (
            <div className="mt-4 p-4 bg-neutral-800/30 rounded-lg border border-neutral-800">
              <div className="text-sm text-center text-neutral-400">
                <span className="text-indigo-400">{CUSTOM_FEE_BPS / 100}%</span>{" "}
                protocol fees are collected by{" "}
                <a
                  href={`https://explorer.solana.com/address/${FEE_RECIPIENT.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  {shortenSignature(FEE_RECIPIENT.toString())}
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
