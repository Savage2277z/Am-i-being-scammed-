import { NextRequest, NextResponse } from "next/server";
import { analyzeMessage } from "@/lib/claude";
import { validateMessageText } from "@/lib/validation";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_CLEANUP_INTERVAL_MS } from "@/lib/constants";

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

let lastCleanup = Date.now();

function cleanupRateLimitMap() {
  const now = Date.now();
  if (now - lastCleanup < RATE_LIMIT_CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  Array.from(rateLimitMap.entries()).forEach(([ip, entry]) => {
    entry.timestamps = entry.timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS
    );
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  });
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  cleanupRateLimitMap();

  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { timestamps: [] };

  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (entry.timestamps.length >= RATE_LIMIT_MAX) {
    const oldest = entry.timestamps[0];
    const retryAfter = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.timestamps.push(now);
  rateLimitMap.set(ip, entry);
  return { allowed: true };
}

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

        if (err.message?.includes("timeout") || err.message?.includes("Timeout")) {
          return NextResponse.json(
            { error: "Analysis timed out. Please try again." },
            { status: 504 }
          );
        }

        return NextResponse.json(
          { error: "Analysis temporarily unavailable. Please try again later." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
