import React from "react";

type StepCardProps = {
  number: string;
  title: string;
  description: string;
};

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="relative z-10 bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-6 step-card border border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-600 text-white text-lg font-bold rounded-full w-10 h-10 flex items-center justify-center mr-3">
          {number}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-neutral-300">{description}</p>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Simple, Fast, Effective
          </h2>
          <p className="mt-4 text-lg text-neutral-300 max-w-3xl mx-auto">
            Trading shouldn&apos;t be complicated. We&apos;ve distilled the
            process down to three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line between steps */}
          <div className="hidden md:block absolute top-24 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-indigo-600/30 z-0"></div>

          <StepCard
            number="01"
            title="Connect Your Wallet"
            description="Securely link your Solana wallet in one click. Compatible with Phantom, Solflare, and other popular wallets."
          />
          <StepCard
            number="02"
            title="Choose Your Trade"
            description="Select from dozens of tokens and set your desired amount with our intuitive interface."
          />
          <StepCard
            number="03"
            title="Confirm & Complete"
            description="Review your transaction details and execute with confidence, knowing you're getting the best rate possible."
          />
        </div>
      </div>
    </section>
  );
}
