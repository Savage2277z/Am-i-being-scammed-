"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import HistoryCard from "./HistoryCard";

interface CheckRecord {
  id: string;
  input_text: string;
  result_json: Record<string, unknown>;
  scam_score: number;
  verdict: string;
  scam_type: string;
  created_at: string;
}

const PAGE_SIZE = 20;

export default function HistoryList() {
  const [checks, setChecks] = useState<CheckRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createClient();

  const fetchChecks = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("checks")
        .select("id, input_text, result_json, scam_score, verdict, scam_type, created_at")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (!error && data) {
        setChecks(data);
        setHasMore(data.length === PAGE_SIZE);
      }
      setLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchChecks(page);
  }, [page, fetchChecks]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24" />
        ))}
      </div>
    );
  }

  if (checks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          No checks yet
        </h3>
        <p className="text-sm text-gray-500">
          Analyze your first message to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {checks.map((check) => (
        <HistoryCard key={check.id} check={check} />
      ))}

      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">Page {page + 1}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
