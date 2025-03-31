"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useWalletContext } from "@/app/context/WalletContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isConnected, disconnectWallet } = useWalletContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This ensures wallet state is only used after component is mounted on client
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleAppButtonClick = () => {
    if (isConnected) {
      disconnectWallet();
    }
  };

  return (
    <nav
      className={`bg-black/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50 sticky-header ${
        scrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-indigo-600 dark:text-indigo-500 font-bold text-xl tracking-wider">
              SWIFT PROTOCOL
            </span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-neutral-300 hover:text-indigo-400 transition nav-link relative group"
            >
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/swap"
              className="text-neutral-300 hover:text-indigo-400 transition nav-link relative group"
            >
              <span>Swap</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            <Link
              href="/docs"
              className="text-neutral-300 hover:text-indigo-400 transition nav-link relative group"
            >
              <span>Docs</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all duration-200 group-hover:w-full"></span>
            </Link>
            {mounted && isConnected ? (
              <button
                onClick={handleAppButtonClick}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition cta-button primary"
              >
                Disconnect
              </button>
            ) : (
              <Link
                href="/swap"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition cta-button primary"
              >
                Launch App
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-neutral-300 hover:text-indigo-400"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-neutral-800 hover:text-indigo-400"
          >
            Home
          </Link>
          <Link
            href="/swap"
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-neutral-800 hover:text-indigo-400"
          >
            Swap
          </Link>
          <Link
            href="/docs"
            className="block px-3 py-2 rounded-md text-base font-medium text-neutral-300 hover:bg-neutral-800 hover:text-indigo-400"
          >
            Docs
          </Link>
          {mounted && isConnected ? (
            <button
              onClick={handleAppButtonClick}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Disconnect
            </button>
          ) : (
            <Link
              href="/swap"
              className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Launch App
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
