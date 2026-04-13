"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";
import ResultCard from "./ResultCard";

interface CheckRecord {
  id: string;
  input_text: string;
  result_json: Record<string, unknown>;
  scam_score: number;
  verdict: string;
  scam_type: string;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getScoreColor(score: number): string {
  if (score <= 20) return "bg-green-100 text-green-800";
  if (score <= 50) return "bg-yellow-100 text-yellow-800";
  if (score <= 80) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

export default function HistoryCard({ check }: { check: CheckRecord }) {
  const [expanded, setExpanded] = useState(false);
  const preview =
    check.input_text.length > 100
      ? check.input_text.slice(0, 100) + "..."
      : check.input_text;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 sm:p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-gray-400">
                {timeAgo(check.created_at)}
              </span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${getScoreColor(
                  check.scam_score
                )}`}
              >
                {check.scam_score}/100
              </span>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                {check.verdict}
              </span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{preview}</p>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4 sm:p-5">
          <ResultCard
            result={check.result_json as unknown as AnalysisResult}
            onCheckAnother={() => (window.location.href = "/check")}
          />
        </div>
      )}
    </div>
  );
}
