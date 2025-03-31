import Link from "next/link";
import Image from "next/image";

type TokenBadgeProps = {
  name: string;
  symbol: string;
  logoSrc: string;
  popular?: boolean;
};

function TokenBadge({
  name,
  symbol,
  logoSrc,
  popular = false,
}: TokenBadgeProps) {
  return (
    <div className="flex flex-col items-center p-6 bg-neutral-900 rounded-xl token-badge relative hover:shadow-md transition-all duration-300 border border-neutral-800">
      {popular && (
        <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          Popular
        </span>
      )}
      <div className="h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center mb-3 shadow-lg overflow-hidden">
        <Image
          src={logoSrc}
          alt={`${symbol} logo`}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <p className="font-medium text-lg text-white">{symbol}</p>
      <p className="text-sm text-neutral-400">{name}</p>
    </div>
  );
}

function MiniTokenBadge({
  symbol,
  logoSrc,
}: {
  symbol: string;
  logoSrc: string;
}) {
  return (
    <div className="flex items-center justify-center p-2 bg-neutral-800 rounded-lg shadow-sm border border-neutral-700 hover:border-indigo-800 transition-all duration-300">
      <div className="w-6 h-6 mr-2 overflow-hidden">
        <Image
          src={logoSrc}
          alt={`${symbol} logo`}
          width={24}
          height={24}
          className="object-contain"
        />
      </div>
      <p className="font-medium text-sm text-white">{symbol}</p>
    </div>
  );
}

export default function TokensSection() {
  return (
    <section className="py-20 sm:py-28 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-900/30 text-indigo-400 text-sm font-medium mb-4">
            Supported Assets
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Trade Your Favorite Assets
          </h2>
          <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">
            Access a wide range of top-tier tokens on the Solana ecosystem, with
            more added regularly.
          </p>
        </div>

        <div className="relative">
          {/* Main tokens display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 lg:gap-10">
            <TokenBadge
              name="Solana"
              symbol="SOL"
              logoSrc="/tokens/solana.png"
              popular={true}
            />
            <TokenBadge
              name="USD Coin"
              symbol="USDC"
              logoSrc="/tokens/usdc.png"
              popular={true}
            />
            <TokenBadge
              name="Bonk"
              symbol="BONK"
              logoSrc="/tokens/bonk.png"
              popular={true}
            />
            <TokenBadge
              name="Raydium"
              symbol="RAY"
              logoSrc="/tokens/raydium.png"
            />
            <TokenBadge name="Serum" symbol="SRM" logoSrc="/tokens/serum.png" />
            <TokenBadge
              name="Marinade"
              symbol="MNDE"
              logoSrc="/tokens/marinade.png"
            />
          </div>

          {/* More tokens preview */}
          <div className="mt-16 bg-neutral-900 rounded-2xl p-8 border border-neutral-800">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              And Many More
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-4">
              <MiniTokenBadge symbol="ORCA" logoSrc="/tokens/orca.png" />
              <MiniTokenBadge symbol="USDT" logoSrc="/tokens/usdt.png" />
              <MiniTokenBadge symbol="FIDA" logoSrc="/tokens/fida.png" />
              <MiniTokenBadge symbol="MSOL" logoSrc="/tokens/msol.png" />
              <MiniTokenBadge symbol="STEP" logoSrc="/tokens/step.png" />
              <MiniTokenBadge symbol="SAMO" logoSrc="/tokens/samo.png" />
              <MiniTokenBadge symbol="ATLAS" logoSrc="/tokens/atlas.png" />
              <MiniTokenBadge symbol="DUST" logoSrc="/tokens/dust.png" />
            </div>
            <div className="text-center mt-8">
              <Link
                href="/swap"
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center gap-2 transition"
              >
                Start Trading Now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
