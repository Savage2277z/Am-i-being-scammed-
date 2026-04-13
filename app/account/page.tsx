"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProBadge from "@/components/ProBadge";

interface Profile {
  email: string;
  display_name: string;
  tier: string;
  checks_today: number;
  stripe_customer_id: string | null;
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("email, display_name, tier, checks_today, stripe_customer_id")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
      setLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // ignore
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleUpgrade() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isPro = profile.tier === "pro";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-[#1a1a2e] mb-8">Account</h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#1a1a2e] flex items-center justify-center text-xl font-bold text-white">
              {(profile.display_name || profile.email || "U")[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {profile.display_name || "User"}
                </h2>
                {isPro && <ProBadge />}
              </div>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Subscription
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {isPro ? "Pro Plan" : "Free Plan"}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {isPro ? "$5/month" : "$0/month"}
                  </p>
                </div>
                {isPro ? (
                  <button
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {portalLoading ? "Loading..." : "Manage Subscription"}
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    className="px-4 py-2 text-sm font-medium bg-[#1a1a2e] text-white rounded-lg hover:bg-[#2a2a4e] transition-colors"
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              Usage Today
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Checks today:{" "}
                  <span className="font-semibold">
                    {isPro
                      ? `${profile.checks_today} (Unlimited)`
                      : `${profile.checks_today}/3`}
                  </span>
                </p>
              </div>
              {!isPro && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1a1a2e] h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          (profile.checks_today / 3) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
