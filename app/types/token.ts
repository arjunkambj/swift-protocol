// Interface for the main token display/usage
export interface Token {
  symbol: string;
  name: string;
  logoURI?: string;
  address?: string; // For compatibility with our app format
  mint?: string; // For compatibility with lib/types.ts
  decimals: number;
  price?: number;
  balance?: number;
}

// Convert mint to address or vice versa based on availability
export function normalizeToken(token: Token): Token {
  if (!token.address && token.mint) {
    return {
      ...token,
      address: token.mint,
    };
  }
  if (!token.mint && token.address) {
    return {
      ...token,
      mint: token.address,
    };
  }
  return token;
}

// Define individual route parts
export interface SwapInfo {
  ammKey: string;
  label: string;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  feeAmount: string;
  feeMint: string;
}

export interface RoutePlanItem {
  swapInfo: SwapInfo;
  percent: number;
}

// Define a type for the route object based on QuoteResponse from Jupiter API
export interface RouteInfo {
  inputMint: string;
  outputMint: string;
  amount: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: RoutePlanItem[];
  contextSlot: number;
  timeTaken: number;
}

export interface SwapState {
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;
  slippage: number;
  route: RouteInfo | null;
  loading: boolean;
  error: string | null;
}
