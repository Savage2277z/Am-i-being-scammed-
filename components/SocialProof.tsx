import { SOCIAL_PROOF_STATS } from "@/lib/constants";

export default function SocialProof() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {SOCIAL_PROOF_STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-white rounded-lg p-6 border border-gray-200"
            >
              <p className="text-3xl font-bold text-[#1a1a2e]">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
