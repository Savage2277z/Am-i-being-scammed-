"use client";

import { useState } from "react";
import { MAX_CHARS, MIN_CHARS } from "@/lib/constants";

interface AnalysisFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export default function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [text, setText] = useState("");

  const charCount = text.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const isTooShort = charCount > 0 && charCount < MIN_CHARS;
  const isTooLong = charCount > MAX_CHARS;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid && !isLoading) {
      onSubmit(text.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the suspicious message here..."
          className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a2e] focus:border-transparent resize-y text-base"
          aria-label="Suspicious message text"
          disabled={isLoading}
        />
        <div
          className={`text-right text-sm mt-1 ${
            isTooShort || isTooLong ? "text-red-600" : "text-gray-500"
          }`}
        >
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
          {isTooShort && (
            <span className="ml-2">
              (minimum {MIN_CHARS})
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="mt-4 w-full sm:w-auto px-8 py-3 bg-[#1a1a2e] text-white font-semibold rounded-lg hover:bg-[#2a2a4e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        {isLoading ? "Analyzing..." : "Analyze for Scams"}
      </button>
    </form>
  );
}
