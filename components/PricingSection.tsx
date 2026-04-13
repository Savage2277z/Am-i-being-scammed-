import Link from "next/link";

interface PricingSectionProps {
  fullPage?: boolean;
}

export default function PricingSection({ fullPage }: PricingSectionProps) {
  return (
    <section className={fullPage ? "" : "py-16"}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!fullPage && (
          <>
            <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-2">
              Simple Pricing
            </h2>
            <p className="text-gray-500 text-center mb-10">
              Start free. Upgrade when you need more.
            </p>
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
            <h3 className="text-lg font-bold text-[#1a1a2e]">Free</h3>
            <p className="text-3xl font-bold text-[#1a1a2e] mt-2">
              $0
              <span className="text-sm font-normal text-gray-500">/month</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> 3 checks per day
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Basic analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> No account needed
              </li>
            </ul>
            <Link
              href="/check"
              className="mt-6 block text-center w-full py-2.5 border border-[#1a1a2e] text-[#1a1a2e] rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Get Started Free
            </Link>
          </div>

          <div className="bg-white border-2 border-[#1a1a2e] rounded-xl p-6 sm:p-8 relative">
            <span className="absolute -top-3 left-6 bg-[#1a1a2e] text-white text-xs font-bold px-3 py-1 rounded-full">
              POPULAR
            </span>
            <h3 className="text-lg font-bold text-[#1a1a2e]">Pro</h3>
            <p className="text-3xl font-bold text-[#1a1a2e] mt-2">
              $5
              <span className="text-sm font-normal text-gray-500">/month</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Unlimited checks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Full history
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Priority analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span> Detailed reports
              </li>
            </ul>
            <Link
              href="/pricing"
              className="mt-6 block text-center w-full py-2.5 bg-[#1a1a2e] text-white rounded-lg font-medium hover:bg-[#2a2a4e] transition-colors text-sm"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
