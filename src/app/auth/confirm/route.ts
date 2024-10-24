import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") ?? "/";

  if (!token_hash || !type) {
    console.error("Missing token or type");
    return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
  }
  try {
    const supabase = createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log({ user, error, type, token_hash }, "inside route");

    if (error || !user?.email) {
      console.error("OTP verification failed ", error);
      return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
    }
    // Only create user record for new signups
    if (type === "signup") {
      try {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
          },
        });
      } catch (dbError) {
        console.error("Database error: ", dbError);
        return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
      }
    }
    // if (type === "recovery") {
    //   console.log("inside recovery");
    //   const { error } = await supabase.auth.verifyOtp({
    //     token_hash,
    //     type,
    //   });

    //   if (error) {
    //     console.log("there is an error");
    //     return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
    //   }
    // }
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (error) {
    console.error("Callback error: ", error);
    return NextResponse.redirect(new URL("/auth/error", requestUrl.origin));
  }

  // redirect the user to an error page with some instructions
}
