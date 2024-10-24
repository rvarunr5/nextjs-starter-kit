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
import { XCircleIcon } from "lucide-react";
import ButtonLoading from "../loading/ButtonLoading";

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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
      setError("");
      setIsLoading(true);
      const response = await signup(values);

      if (response.error) {
        setError(response.error);
        return;
      }
      if (response.success) {
        if (response.requiresEmailVerification) {
          router.push("/verify-email");
          return;
        }
        router.push("/dashboard");
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
          loadingButtonText="Signing up..."
          buttonText="Sign up"
        />
        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/signin" className="underline text-blue-500">
            Sign in
          </Link>
        </div>
        {error && (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <XCircleIcon className="h-4 w-4 text-red-500" />
              <p className="ml-1 text-sm font-medium text-red-500">{error}</p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
