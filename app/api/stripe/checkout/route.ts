import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, tier")
      .eq("id", user.id)
      .single();

    if (profile?.tier === "pro") {
      return NextResponse.json(
        { error: "You are already a Pro subscriber." },
        { status: 400 }
      );
    }

    const url = await createCheckoutSession(
      user.id,
      user.email!,
      profile?.stripe_customer_id
    );

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
