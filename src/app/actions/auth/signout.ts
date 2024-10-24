"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignInSchemaProps } from "@/lib/schema/signinSchema";

export async function signout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/auth/error");
  }

  revalidatePath("/", "layout");
  redirect("/signin");
}
