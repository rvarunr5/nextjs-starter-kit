import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (!code) {
    console.error("Missing code");
    return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
  }
  try {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    console.log({ user, error, code }, "inside route");

    if (error || !user?.email) {
      console.error("OTP verification failed ", error);
      return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (error) {
    console.error("Callback error: ", error);
    return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
  }
}
