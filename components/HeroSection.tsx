"use client";

import { useRouter } from "next/navigation";
import AnalysisForm from "./AnalysisForm";

export default function HeroSection() {
  const router = useRouter();

  function handleSubmit(text: string) {
    const encoded = encodeURIComponent(text);
    router.push(`/check?text=${encoded}`);
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e] leading-tight">
          Is Someone Trying to Scam You?
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Paste any suspicious message, offer, or link. Get an instant AI
          verdict.
        </p>

        <div className="mt-8 text-left">
          <AnalysisForm onSubmit={handleSubmit} isLoading={false} />
        </div>

        <p className="mt-3 text-sm text-gray-400">
          No signup required — your first 3 checks are free
        </p>
      </div>
    </section>
  );
}
