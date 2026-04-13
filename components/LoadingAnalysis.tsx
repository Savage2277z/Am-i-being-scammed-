export default function LoadingAnalysis() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="relative">
        <svg
          className="w-16 h-16 text-[#1a1a2e] animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">
          Analyzing for scam patterns
          <span className="inline-flex w-8">
            <span className="animate-dots">...</span>
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Our AI is examining the message for red flags
        </p>
      </div>
    </div>
  );
}
