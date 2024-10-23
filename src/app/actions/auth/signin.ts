"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignInSchemaProps } from "@/lib/schema/signinSchema";

export async function signin(values: SignInSchemaProps) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: values.email,
    password: values.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: "Something went wrong", success: false };
  }

  // revalidatePath("/", "layout");
  return { success: true };
}
