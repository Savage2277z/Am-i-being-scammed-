import { createServiceClient } from "@/lib/supabase/server";

const FREE_DAILY_LIMIT = 3;

export interface UsageResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  isPro: boolean;
}

async function resetIfNewDay(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  userId?: string,
  ipAddress?: string
) {
  const today = new Date().toISOString().split("T")[0];

  if (userId) {
    await supabase
      .from("profiles")
      .update({ checks_today: 0, last_check_reset: today })
      .eq("id", userId)
      .lt("last_check_reset", today);
  } else if (ipAddress) {
    await supabase
      .from("ip_checks")
      .update({ checks_today: 0, last_reset: today })
      .eq("ip_address", ipAddress)
      .lt("last_reset", today);
  }
}

export async function checkUsage(
  userId?: string,
  ipAddress?: string
): Promise<UsageResult> {
  const supabase = await createServiceClient();

  if (userId) {
    await resetIfNewDay(supabase, userId);
    const { data: profile } = await supabase
      .from("profiles")
      .select("tier, checks_today")
      .eq("id", userId)
      .single();

    if (profile?.tier === "pro") {
      return { allowed: true, remaining: Infinity, limit: Infinity, isPro: true };
    }

    const checksToday = profile?.checks_today ?? 0;
    const remaining = Math.max(0, FREE_DAILY_LIMIT - checksToday);

    return {
      allowed: remaining > 0,
      remaining,
      limit: FREE_DAILY_LIMIT,
      isPro: false,
    };
  }

  if (ipAddress) {
    await resetIfNewDay(supabase, undefined, ipAddress);
    const { data: ipRecord } = await supabase
      .from("ip_checks")
      .select("checks_today")
      .eq("ip_address", ipAddress)
      .single();

    const checksToday = ipRecord?.checks_today ?? 0;
    const remaining = Math.max(0, FREE_DAILY_LIMIT - checksToday);

    return {
      allowed: remaining > 0,
      remaining,
      limit: FREE_DAILY_LIMIT,
      isPro: false,
    };
  }

  return {
    allowed: true,
    remaining: FREE_DAILY_LIMIT,
    limit: FREE_DAILY_LIMIT,
    isPro: false,
  };
}

export async function incrementUsage(
  userId?: string,
  ipAddress?: string
): Promise<void> {
  const supabase = await createServiceClient();

  if (userId) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("checks_today")
      .eq("id", userId)
      .single();

    await supabase
      .from("profiles")
      .update({
        checks_today: (profile?.checks_today ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  } else if (ipAddress) {
    const { data: existing } = await supabase
      .from("ip_checks")
      .select("checks_today")
      .eq("ip_address", ipAddress)
      .single();

    if (existing) {
      await supabase
        .from("ip_checks")
        .update({ checks_today: existing.checks_today + 1 })
        .eq("ip_address", ipAddress);
    } else {
      await supabase
        .from("ip_checks")
        .insert({ ip_address: ipAddress, checks_today: 1 });
    }
  }
}

export async function saveCheck(
  userId: string,
  inputText: string,
  resultJson: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  const supabase = await createServiceClient();
  await supabase.from("checks").insert({
    user_id: userId,
    input_text: inputText,
    result_json: resultJson,
    scam_score: resultJson.scam_score as number,
    verdict: resultJson.verdict as string,
    scam_type: resultJson.scam_type as string,
    ip_address: ipAddress || null,
  });
}
