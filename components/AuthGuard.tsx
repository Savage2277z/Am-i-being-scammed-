"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
  requirePro?: boolean;
}

export default function AuthGuard({ children, requirePro }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      if (requirePro) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("tier")
          .eq("id", user.id)
          .single();

        if (profile?.tier !== "pro") {
          setNeedsUpgrade(true);
          setLoading(false);
          return;
        }
      }

      setAuthorized(true);
      setLoading(false);
    }
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (needsUpgrade) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">
            Pro Feature
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Check history is available for Pro subscribers. Upgrade to access
            your full analysis history.
          </p>
          <button
            onClick={async () => {
              const res = await fetch("/api/stripe/checkout", {
                method: "POST",
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            className="px-6 py-2.5 bg-[#1a1a2e] text-white rounded-lg font-medium hover:bg-[#2a2a4e] transition-colors text-sm"
          >
            Upgrade to Pro — $5/month
          </button>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
