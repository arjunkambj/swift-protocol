"use client";
import Navbar from "@/app/components/home/Navbar";
import HeroSection from "@/app/components/home/HeroSection";
import FeaturesSection from "@/app/components/home/FeaturesSection";
import HowItWorksSection from "@/app/components/home/HowItWorksSection";
import TokensSection from "@/app/components/home/TokensSection";
import CTASection from "@/app/components/home/CTASection";
import Footer from "@/app/components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-inter">
      <Navbar />
      <HeroSection />
      <main className="dark:bg-neutral-950">
        <FeaturesSection />
        <HowItWorksSection />
        <TokensSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
