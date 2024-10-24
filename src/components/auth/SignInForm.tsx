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
import { signin } from "@/app/actions/auth/signin";
import { signinSchema, SignInSchemaProps } from "@/lib/schema/signinSchema";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { XCircleIcon } from "lucide-react";

export default function SignInForm() {
  const [error, setError] = useState("");
  const [resending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<SignInSchemaProps>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleResendVerification() {
    try {
      setIsResending(true);
      const email = form.getValues("email");
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (error) setError(error.message || "");
      else {
        setError("");
        router.push("/verify-email");
      }
    } catch (e) {
      setError("Failed to resend verification email");
      setIsLoading(false);
    }
  }

  async function onSubmit(values: SignInSchemaProps) {
    try {
      setError("");
      setIsLoading(true);
      const response = await signin(values);

      if (response.success) {
        router.push("/dashboard");
      }
      if (response.error) {
        setError(response.error || "");
        return;
      }
    } catch (e) {
      setError("An unexpected error occurred");
      setIsLoading(false);
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
        <Link href="/forgot-password" className="text-sm text-blue-500 block">
          Forgot password?
        </Link>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </div>
        {error && (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <XCircleIcon className="h-4 w-4 text-red-500" />
              <p className="ml-1 text-sm font-medium text-red-500">{error}</p>
            </div>
            {error.includes("verify") && (
              <p
                className="underline text-sm text-blue-500 mt-2 cursor-pointer"
                onClick={() => handleResendVerification()}
              >
                {resending ? "Resending..." : "Resend verification email"}
              </p>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
