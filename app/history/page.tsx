"use client";

import AuthGuard from "@/components/AuthGuard";
import HistoryList from "@/components/HistoryList";

export default function HistoryPage() {
  return (
    <AuthGuard requirePro>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
          Check History
        </h1>
        <p className="text-gray-500 mb-8">
          View all your past scam analyses.
        </p>
        <HistoryList />
      </div>
    </AuthGuard>
  );
}
