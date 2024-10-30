"use server";

import { createClient } from "@/utils/supabase/server";
import { SignInSchemaProps } from "@/lib/schema/signinSchema";
import { AuthApiError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
        redirect(
          "/auth/signin?message=Please verify your email before signing in&requireEmailVerification=true"
        );
    redirect("/auth/signin?message=Couldn't authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
