import PricingSection from "@/components/PricingSection";

const FAQ = [
  {
    q: "What counts as a check?",
    a: "Each time you submit a message for analysis, it counts as one check. Re-analyzing the same message counts as a new check.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your Pro subscription at any time. You'll retain access until the end of your billing period.",
  },
  {
    q: "Is my data private?",
    a: "Yes. We do not store the messages you submit for analysis. Your data is processed in real-time and not retained after delivering your results.",
  },
  {
    q: "How accurate is the analysis?",
    a: "Our AI achieves a 98% accuracy rate across known scam patterns. However, we recommend using our analysis as one tool in your decision-making — when in doubt, always err on the side of caution.",
  },
];

export default function PricingPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1a1a2e] text-center mb-2">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-500 text-center mb-10">
          Start free. Upgrade when you need more protection.
        </p>
      </div>

      <PricingSection fullPage />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {FAQ.map((item) => (
            <div key={item.q} className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-[#1a1a2e] mb-2">{item.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
