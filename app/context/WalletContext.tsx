"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useAtom } from "jotai";
import {
  isWalletConnectedAtom,
  resetSwapOnDisconnectAtom,
} from "../store/walletStore";

// Default styles for wallet modal
import "@solana/wallet-adapter-react-ui/styles.css";

// Create context for our wallet data
interface WalletContextState {
  isConnected: boolean;
  publicKey: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  reconnectWallet: () => Promise<void>;
  connecting: boolean;
  connectionError: string | null;
}

const WalletContext = createContext<WalletContextState>({
  isConnected: false,
  publicKey: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  reconnectWallet: async () => {},
  connecting: false,
  connectionError: null,
});

export const useWalletContext = () => useContext(WalletContext);

// Inner wallet context provider
function WalletContextInnerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    publicKey,
    connected: walletConnected,
    connect,
    disconnect,
    wallet,
    connecting: adapterConnecting,
  } = useWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Jotai atoms for global state
  const [, setIsWalletConnected] = useAtom(isWalletConnectedAtom);
  // Use the resetSwapOnDisconnect atom to reset swap state when wallet disconnects
  const [, resetSwapOnDisconnect] = useAtom(resetSwapOnDisconnectAtom);

  // Set mounted state after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update connection state based on wallet adapter state
  useEffect(() => {
    if (!mounted) return;

    // Consider wallet connected only if both connected flag is true AND publicKey exists
    const isWalletConnected = walletConnected && publicKey !== null;

    // Log connection state for debugging
    console.log(
      `Wallet connection state: ${
        isWalletConnected ? "connected" : "disconnected"
      }`
    );
    if (publicKey) {
      console.log(`PublicKey: ${publicKey.toString()}`);
    }

    setIsConnected(isWalletConnected);
    // Update jotai atom for global state
    setIsWalletConnected(isWalletConnected);

    if (isWalletConnected && publicKey) {
      setConnectionError(null);
    } else if (!isWalletConnected) {
      // If disconnected, trigger the reset of swap state
      resetSwapOnDisconnect();
    }

    // Update connecting state from adapter
    setConnecting(adapterConnecting);
  }, [
    mounted,
    walletConnected,
    publicKey,
    adapterConnecting,
    setIsWalletConnected,
    resetSwapOnDisconnect,
  ]);

  // Add event listener for connection changes
  useEffect(() => {
    if (!wallet) return;

    const onDisconnect = () => {
      console.log("Wallet disconnected event detected");
      // Ensure UI updates accordingly
      setIsConnected(false);
      setIsWalletConnected(false);
      resetSwapOnDisconnect();
    };

    // Add a listener for disconnect events
    wallet.adapter.on("disconnect", onDisconnect);

    return () => {
      // Remove listener when component unmounts
      wallet.adapter.off("disconnect", onDisconnect);
    };
  }, [wallet, setIsWalletConnected, resetSwapOnDisconnect]);

  const connectWallet = async () => {
    try {
      setConnecting(true);
      setConnectionError(null);

      if (!wallet) {
        setConnectionError(
          "No wallet found. Please install a Solana wallet extension."
        );
        return;
      }

      await connect();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setConnectionError(
        error instanceof Error ? error.message : "Failed to connect wallet"
      );
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (wallet) {
        await disconnect();
      }
      setConnectionError(null);

      // Manually trigger reset in case event listener misses it
      setIsConnected(false);
      setIsWalletConnected(false);
      resetSwapOnDisconnect();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  // Add a new function to handle reconnection attempts
  const reconnectWallet = async () => {
    try {
      setConnecting(true);
      setConnectionError(null);

      // Try to disconnect first to clear any bad state
      try {
        if (wallet) {
          await disconnect();
        }
      } catch (disconnectError) {
        console.warn(
          "Error during disconnect before reconnect:",
          disconnectError
        );
        // Continue anyway to try connecting
      }

      // Small delay to ensure disconnection is processed
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Now try to connect
      if (!wallet) {
        setConnectionError(
          "No wallet found. Please install a Solana wallet extension."
        );
        return;
      }

      await connect();
      console.log("Wallet reconnection successful");
    } catch (error) {
      console.error("Error reconnecting wallet:", error);
      setConnectionError(
        error instanceof Error ? error.message : "Failed to reconnect wallet"
      );
    } finally {
      setConnecting(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      isConnected: mounted ? isConnected : false,
      publicKey: mounted && publicKey ? publicKey.toString() : null,
      connectWallet,
      disconnectWallet,
      reconnectWallet,
      connecting,
      connectionError,
    }),
    [mounted, isConnected, publicKey, connecting, connectionError]
  );

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Main wallet context provider with all required Solana components
export default function WalletContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Define network and endpoint
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network),
    [network]
  );

  // Set up supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextInnerProvider>{children}</WalletContextInnerProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
