"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PricingModal({ open, onClose }: PricingModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        if (res.status === 401) {
          window.location.href = "/auth/login";
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const modal = (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-8 animate-slide-up shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-[#1a1a2e]">
            You&apos;ve used all 3 free checks today
          </h2>
          <p className="text-gray-500 text-sm">
            Upgrade to Pro for unlimited scam checks, full history, and detailed
            reports.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-3 bg-[#1a1a2e] text-white rounded-lg font-semibold hover:bg-[#2a2a4e] transition-colors text-sm disabled:opacity-50"
            >
              {loading ? "Redirecting..." : "Upgrade to Pro — $5/month"}
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Come back tomorrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(modal, document.body);
  }
  return null;
}
