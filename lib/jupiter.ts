import { PublicKey, Transaction } from "@solana/web3.js";
import { Token } from "./types";

export const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
export const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap";

// Custom fee configuration (in basis points, 1% = 100 basis points)
export const CUSTOM_FEE_BPS = 30; // 0.3% fee
export const FEE_RECIPIENT = new PublicKey("11111111111111111111111111111111"); // Replace with your fee wallet

export interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
  feeBps: number;
}

export interface RouteInfo {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

export interface QuoteResponse {
  inputMint: string;
  outputMint: string;
  amount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: RouteInfo[];
  contextSlot: number;
  timeTaken: number;
}

export async function getQuote({
  inputMint,
  outputMint,
  amount,
  slippageBps = 50, // Default 0.5%
}: Omit<SwapParams, "feeBps">) {
  const url = new URL(JUPITER_QUOTE_API);

  url.searchParams.append("inputMint", inputMint);
  url.searchParams.append("outputMint", outputMint);
  url.searchParams.append("amount", amount);
  url.searchParams.append("slippageBps", slippageBps.toString());

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Error fetching quote: ${await response.text()}`);
  }

  return (await response.json()) as QuoteResponse;
}

export async function getSwapTransaction(
  quoteResponse: QuoteResponse,
  userPublicKey: string,
  feeBps: number = CUSTOM_FEE_BPS
) {
  // Add our custom fee to the transaction
  const swapParams = {
    quoteResponse,
    userPublicKey,
    feeAccount: FEE_RECIPIENT.toString(),
    feeBps,
  };

  const response = await fetch(JUPITER_SWAP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(swapParams),
  });

  if (!response.ok) {
    throw new Error(
      `Error creating swap transaction: ${await response.text()}`
    );
  }

  const swapData = await response.json();
  return Transaction.from(Buffer.from(swapData.swapTransaction, "base64"));
}

export interface SwapExecutionParams {
  transaction: Transaction;
  wallet: {
    publicKey: PublicKey | null;
    signTransaction?: (transaction: Transaction) => Promise<Transaction>;
    sendTransaction: (transaction: Transaction) => Promise<string>;
  };
}

export async function executeSwap({
  transaction,
  wallet,
}: SwapExecutionParams) {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error("Wallet not connected");
  }

  return await wallet.sendTransaction(transaction);
}

export const POPULAR_TOKENS: Token[] = [
  {
    symbol: "SOL",
    name: "Solana",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    symbol: "BONK",
    name: "Bonk",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    decimals: 5,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
  },
];
