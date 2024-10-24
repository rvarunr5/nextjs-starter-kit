"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignupSchemaProps } from "@/lib/schema/signupSchema";
import { NextResponse } from "next/server";

export async function signup(values: SignupSchemaProps) {
  const supabase = createClient();

  const signUpData = {
    email: values.email,
    password: values.password,
  };

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp(signUpData);

  if (error) {
    redirect(`/signup?message=${error.message}`);
  }

  if (!user?.confirmed_at) {
    redirect(
      "/signup?message=Please verify your email&requireEmailVerification=true"
    );
  }
  revalidatePath("/", "layout");
  redirect("/dashboard");
}
