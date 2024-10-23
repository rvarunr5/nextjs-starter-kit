"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignupSchemaProps } from "@/lib/schema/signupSchema";
import { NextResponse } from "next/server";

export async function signup(values: SignupSchemaProps) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const signUpData = {
    email: values.email,
    password: values.password,
  };

  console.log(signUpData);

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp(signUpData);

  if (error) {
    // redirect("/error");
    return { error: "Something went wrong", success: false };
  }
  console.log({ user });
  if (!user?.confirmed_at) {
    return { success: true, requiresEmailVerification: true };
  }
  // revalidatePath("/", "layout");
  return { success: true, user };
}
