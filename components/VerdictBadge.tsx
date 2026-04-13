interface VerdictBadgeProps {
  verdict: "SAFE" | "SUSPICIOUS" | "LIKELY SCAM" | "DEFINITE SCAM";
}

const VERDICT_STYLES: Record<string, string> = {
  SAFE: "bg-green-100 text-green-800",
  SUSPICIOUS: "bg-yellow-100 text-yellow-800",
  "LIKELY SCAM": "bg-orange-100 text-white bg-[#f59e0b]",
  "DEFINITE SCAM": "bg-red-100 text-white bg-[#dc2626]",
};

export default function VerdictBadge({ verdict }: VerdictBadgeProps) {
  return (
    <span
      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
        VERDICT_STYLES[verdict] || "bg-gray-100 text-gray-800"
      }`}
    >
      {verdict}
    </span>
  );
}
