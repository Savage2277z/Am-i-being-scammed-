import { AnalysisResult } from "@/lib/types";
import VerdictBadge from "./VerdictBadge";
import ScoreCard from "./ScoreCard";
import RedFlagsList from "./RedFlagsList";
import SafeIndicatorsList from "./SafeIndicatorsList";
import ActionSteps from "./ActionSteps";
import ShareButton from "./ShareButton";

interface ResultCardProps {
  result: AnalysisResult;
  onCheckAnother: () => void;
}

const SCAM_TYPE_LABELS: Record<string, string> = {
  phishing: "Phishing",
  romance: "Romance Scam",
  investment: "Investment Fraud",
  job: "Job Scam",
  "advance fee": "Advance Fee Fraud",
  impersonation: "Impersonation",
  other: "Other",
};

export default function ResultCard({ result, onCheckAnother }: ResultCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8 space-y-8">
        <div className="text-center space-y-3">
          <VerdictBadge verdict={result.verdict} />
          <p className="text-gray-700 text-lg">{result.verdict_summary}</p>
        </div>

        <div className="flex justify-center">
          <ScoreCard score={result.scam_score} />
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>🔍</span> What&apos;s Actually Going On
          </h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {result.what_they_want}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Scam Type:</span>
          <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
            {SCAM_TYPE_LABELS[result.scam_type] || result.scam_type}
          </span>
        </div>

        <RedFlagsList flags={result.red_flags} />
        <SafeIndicatorsList indicators={result.safe_indicators} />
        <ActionSteps steps={result.what_to_do} />

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onCheckAnother}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1a1a2e] text-white rounded-lg font-medium hover:bg-[#2a2a4e] transition-colors text-sm"
          >
            Check Another Message
          </button>
          <ShareButton />
        </div>
      </div>
    </div>
  );
}
