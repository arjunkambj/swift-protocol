import { atom } from "jotai";
import { SwapState } from "@/app/types/token";

// Default swap state
export const defaultSwapState: SwapState = {
  fromToken: null,
  toToken: null,
  fromAmount: "",
  toAmount: "",
  slippage: 1, // 1%
  route: null,
  loading: false,
  error: null,
};

// Atom for wallet connection status
export const isWalletConnectedAtom = atom<boolean>(false);

// Atom for swap state
export const swapStateAtom = atom<SwapState>(defaultSwapState);

// Atom for resetting swap state when wallet is disconnected
export const resetSwapOnDisconnectAtom = atom(
  (get) => get(swapStateAtom),
  (get, set) => {
    // If we're disconnecting, reset the swap state
    if (!get(isWalletConnectedAtom)) {
      set(swapStateAtom, defaultSwapState);
    }
  }
);
