"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AnalysisForm from "@/components/AnalysisForm";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultCard from "@/components/ResultCard";
import ErrorDisplay from "@/components/ErrorDisplay";
import PricingModal from "@/components/PricingModal";
import { AnalysisResult, AnalysisError } from "@/lib/types";

function CheckPageContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedText, setSubmittedText] = useState<string>("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);

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

      const data = await response.json();

      if (response.status === 403 && data.upgrade) {
        setShowPaywall(true);
        setRemaining(0);
        return;
      }

      if (!response.ok) {
        const errData = data as AnalysisError;
        setError(errData.error || "Something went wrong.");
        return;
      }

      if ("success" in data && data.success) {
        setResult(data.result);
        if (data.remaining !== undefined) setRemaining(data.remaining);
        if (data.isPro !== undefined) setIsPro(data.isPro);
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

      {remaining !== null && !isPro && remaining >= 0 && !result && !isLoading && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-gray-500">
            {remaining} of 3 free checks remaining today
          </span>
          {remaining === 0 && (
            <button
              onClick={() => setShowPaywall(true)}
              className="text-[#1a1a2e] font-medium hover:underline"
            >
              Upgrade
            </button>
          )}
        </div>
      )}

      {isPro && !result && !isLoading && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-white uppercase tracking-wider">
            Pro
          </span>
          <span className="text-gray-500">Unlimited checks</span>
        </div>
      )}

      {!result && !isLoading && (
        <AnalysisForm
          onSubmit={handleAnalyze}
          isLoading={isLoading}
        />
      )}

      {isLoading && <LoadingAnalysis />}

      {error && !isLoading && (
        <div className="mt-6">
          <ErrorDisplay
            message={error}
            onRetry={
              submittedText ? () => handleAnalyze(submittedText) : undefined
            }
          />
        </div>
      )}

      {result && !isLoading && (
        <div className="mt-6">
          <ResultCard result={result} onCheckAnother={handleCheckAnother} />
        </div>
      )}

      <PricingModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
      />
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
