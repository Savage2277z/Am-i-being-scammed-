"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#1a1a2e] text-white" aria-label="Main navigation">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Am I Being Scammed?
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/check"
              className="hover:text-gray-300 transition-colors"
            >
              Check a Message
            </Link>
            <Link
              href="/pricing"
              className="hover:text-gray-300 transition-colors"
            >
              Pricing
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 text-sm">
            <Link
              href="/check"
              className="block py-2 hover:text-gray-300"
              onClick={() => setMobileOpen(false)}
            >
              Check a Message
            </Link>
            <Link
              href="/pricing"
              className="block py-2 hover:text-gray-300"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
