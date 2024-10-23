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

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const form = useForm<SignupSchemaProps>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  async function onSubmit(values: SignupSchemaProps) {
    try {
      const response = await signup(values);

      if (response.error) {
        setError(response.error);
      }
      if (response.success) {
        if (response.requiresEmailVerification) router.push("/verify-email");
        else router.push("/dashboard");
      }
    } catch (e) {
      console.error("Signup error: ", e);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="test@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full">
          Sign up
        </Button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </Form>
  );
}
