// app/swap/page.tsx
"use client";
import { useState } from "react";
import Navbar from "@/app/components/home/Navbar";
import Footer from "@/app/components/home/Footer";

// Sample token data
const tokens = [
  { symbol: "SOL", name: "Solana", price: 169.42, balance: 5.2 },
  { symbol: "USDC", name: "USD Coin", price: 1.0, balance: 1250.75 },
  { symbol: "BONK", name: "Bonk", price: 0.000032, balance: 1250000 },
  { symbol: "RAY", name: "Raydium", price: 0.35, balance: 120 },
  { symbol: "SRM", name: "Serum", price: 0.011, balance: 500 },
  { symbol: "MNDE", name: "Marinade", price: 0.032, balance: 350 },
];

export default function SwapPage() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Exchange rate calculation (simplified)
  const calculateToAmount = (amount: string) => {
    if (!amount || isNaN(parseFloat(amount))) {
      return "";
    }
    const rate = fromToken.price / toToken.price;
    return (parseFloat(amount) * rate).toFixed(
      toToken.symbol === "BONK" ? 0 : 6
    );
  };

  // Handle from amount change
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value));
  };

  // Swap tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    setToAmount("");
  };

  // Execute swap
  const executeSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      // Reset fields after "successful" swap
      setFromAmount("");
      setToAmount("");

      // Show success alert
      alert(
        `Swap successful! Exchanged ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}`
      );
    }, 1500);
  };

  return (
    <div className="h-screen dark:bg-neutral-950 font-inter flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-40 pb-60 ">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-neutral-900 shadow-xl rounded-xl p-6 border border-neutral-800">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-white">Swap Tokens</h1>
              <button className="text-neutral-400 hover:text-neutral-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            {/* From Token */}
            <div className="mb-4">
              <div className="bg-neutral-800 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-400">From</span>
                  <span className="text-sm text-neutral-400">
                    Balance: {fromToken.balance} {fromToken.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    placeholder="0.0"
                    className="bg-transparent text-2xl font-semibold text-white outline-none flex-grow min-w-0"
                  />
                  <div className="relative">
                    <select
                      value={fromToken.symbol}
                      onChange={(e) => {
                        const selected = tokens.find(
                          (t) => t.symbol === e.target.value
                        );
                        if (selected) {
                          setFromToken(selected);
                          setToAmount(calculateToAmount(fromAmount));
                        }
                      }}
                      className="appearance-none bg-indigo-900/40 border border-indigo-700/50 text-white font-medium py-2 pl-3 pr-8 rounded-lg cursor-pointer"
                    >
                      {tokens.map((token) => (
                        <option
                          key={token.symbol}
                          value={token.symbol}
                          disabled={token.symbol === toToken.symbol}
                        >
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center -my-3 z-10 relative">
              <button
                onClick={handleSwapTokens}
                className="bg-neutral-900 border border-neutral-700 rounded-full p-2 shadow-md hover:shadow-lg transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
              </button>
            </div>

            {/* To Token */}
            <div className="mb-6">
              <div className="bg-neutral-800 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-400">To</span>
                  <span className="text-sm text-neutral-400">
                    Balance: {toToken.balance} {toToken.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <input
                    type="text"
                    value={toAmount}
                    readOnly
                    placeholder="0.0"
                    className="bg-transparent text-2xl font-semibold text-white outline-none flex-grow min-w-0"
                  />
                  <div className="relative">
                    <select
                      value={toToken.symbol}
                      onChange={(e) => {
                        const selected = tokens.find(
                          (t) => t.symbol === e.target.value
                        );
                        if (selected) {
                          setToToken(selected);
                          setToAmount(calculateToAmount(fromAmount));
                        }
                      }}
                      className="appearance-none bg-indigo-900/40 border border-indigo-700/50 text-white font-medium py-2 pl-3 pr-8 rounded-lg cursor-pointer"
                    >
                      {tokens.map((token) => (
                        <option
                          key={token.symbol}
                          value={token.symbol}
                          disabled={token.symbol === fromToken.symbol}
                        >
                          {token.symbol}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap button */}
            <button
              onClick={executeSwap}
              disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white ${
                !fromAmount || parseFloat(fromAmount) <= 0 || isLoading
                  ? "bg-indigo-500/50 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600"
              } transition-colors duration-200 flex items-center justify-center`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
              ) : fromAmount && parseFloat(fromAmount) > 0 ? (
                "Swap"
              ) : (
                "Connect Wallet"
              )}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
