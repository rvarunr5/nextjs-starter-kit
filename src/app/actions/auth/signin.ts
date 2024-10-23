"use server";

import { createClient } from "@/utils/supabase/server";
import { SignInSchemaProps } from "@/lib/schema/signinSchema";
import { AuthApiError } from "@supabase/supabase-js";

type SignInResponse = {
  error?: string;
  requiresEmailVerification?: boolean;
  success?: boolean;
};

export async function signin(
  values: SignInSchemaProps
): Promise<SignInResponse> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    if (error instanceof AuthApiError)
      if (error.code === "email_not_confirmed")
        return {
          error: "Please verify your email before signing in",
          requiresEmailVerification: true,
        };
    return { error: error.message };
  }

  // revalidatePath("/", "layout");
  return { success: true };
}
