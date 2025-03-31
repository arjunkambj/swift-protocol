"use client";
import { useState } from "react";
import Image from "next/image";
import { POPULAR_TOKENS } from "@/lib/jupiter";
import { Token } from "@/lib/types";

interface TokenSelectorProps {
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  label: string;
}

export default function TokenSelector({
  selectedToken,
  onSelect,
  label,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <button
        type="button"
        className="flex items-center justify-between w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedToken ? (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden relative mr-2">
              <Image
                src={selectedToken.logoURI}
                alt={selectedToken.symbol}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-medium">{selectedToken.symbol}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select token</span>
        )}
        <svg
          className="w-5 h-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="p-2 max-h-60 overflow-y-auto">
            {POPULAR_TOKENS.map((token) => (
              <button
                key={token.mint}
                type="button"
                className="flex items-center w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => {
                  onSelect(token);
                  setIsOpen(false);
                }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden relative mr-2">
                  <Image
                    src={token.logoURI}
                    alt={token.symbol}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-xs text-gray-500">{token.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
