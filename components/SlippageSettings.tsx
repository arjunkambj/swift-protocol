"use client";
import { useState } from "react";

interface SlippageSettingsProps {
  slippageBps: number;
  onSlippageChange: (bps: number) => void;
}

const PRESET_SLIPPAGES = [50, 100, 200]; // 0.5%, 1%, 2%

export default function SlippageSettings({
  slippageBps,
  onSlippageChange,
}: SlippageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customSlippage, setCustomSlippage] = useState("");

  const handleCustomSlippageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    // Check if value is a valid number
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCustomSlippage(value);

      if (value !== "") {
        // Convert percentage to basis points (e.g., 0.5% -> 50 bps)
        const bps = Math.floor(parseFloat(value) * 100);
        onSlippageChange(bps);
      }
    }
  };

  const selectPresetSlippage = (bps: number) => {
    setCustomSlippage("");
    onSlippageChange(bps);
  };

  // Convert bps to percentage for display
  const slippagePercentage = (slippageBps / 100).toFixed(2);

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
        Slippage: {slippagePercentage}%
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl p-4">
          <div className="flex flex-col">
            <div className="text-sm font-medium mb-2">Slippage Tolerance</div>

            <div className="flex space-x-2 mb-3">
              {PRESET_SLIPPAGES.map((bps) => (
                <button
                  key={bps}
                  type="button"
                  className={`px-3 py-1 rounded-md text-sm ${
                    slippageBps === bps
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                  onClick={() => selectPresetSlippage(bps)}
                >
                  {bps / 100}%
                </button>
              ))}
            </div>

            <div className="flex items-center">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm"
                placeholder="Custom"
                value={customSlippage}
                onChange={handleCustomSlippageChange}
              />
              <span className="ml-2">%</span>
            </div>

            <div className="text-xs text-gray-500 mt-2">
              Your transaction will revert if the price changes unfavorably by
              more than this percentage.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
