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
import { CheckCircle2, XCircleIcon } from "lucide-react";
import ButtonLoading from "../loading/ButtonLoading";

export default function SignUpForm({
  searchParams,
}: {
  searchParams: { message?: string; requireEmailVerification?: boolean };
}) {
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
      setIsLoading(true);
      await signup(values);
      form.reset();
    } catch (e) {
      console.error("Something went wrong", e);
      setIsLoading(false);
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
          <Link href="/auth/signin" className="text-blue-500">
            Sign in
          </Link>
        </div>
        {searchParams.message && (
          <div className="text-center">
            {searchParams.message.includes("verify") ? (
              <div className="flex justify-center items-normal">
                <CheckCircle2 className="h-4 w-4 text-green-700 mt-0.5" />
                <p className="text-green-700 text-sm ml-1">
                  {searchParams.message}
                </p>
              </div>
            ) : (
              <div className="flex justify-center items-normal">
                <XCircleIcon className="h-5 w-5 text-red-500 mt-0" />
                <p className="ml-1 text-red-500 text-sm">
                  {searchParams.message}
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
