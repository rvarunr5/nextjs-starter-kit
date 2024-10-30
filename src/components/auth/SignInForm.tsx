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
import ButtonLoading from "../loading/ButtonLoading";

export default function SignInForm({
  searchParams,
}: {
  searchParams: { message?: string; requireEmailVerification?: boolean };
}) {
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

  const clearMessage = () => {
    if (searchParams.message) {
      router.replace("/auth/signin");
    }
  };
  async function onSubmit(values: SignInSchemaProps) {
    try {
      setIsLoading(true);
      clearMessage();
      await signin(values);
    } catch (e) {
      console.error("Something went wrong");
    } finally {
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
        <Link
          href="/auth/forgot-password"
          className="text-sm text-blue-500 block"
        >
          Forgot password?
        </Link>
        <ButtonLoading
          type="submit"
          className="w-full"
          isLoading={isLoading}
          loadingButtonText="Signing in..."
          buttonText="Sign in"
        />
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-500">
            Sign up
          </Link>
        </div>
        {searchParams.message && (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <XCircleIcon className="h-4 w-4 text-red-500" />
              <p className="ml-1 text-sm font-medium text-red-500">
                {searchParams.message}
              </p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
