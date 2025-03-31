import { PublicKey, Transaction } from "@solana/web3.js";
import { TokenInfo as SplTokenInfo } from "@solana/spl-token-registry";
import { Token } from "./types";

export const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";
export const JUPITER_SWAP_API = "https://quote-api.jup.ag/v6/swap";

// Custom fee configuration from environment variables
// Default to 0.3% if not specified (30 basis points)
export const CUSTOM_FEE_BPS = parseInt(
  process.env.NEXT_PUBLIC_TRANSACTION_FEE || "30",
  10
);

// Fee recipient wallet from environment variable
export const FEE_RECIPIENT = new PublicKey(
  process.env.NEXT_PUBLIC_TRANSACTION_WALLET_ADDRESS ||
    "11111111111111111111111111111111" // Default to system program if not specified
);

// Read Solana network from environment variables
export const SOLANA_NETWORK =
  process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";
export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  (SOLANA_NETWORK === "devnet"
    ? "https://api-devnet.solana.com"
    : "https://solana-mainnet.rpc.extrnode.com"); // Using a more reliable public RPC endpoint

// Log setup info to console for debugging
console.log(
  `Jupiter fee configuration: ${
    CUSTOM_FEE_BPS / 100
  }% to ${FEE_RECIPIENT.toString()}`
);
console.log(`Solana network: ${SOLANA_NETWORK} (${SOLANA_RPC_URL})`);

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

// Initialize Solana connection (mainnet-beta)
// Note: This is no longer used since we're using the Jupiter API directly
// but we're keeping it commented for reference
// const connection = new Connection(
//   process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
//     "https://api.mainnet-beta.solana.com"
// );

// Token lists
let tokenList: SplTokenInfo[] = [];

// Constants for token list
export const TOKEN_LIST_URL = "https://token.jup.ag/strict";

// Fetch token list from Jupiter API
export const fetchTokenList = async (): Promise<SplTokenInfo[]> => {
  if (tokenList.length > 0) return tokenList;

  try {
    const response = await fetch(TOKEN_LIST_URL);
    const tokens = await response.json();
    tokenList = tokens;
    return tokens;
  } catch (error) {
    console.error("Error fetching token list:", error);
    return [];
  }
};

// Get token by symbol
export const getTokenBySymbol = (symbol: string): SplTokenInfo | undefined => {
  return tokenList.find((token) => token.symbol === symbol);
};

// Get token by mint address
export const getTokenByMint = (
  mintAddress: string
): SplTokenInfo | undefined => {
  return tokenList.find((token) => token.address === mintAddress);
};

// Get quote for token swap - Directly use Jupiter API instead of the SDK
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

export interface SwapTransactionResult {
  swapTransaction: string;
}

// Get swap transaction
export async function getSwapTransaction(
  quoteResponse: QuoteResponse,
  userPublicKey: string,
  feeBps: number = CUSTOM_FEE_BPS
): Promise<SwapTransactionResult> {
  console.log(
    `Generating swap transaction with ${
      feeBps / 100
    }% fee to ${FEE_RECIPIENT.toString()}`
  );

  // Add our custom fee to the transaction
  const swapParams = {
    quoteResponse,
    userPublicKey,
    feeAccount: FEE_RECIPIENT.toString(),
    feeBps,
  };

  // Log swap parameters for debugging
  console.log(
    `Swap from ${quoteResponse.inputMint} to ${quoteResponse.outputMint}`
  );
  console.log(
    `Amount: ${quoteResponse.amount}, Out Amount: ${quoteResponse.outAmount}`
  );

  const response = await fetch(JUPITER_SWAP_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(swapParams),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Jupiter swap error: ${errorText}`);
    throw new Error(`Error creating swap transaction: ${errorText}`);
  }

  return await response.json();
}

export interface SwapExecutionParams {
  transaction: Transaction;
  wallet: {
    publicKey: PublicKey | null;
    signTransaction?: (transaction: Transaction) => Promise<Transaction>;
    sendTransaction: (transaction: Transaction) => Promise<string>;
  };
}

// Execute a swap transaction
export async function executeSwapTransaction({
  transaction,
  wallet,
}: SwapExecutionParams) {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error("Wallet not connected");
  }

  return await wallet.sendTransaction(transaction);
}

// Popular tokens with their info
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
