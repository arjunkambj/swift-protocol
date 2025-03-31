import Link from "next/link";

export default function HeroSection() {
  return (
    <header className="relative overflow-hidden h-[85vh]">
      {/* Dark gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/80 via-neutral-900/70 to-indigo-900/60 z-10" />

      {/* Background image with a more modern feel */}
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />

      {/* Animated gradient shapes in background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-4 sm:px-6 lg:px-8 z-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6">
              <span className="inline-block bg-indigo-600/10 backdrop-blur-sm text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full border border-indigo-500/20">
                Solana&apos;s Premier DEX Platform
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight">
              <span className="relative">
                Swift Protocol
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform skew-x-12"></span>
              </span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Elevate your trading experience with the fastest and most
              efficient decentralized exchange on Solana. Experience seamless
              swaps with minimal fees, optimized routing, and
              institutional-grade security.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <Link
                href="/swap"
                className="rounded-md bg-indigo-600 hover:bg-indigo-700 px-8 py-4 text-lg font-medium text-white shadow-lg transition duration-300 ease-in-out cta-button primary border border-indigo-500/30 backdrop-blur-sm"
              >
                Get Started
              </Link>
              <a
                href="https://github.com/yourusername/swift-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 text-lg font-medium text-white shadow-lg transition duration-300 ease-in-out cta-button secondary border border-white/10"
              >
                Explore Documentation
              </a>
            </div>

            {/* Key stats/highlights */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <p className="text-3xl font-bold text-white">0.3%</p>
                <p className="text-indigo-200 text-sm">Trading Fee</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <p className="text-3xl font-bold text-white">400ms</p>
                <p className="text-indigo-200 text-sm">Avg. Transaction Time</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <p className="text-3xl font-bold text-white">32+</p>
                <p className="text-indigo-200 text-sm">Tokens Supported</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
