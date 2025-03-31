"use client";
import { CUSTOM_FEE_BPS } from "@/lib/jupiter";

interface SwapInfoProps {
  inputAmount: string;
  outputAmount: string;
  inputSymbol: string;
  outputSymbol: string;
  slippageBps: number;
  priceImpact?: string;
  routes?: { protocol: string; percent: number }[];
}

export default function SwapInfo({
  inputAmount,
  outputAmount,
  inputSymbol,
  outputSymbol,
  slippageBps,
  priceImpact = "0.00",
  routes = [],
}: SwapInfoProps) {
  // Calculate exchange rate
  const exchangeRate =
    inputAmount && outputAmount
      ? (parseFloat(outputAmount) / parseFloat(inputAmount)).toFixed(6)
      : "0";

  // Calculate fee amount (percentage of input)
  const feeAmount = inputAmount
    ? (parseFloat(inputAmount) * (CUSTOM_FEE_BPS / 10000)).toFixed(6)
    : "0";

  const feePercentage = (CUSTOM_FEE_BPS / 100).toFixed(2);

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Price</span>
          <span className="font-medium">
            1 {inputSymbol} = {exchangeRate} {outputSymbol}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Custom Fee ({feePercentage}%)
          </span>
          <span className="font-medium">
            {feeAmount} {inputSymbol}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Slippage Tolerance
          </span>
          <span className="font-medium">{(slippageBps / 100).toFixed(2)}%</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Price Impact</span>
          <span
            className={`font-medium ${
              parseFloat(priceImpact) > 3
                ? "text-red-500"
                : parseFloat(priceImpact) > 1
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {priceImpact}%
          </span>
        </div>

        {routes.length > 0 && (
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Routing
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {routes.map((route, index) => (
                <div
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full"
                >
                  {route.protocol} ({route.percent}%)
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
