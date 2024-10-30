"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signupSchema, SignupSchemaProps } from "@/lib/schema/signupSchema";
import { signup } from "@/app/actions/auth/signup";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import {
  updatePasswordSchema,
  UpdatePasswordSchemaProps,
} from "@/lib/schema/updatePasswordSchema";
import ButtonLoading from "../loading/ButtonLoading";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<UpdatePasswordSchemaProps>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(values: UpdatePasswordSchemaProps) {
    try {
      setError("");
      setIsLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setError("An unexpected event occured");
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirmation</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonLoading
          type="submit"
          className="w-full"
          isLoading={isLoading}
          loadingButtonText="Updating Password..."
          buttonText="Update Password"
        />
      </form>
    </Form>
  );
}
