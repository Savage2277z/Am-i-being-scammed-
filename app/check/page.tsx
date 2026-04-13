"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AnalysisForm from "@/components/AnalysisForm";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultCard from "@/components/ResultCard";
import ErrorDisplay from "@/components/ErrorDisplay";
import { AnalysisResult, ApiResponse, AnalysisError } from "@/lib/types";

function CheckPageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedText, setSubmittedText] = useState<string>("");

  useEffect(() => {
    const textParam = searchParams.get("text");
    if (textParam && !result && !isLoading) {
      handleAnalyze(textParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAnalyze(text: string) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSubmittedText(text);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        const errData = data as AnalysisError;
        setError(errData.error || "Something went wrong.");
        return;
      }

      if ("success" in data && data.success) {
        setResult(data.result);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCheckAnother() {
    setResult(null);
    setError(null);
    setSubmittedText("");
    window.history.replaceState(null, "", "/check");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
        Check a Message
      </h1>
      <p className="text-gray-500 mb-8">
        Paste any suspicious message below for an instant AI analysis.
      </p>

      {!result && !isLoading && (
        <AnalysisForm onSubmit={handleAnalyze} isLoading={isLoading} />
      )}

      {isLoading && <LoadingAnalysis />}

      {error && !isLoading && (
        <div className="mt-6">
          <ErrorDisplay
            message={error}
            onRetry={submittedText ? () => handleAnalyze(submittedText) : undefined}
          />
        </div>
      )}

      {result && !isLoading && (
        <div className="mt-6">
          <ResultCard result={result} onCheckAnother={handleCheckAnother} />
        </div>
      )}
    </div>
  );
}

export default function CheckPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      }
    >
      <CheckPageContent />
    </Suspense>
  );
}
