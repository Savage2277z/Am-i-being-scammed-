import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { analyzeMessage } from "@/lib/claude";
import { validateMessageText } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkUsage, incrementUsage, saveCheck } from "@/lib/usage";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Too many requests. Please wait a moment.",
          retryAfter: rateCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    let userId: string | undefined;
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() {},
          },
        }
      );
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // No auth — continue as anonymous
    }

    const usage = await checkUsage(userId, ip);
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: "Daily limit reached. Upgrade to Pro for unlimited checks.",
          upgrade: true,
          remaining: 0,
        },
        { status: 403 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { text } = body as { text: unknown };
    const validation = validateMessageText(text);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    let result;
    try {
      result = await analyzeMessage(text as string);
    } catch {
      try {
        result = await analyzeMessage(text as string);
      } catch (secondError) {
        const err = secondError as Error & { status?: number };

        if (
          err.message?.includes("timeout") ||
          err.message?.includes("Timeout")
        ) {
          return NextResponse.json(
            { error: "Analysis timed out. Please try again." },
            { status: 504 }
          );
        }

        return NextResponse.json(
          {
            error:
              "Analysis temporarily unavailable. Please try again later.",
          },
          { status: 502 }
        );
      }
    }

    await incrementUsage(userId, ip);

    if (userId) {
      await saveCheck(
        userId,
        text as string,
        result as unknown as Record<string, unknown>,
        ip
      );
    }

    return NextResponse.json({
      success: true,
      result,
      remaining: usage.remaining - 1,
      isPro: usage.isPro,
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
