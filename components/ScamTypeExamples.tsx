import { SCAM_TYPES } from "@/lib/constants";

export default function ScamTypeExamples() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-2">
          Scams We Detect
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Our AI is trained to identify these common scam patterns and more
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCAM_TYPES.map((scam) => (
            <div
              key={scam.title}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{scam.emoji}</div>
              <h3 className="font-semibold text-[#1a1a2e] mb-1">
                {scam.title}
              </h3>
              <p className="text-sm text-gray-500">{scam.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
