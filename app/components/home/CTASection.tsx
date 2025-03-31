import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-r from-indigo-600 to-purple-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to transform your trading experience?
        </h2>
        <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
          Join thousands of traders who&apos;ve already discovered the Swift
          Protocol advantage.
        </p>
        <div className="mt-10">
          <Link
            href="/swap"
            className="rounded-md bg-white px-8 py-4 text-lg font-medium text-indigo-600 shadow-lg hover:bg-neutral-50 transition duration-300 ease-in-out cta-button primary"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </section>
  );
}
