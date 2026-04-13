import HeroSection from "@/components/HeroSection";
import SocialProof from "@/components/SocialProof";
import ScamTypeExamples from "@/components/ScamTypeExamples";
import PricingSection from "@/components/PricingSection";

const STEPS = [
  {
    num: "1",
    title: "Paste",
    description: "Copy the suspicious message, email, or offer into the box.",
  },
  {
    num: "2",
    title: "AI Analyzes",
    description:
      "Our AI examines the message for scam patterns, red flags, and manipulation tactics.",
  },
  {
    num: "3",
    title: "Get Verdict",
    description:
      "Receive a clear risk score, detailed breakdown, and what to do next.",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <SocialProof />
      <ScamTypeExamples />

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-2">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Three simple steps to protect yourself
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="font-semibold text-[#1a1a2e] mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />
    </>
  );
}
