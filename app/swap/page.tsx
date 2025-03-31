// app/swap/page.tsx
"use client";
import { useEffect, useState, useMemo } from "react";
import { useWalletContext } from "@/app/context/WalletContext";
import {
  fetchTokenList,
  getQuote,
  getSwapTransaction,
  SwapTransactionResult,
  SOLANA_RPC_URL,
  CUSTOM_FEE_BPS,
} from "@/lib/jupiter";
import { storeSwapTransaction } from "@/lib/supabase";
import { Token, normalizeToken } from "@/app/types/token";
import Navbar from "@/app/components/home/Navbar";
import Footer from "@/app/components/home/Footer";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  Transaction,
  VersionedTransaction,
  PublicKey,
} from "@solana/web3.js";
import Link from "next/link";
import { useAtom } from "jotai";
import { swapStateAtom } from "@/app/store/walletStore";

// Create a connection to the Solana network
const connection = new Connection(SOLANA_RPC_URL);

// Define the top 10 token symbols to prioritize
const TOP_TOKEN_SYMBOLS = [
  "SOL",
  "USDC",
  "BONK",
  "JUP",
  "RAY",
  "ORCA",
  "mSOL",
  "WIF",
  "RNDR",
  "USDT",
];

export default function SwapPage() {
  const {
    isConnected,
    publicKey,
    connecting,
    connectionError,
    reconnectWallet,
  } = useWalletContext();
  const wallet = useWallet();
  const [mounted, setMounted] = useState(false);

  // Use jotai for swap state
  const [state, setState] = useAtom(swapStateAtom);

  // Token lists
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);

  // Add state for token search/filter
  const [tokenSearch, setTokenSearch] = useState("");
  const [showFromTokenSearch, setShowFromTokenSearch] = useState(false);
  const [showToTokenSearch, setShowToTokenSearch] = useState(false);

  // Add a state to track if we're loading balances
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  // Set mounted state after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync wallet connection state on mount and when wallet state changes
  useEffect(() => {
    if (!mounted) return;

    // Log wallet connection state for debugging
    console.log("Wallet adapter state:", {
      connected: wallet.connected,
      publicKey: wallet.publicKey?.toString(),
      contextIsConnected: isConnected,
      contextPublicKey: publicKey,
    });

    // If there's a mismatch between adapter and context, prefer adapter state
    if (
      wallet.connected !== isConnected ||
      (wallet.publicKey?.toString() !== publicKey && publicKey !== null)
    ) {
      console.log("Wallet state mismatch detected");
    }
  }, [mounted, wallet.connected, wallet.publicKey, isConnected, publicKey]);

  // Filter tokens for display in the dropdown
  const getDisplayTokens = useMemo(() => {
    if (tokenSearch) {
      // If there's a search query, show all matching tokens
      const search = tokenSearch.toLowerCase();
      return tokens.filter(
        (token) =>
          token.symbol?.toLowerCase().includes(search) ||
          token.name?.toLowerCase().includes(search) ||
          token.address?.toLowerCase().includes(search) ||
          false
      );
    } else {
      // When no search query, show top tokens first
      const topTokens = tokens.filter((token) =>
        TOP_TOKEN_SYMBOLS.includes(token.symbol)
      );

      // Sort them according to the TOP_TOKEN_SYMBOLS array order
      topTokens.sort((a, b) => {
        const aIndex = TOP_TOKEN_SYMBOLS.indexOf(a.symbol);
        const bIndex = TOP_TOKEN_SYMBOLS.indexOf(b.symbol);
        return aIndex - bIndex;
      });

      return topTokens;
    }
  }, [tokens, tokenSearch]);

  // Function to render the token selection dropdown
  const renderTokenSelector = (
    isFrom: boolean,
    selectedToken: Token | null,
    onSelect: (token: Token) => void
  ) => {
    const showSearch = isFrom ? showFromTokenSearch : showToTokenSearch;
    const setShowSearch = isFrom
      ? setShowFromTokenSearch
      : setShowToTokenSearch;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowSearch(true);
            // Reset search when opening
            setTokenSearch("");
          }}
          className="flex items-center space-x-2 bg-indigo-900/40 border border-indigo-700/50 text-white font-medium py-2 px-3 rounded-lg"
          disabled={state.loading || isLoadingTokens || connecting}
        >
          {selectedToken ? (
            <>
              {selectedToken.logoURI && (
                <img
                  src={selectedToken.logoURI}
                  alt={selectedToken.symbol}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    // If image fails to load, hide it
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <span>{selectedToken.symbol}</span>
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
            </>
          ) : (
            <span>Select token</span>
          )}
        </button>

        {showSearch && (
          <div className="absolute mt-1 z-50 w-64 right-0 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search tokens..."
                className="w-full p-2 bg-neutral-700 border border-neutral-600 rounded text-white text-sm"
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {isLoadingTokens ? (
                <div className="text-center py-4">
                  <svg
                    className="animate-spin h-5 w-5 text-indigo-400 mx-auto"
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
              ) : getDisplayTokens.length === 0 ? (
                <div className="text-center py-4 text-neutral-400 text-sm">
                  No tokens found
                </div>
              ) : (
                <>
                  {getDisplayTokens.map((token) => {
                    const isDisabled =
                      (isFrom && token.symbol === state.toToken?.symbol) ||
                      (!isFrom && token.symbol === state.fromToken?.symbol);

                    return (
                      <button
                        key={token.address}
                        onClick={() => {
                          if (!isDisabled) {
                            onSelect(token);
                            setShowSearch(false);
                          }
                        }}
                        disabled={isDisabled}
                        className={`flex items-center w-full px-4 py-2 hover:bg-neutral-700 ${
                          isDisabled
                            ? "opacity-40 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center space-x-2 w-full">
                          {token.logoURI && (
                            <img
                              src={token.logoURI}
                              alt={token.symbol}
                              className="w-6 h-6 rounded-full"
                              onError={(e) => {
                                // If image fails to load, hide it
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <div className="flex flex-col items-start">
                            <span className="text-white font-medium text-sm">
                              {token.symbol}
                            </span>
                            <span className="text-neutral-400 text-xs truncate">
                              {token.name}
                            </span>
                          </div>
                          <div className="ml-auto text-right">
                            <span className="text-white text-sm">
                              {(token.balance || 0).toFixed(
                                (token.balance || 0) > 0.01 ? 2 : 6
                              )}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {!tokenSearch && (
                    <div className="px-4 py-2">
                      <div className="border-t border-neutral-700 pt-2 text-center">
                        <span className="text-xs text-neutral-400">
                          Type to search for more tokens
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-2 border-t border-neutral-700">
              <button
                className="w-full p-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white text-sm"
                onClick={() => setShowSearch(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Close token selectors when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFromTokenSearch || showToTokenSearch) {
        // If the click is outside any token selector, close them
        const targetElement = event.target as HTMLElement;
        if (!targetElement.closest(".token-selector")) {
          setShowFromTokenSearch(false);
          setShowToTokenSearch(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFromTokenSearch, showToTokenSearch]);

  // Fetch token list on mount
  useEffect(() => {
    const loadTokens = async () => {
      setIsLoadingTokens(true);
      let errorOccurred = false;

      try {
        // Fetch the actual token list from Jupiter API
        const tokenInfos = await fetchTokenList();

        // Map token list to our format
        const mappedTokens: Token[] = tokenInfos
          .filter((token) => token.symbol && token.address) // Filter out tokens without symbol or address
          .map((token) => ({
            symbol: token.symbol,
            name: token.name || token.symbol,
            address: token.address,
            decimals: token.decimals || 0,
            logoURI: token.logoURI,
            price: 0, // Will be updated later (in a real app, you'd fetch prices)
            balance: 0, // Will be updated if wallet connected
          }))
          // Prioritize common tokens first
          .sort((a, b) => {
            const popularSymbols = [
              "SOL",
              "USDC",
              "BONK",
              "JUP",
              "ORCA",
              "RAY",
            ];
            const aIndex = popularSymbols.indexOf(a.symbol);
            const bIndex = popularSymbols.indexOf(b.symbol);

            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return a.symbol.localeCompare(b.symbol);
          });

        // Set some mock prices for top tokens (in a real app, you'd fetch prices)
        const tokenPrices: Record<string, number> = {
          SOL: 169.42,
          USDC: 1.0,
          BONK: 0.000032,
          JUP: 1.25,
          RAY: 0.35,
          ORCA: 0.55,
        };

        const tokensWithPrices = mappedTokens.map((token) => ({
          ...token,
          price: tokenPrices[token.symbol] || 0,
        }));

        setTokens(tokensWithPrices);

        // Set default tokens - find SOL and USDC
        const solToken = tokensWithPrices.find((t) => t.symbol === "SOL");
        const usdcToken = tokensWithPrices.find((t) => t.symbol === "USDC");

        setState((prev) => ({
          ...prev,
          fromToken: solToken || tokensWithPrices[0],
          toToken:
            usdcToken ||
            (tokensWithPrices.length > 1
              ? tokensWithPrices[1]
              : tokensWithPrices[0]),
        }));

        // If wallet is connected, fetch real balances
        // Double check both our context AND wallet adapter to ensure consistency
        if (isConnected && publicKey && wallet.publicKey) {
          console.log("Fetching balances for connected wallet");
          try {
            await updateTokenBalances(tokensWithPrices);
          } catch (balanceError) {
            console.error(
              "Failed to fetch initial token balances:",
              balanceError
            );
            errorOccurred = true;
            // Continue without token balances
          }
        } else {
          console.log("Skipping balance fetch - wallet not fully connected");
        }
      } catch (error) {
        console.error("Failed to load tokens:", error);
        errorOccurred = true;

        // Fallback to predefined tokens if there's an error
        const fallbackTokens: Token[] = [
          {
            symbol: "SOL",
            name: "Solana",
            address: "So11111111111111111111111111111111111111112",
            decimals: 9,
            logoURI:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            price: 169.42,
            balance: 0,
          },
          {
            symbol: "USDC",
            name: "USD Coin",
            address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            decimals: 6,
            logoURI:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
            price: 1.0,
            balance: 0,
          },
          {
            symbol: "BONK",
            name: "Bonk",
            address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
            decimals: 5,
            logoURI:
              "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263/logo.png",
            price: 0.000032,
            balance: 0,
          },
        ];

        setTokens(fallbackTokens);
        setState((prev) => ({
          ...prev,
          fromToken: fallbackTokens[0],
          toToken: fallbackTokens[1],
          error: errorOccurred
            ? "Some features might be limited due to network issues. You can still browse tokens and prepare swaps."
            : null,
        }));
      } finally {
        setIsLoadingTokens(false);
      }
    };

    loadTokens();
  }, [isConnected, publicKey, wallet.publicKey, wallet.connected]);

  // Function to fetch and update token balances from connected wallet
  const updateTokenBalances = async (tokensToUpdate: Token[]) => {
    if (!isConnected || !publicKey) return;

    setIsLoadingBalances(true);

    try {
      // Create a copy of tokens
      const updatedTokens = [...tokensToUpdate];

      // For each token, fetch balance
      for (let i = 0; i < updatedTokens.length; i++) {
        const token = updatedTokens[i];

        try {
          let balance = 0;
          // For SOL, get balance directly from connection
          if (token.symbol === "SOL") {
            try {
              const solBalance = await connection.getBalance(
                new PublicKey(publicKey)
              );
              balance = solBalance / Math.pow(10, 9); // Convert lamports to SOL
            } catch (balanceError) {
              console.warn("Failed to fetch SOL balance:", balanceError);
              // Keep balance at 0 if error occurs
            }
          } else {
            // For other tokens, placeholder for SPL token accounts check
            // In a real app, you would use getParsedTokenAccountsByOwner
            // This is just a placeholder - you need to implement actual token balance fetching
            balance = 0;
          }

          updatedTokens[i] = { ...token, balance };
        } catch (err) {
          console.error(`Error fetching balance for ${token.symbol}:`, err);
          // Keep the token but don't update balance
        }
      }

      // Update tokens state with new balances
      setTokens(updatedTokens);

      // Update current from/to tokens if they exist
      const currentFromToken = state.fromToken;
      const currentToToken = state.toToken;

      if (currentFromToken) {
        const updatedFromToken = updatedTokens.find(
          (t) => t.symbol === currentFromToken.symbol
        );
        if (updatedFromToken) {
          setState((prev) => ({ ...prev, fromToken: updatedFromToken }));
        }
      }

      if (currentToToken) {
        const updatedToToken = updatedTokens.find(
          (t) => t.symbol === currentToToken.symbol
        );
        if (updatedToToken) {
          setState((prev) => ({ ...prev, toToken: updatedToToken }));
        }
      }
    } catch (error) {
      console.error("Error updating token balances:", error);
    } finally {
      setIsLoadingBalances(false);
    }
  };

  // Calculate swap route when inputs change
  useEffect(() => {
    const getSwapRoute = async () => {
      const { fromToken, toToken, fromAmount } = state;

      if (
        !fromToken ||
        !toToken ||
        !fromAmount ||
        parseFloat(fromAmount) <= 0
      ) {
        setState((prev) => ({ ...prev, toAmount: "" }));
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Calculate estimated amount based on price for UI responsiveness
        const estimatedAmount = (
          (parseFloat(fromAmount) * (fromToken.price || 0)) /
          (toToken.price || 1)
        ).toString();
        setState((prev) => ({ ...prev, toAmount: estimatedAmount }));

        // Only make API call if wallet is connected
        if (isConnected && publicKey) {
          const amountInSmallestUnit = (
            parseFloat(fromAmount) * Math.pow(10, fromToken.decimals)
          ).toString();

          const normalizedFromToken = normalizeToken(fromToken);
          const normalizedToToken = normalizeToken(toToken);

          try {
            // Get quote from Jupiter API
            const quoteResponse = await getQuote({
              inputMint: normalizedFromToken.address!,
              outputMint: normalizedToToken.address!,
              amount: amountInSmallestUnit,
              slippageBps: state.slippage * 100,
            });

            // Update state with route information
            setState((prev) => ({
              ...prev,
              route: quoteResponse,
              toAmount: (
                parseFloat(quoteResponse.outAmount) /
                Math.pow(10, toToken.decimals)
              ).toString(),
            }));
          } catch (apiError) {
            console.error("Our API error:", apiError);
            setState((prev) => ({
              ...prev,
              error:
                "Failed to get swap . The token pair might not have liquidity or our API might be having issues.",
            }));
          }
        }
      } catch (error) {
        console.error("Error getting swap route:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to calculate swap. Please try again.",
        }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    // Use a debounce to avoid too many API calls
    const handler = setTimeout(() => {
      getSwapRoute();
    }, 500);

    return () => clearTimeout(handler);
  }, [
    state.fromToken,
    state.toToken,
    state.fromAmount,
    state.slippage,
    isConnected,
    publicKey,
  ]);

  // Handle from amount change
  const handleFromAmountChange = (value: string) => {
    setState((prev) => ({
      ...prev,
      fromAmount: value,
    }));
  };

  // Swap tokens
  const handleSwapTokens = () => {
    setState((prev) => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: "",
      toAmount: "",
      route: null,
    }));
  };

  // Check if an error is a WalletDisconnectedError
  const isWalletDisconnectedError = (error: unknown): boolean => {
    if (!error) return false;
    return (
      (typeof error === "object" &&
        "name" in error &&
        error.name === "WalletDisconnectedError") ||
      (typeof error === "string" && error.includes("Wallet disconnected")) ||
      (error instanceof Error &&
        (error.message.includes("Wallet disconnected") ||
          error.name === "WalletDisconnectedError"))
    );
  };

  // Handle wallet disconnection error
  const handleWalletDisconnectionError = async () => {
    console.log("Attempting to reconnect wallet");
    setState((prev) => ({
      ...prev,
      loading: false,
      error: "Reconnecting wallet...",
    }));

    try {
      await reconnectWallet();
      setState((prev) => ({ ...prev, error: null }));
    } catch (reconnectError) {
      console.error("Failed to reconnect wallet:", reconnectError);
      setState((prev) => ({
        ...prev,
        error:
          "Failed to reconnect wallet. Please refresh the page and try again.",
      }));
    }
  };

  // Execute the swap function
  const executeSwap = async () => {
    if (
      !isConnected ||
      !publicKey ||
      !wallet.publicKey ||
      !state.fromToken ||
      !state.toToken ||
      !state.route
    ) {
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { fromToken, toToken, fromAmount, route } = state;

      // Log the transaction parameters
      console.log("Executing swap:", {
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        amount: fromAmount,
        publicKey,
      });

      // Get the swap transaction
      const swapResult: SwapTransactionResult = await getSwapTransaction(
        route,
        publicKey,
        CUSTOM_FEE_BPS
      );

      // Try to deserialize as a versioned transaction first
      try {
        // Deserialize and sign the transaction as a versioned transaction
        const serializedTransaction = Buffer.from(
          swapResult.swapTransaction,
          "base64"
        );

        // Check if the transaction is a versioned transaction (first byte indicates version)
        if (serializedTransaction[0] < 127) {
          // Legacy transaction
          // Handle as legacy transaction
          const transaction = Transaction.from(serializedTransaction);

          // Sign and send the transaction
          const signedTransaction = await wallet.signTransaction!(transaction);
          const signature = await connection.sendRawTransaction(
            signedTransaction.serialize()
          );

          console.log("Swap transaction submitted:", signature);
          await connection.confirmTransaction(signature, "confirmed");

          // Store the transaction in Supabase
          await storeSwapTransaction({
            fromToken: fromToken.symbol,
            toToken: toToken.symbol,
            fromAmount: parseFloat(fromAmount),
            toAmount: parseFloat(state.toAmount || "0"),
            walletAddress: publicKey,
            txSignature: signature,
            timestamp: Date.now(),
          });

          setState((prev) => ({ ...prev, loading: false }));
          alert(`Swap successful! Transaction signature: ${signature}`);
        } else {
          // Handle as versioned transaction
          const transaction = VersionedTransaction.deserialize(
            serializedTransaction
          );

          // Sign and send the transaction
          if (wallet.signTransaction) {
            const signedTransaction = await wallet.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(
              signedTransaction.serialize()
            );

            console.log("Versioned swap transaction submitted:", signature);
            await connection.confirmTransaction(signature, "confirmed");

            // Store the transaction in Supabase
            await storeSwapTransaction({
              fromToken: fromToken.symbol,
              toToken: toToken.symbol,
              fromAmount: parseFloat(fromAmount),
              toAmount: parseFloat(state.toAmount || "0"),
              walletAddress: publicKey,
              txSignature: signature,
              timestamp: Date.now(),
            });

            setState((prev) => ({ ...prev, loading: false }));
            alert(`Swap successful! Transaction signature: ${signature}`);
          } else {
            throw new Error("Wallet does not support signing transactions");
          }
        }
      } catch (err) {
        console.error("Error processing transaction:", err);

        // Check if this is a wallet disconnection error
        if (isWalletDisconnectedError(err)) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Wallet disconnected during transaction. Please reconnect.",
          }));
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: `Transaction failed: ${
              err instanceof Error ? err.message : String(err)
            }`,
          }));
        }
      }
    } catch (error) {
      console.error("Swap error:", error);

      // Check if this is a wallet disconnection error
      if (isWalletDisconnectedError(error)) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Wallet disconnected. Please reconnect.",
        }));
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: `Swap failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        }));
      }
    }
  };

  // Display an error message if there is one
  const errorMessage = useMemo(() => {
    if (state.error) {
      const isWalletError =
        isWalletDisconnectedError(state.error) ||
        (typeof state.error === "string" &&
          state.error.includes("Wallet disconnected"));

      return (
        <div className="mt-4 p-3 bg-red-900/20 text-red-400 rounded-lg text-sm">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col w-full">
              <span>{state.error}</span>
              {isWalletError && (
                <button
                  onClick={handleWalletDisconnectionError}
                  className="mt-2 text-xs bg-indigo-700 text-white py-1 px-2 rounded self-start hover:bg-indigo-600 transition-colors"
                >
                  Reconnect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (connectionError) {
      return (
        <div className="mb-4 p-3 bg-amber-900/20 text-amber-400 rounded-lg text-sm">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex flex-col w-full">
              <span>{connectionError}</span>
              <button
                onClick={reconnectWallet}
                className="mt-2 text-xs bg-amber-700 text-white py-1 px-2 rounded self-start hover:bg-amber-600 transition-colors"
              >
                Reconnect Wallet
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }, [
    state.error,
    connectionError,
    reconnectWallet,
    handleWalletDisconnectionError,
  ]);

  return (
    <div className=" dark:bg-neutral-950 font-inter flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-20 pb-70 ">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-neutral-900 shadow-xl rounded-xl p-6 border border-neutral-800">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold text-white">Swap Tokens</h1>
              <div className="flex items-center space-x-4">
                {mounted && isConnected && wallet.publicKey && (
                  <Link
                    href="/transactions"
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    View Transactions
                  </Link>
                )}
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      slippage: prev.slippage === 1 ? 0.5 : 1,
                    }))
                  }
                  className="flex items-center text-neutral-400 hover:text-neutral-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
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
                  <span className="text-xs">{state.slippage}% Slippage</span>
                </button>
              </div>
            </div>

            {/* From Token */}
            <div className="mb-4">
              <div className="bg-neutral-800 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-400">From</span>
                  <div className="flex items-center">
                    <span className="text-sm text-neutral-400">
                      {isLoadingBalances ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
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
                          Loading balance...
                        </span>
                      ) : state.fromToken ? (
                        `Balance: ${(state.fromToken.balance || 0).toFixed(
                          4
                        )} ${state.fromToken.symbol}`
                      ) : (
                        "Select token"
                      )}
                    </span>
                    {isConnected && state.fromToken && !isLoadingBalances && (
                      <button
                        onClick={() => updateTokenBalances(tokens)}
                        className="ml-1 text-indigo-400 hover:text-indigo-300"
                        title="Refresh balance"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <input
                    type="text"
                    value={state.fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    placeholder="0.0"
                    className="bg-transparent text-2xl font-semibold text-white outline-none flex-grow min-w-0"
                    disabled={state.loading || isLoadingTokens || connecting}
                  />
                  <div className="token-selector">
                    {renderTokenSelector(true, state.fromToken, (token) => {
                      setState((prev) => ({
                        ...prev,
                        fromToken: token,
                        fromAmount:
                          prev.fromAmount === "" ? "" : prev.fromAmount,
                        toAmount: "",
                      }));
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center -my-3 z-10 relative">
              <button
                onClick={handleSwapTokens}
                className="bg-neutral-900 border border-neutral-700 rounded-full p-2 shadow-md hover:shadow-lg transition"
                disabled={state.loading || isLoadingTokens || connecting}
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
                  <div className="flex items-center">
                    <span className="text-sm text-neutral-400">
                      {isLoadingBalances ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
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
                          Loading balance...
                        </span>
                      ) : state.toToken ? (
                        `Balance: ${(state.toToken.balance || 0).toFixed(4)} ${
                          state.toToken.symbol
                        }`
                      ) : (
                        "Select token"
                      )}
                    </span>
                    {isConnected && state.toToken && !isLoadingBalances && (
                      <button
                        onClick={() => updateTokenBalances(tokens)}
                        className="ml-1 text-indigo-400 hover:text-indigo-300"
                        title="Refresh balance"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <input
                    type="text"
                    value={state.toAmount}
                    readOnly
                    placeholder="0.0"
                    className="bg-transparent text-2xl font-semibold text-white outline-none flex-grow min-w-0"
                  />
                  <div className="token-selector">
                    {renderTokenSelector(false, state.toToken, (token) => {
                      setState((prev) => ({
                        ...prev,
                        toToken: token,
                        toAmount: "",
                      }));
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Display any errors */}
            {errorMessage}

            {/* Price info */}
            {state.fromToken &&
              state.toToken &&
              state.fromAmount &&
              state.toAmount && (
                <div className="mb-4 p-3 bg-neutral-800/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Rate</span>
                    <span className="text-white">
                      1 {state.fromToken.symbol} ≈{" "}
                      {(
                        parseFloat(state.toAmount) /
                        parseFloat(state.fromAmount)
                      ).toFixed(6)}{" "}
                      {state.toToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-neutral-400">Fee</span>
                    <span className="text-white">
                      {CUSTOM_FEE_BPS / 100}% (
                      {(
                        (parseFloat(state.toAmount) * CUSTOM_FEE_BPS) /
                        10000
                      ).toFixed(6)}{" "}
                      {state.toToken.symbol})
                    </span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-neutral-700">
                    <div className="text-xs text-neutral-500 text-center">
                      Transactions include a {CUSTOM_FEE_BPS / 100}% protocol
                      fee
                    </div>
                  </div>
                </div>
              )}

            {/* Swap button or Connect Wallet */}
            {mounted && isConnected && wallet.publicKey ? (
              <button
                onClick={executeSwap}
                disabled={
                  !state.fromToken ||
                  !state.toAmount ||
                  !state.fromAmount ||
                  parseFloat(state.fromAmount) <= 0 ||
                  state.loading ||
                  isLoadingTokens ||
                  isLoadingBalances ||
                  connecting ||
                  !state.route
                }
                className={`w-full py-3 px-4 rounded-xl font-medium text-white ${
                  !state.fromToken ||
                  !state.toAmount ||
                  !state.fromAmount ||
                  parseFloat(state.fromAmount) <= 0 ||
                  state.loading ||
                  isLoadingTokens ||
                  isLoadingBalances ||
                  connecting ||
                  !state.route
                    ? "bg-indigo-500/50 cursor-not-allowed"
                    : "bg-indigo-500 hover:bg-indigo-600"
                } transition-colors duration-200 flex items-center justify-center`}
              >
                {state.loading ||
                isLoadingTokens ||
                isLoadingBalances ||
                connecting ? (
                  <>
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
                    {connecting ? "Connecting..." : "Loading..."}
                  </>
                ) : (
                  "Swap"
                )}
              </button>
            ) : (
              <div className="flex justify-center">
                {mounted ? (
                  <WalletMultiButton className="py-3 px-4 rounded-xl font-medium bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200" />
                ) : (
                  <button
                    className="py-3 px-4 rounded-xl font-medium bg-indigo-500 text-white"
                    disabled={true}
                  >
                    Loading...
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
