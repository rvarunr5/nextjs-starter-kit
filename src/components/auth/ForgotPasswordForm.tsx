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
import { CheckCircle2Icon, XCircleIcon } from "lucide-react";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaProps,
} from "@/lib/schema/forgotPasswordSchema";

export default function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<ForgotPasswordSchemaProps>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordSchemaProps) {
    try {
      setError("");
      setIsLoading(true);
      setMessage("");
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/update-password`,
        }
      );
      if (error) setError(error.message);
      else setMessage("Check your email for the password reset link");
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending verification link" : "Send verification link"}
        </Button>
        {error && (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <XCircleIcon className="h-4 w-4 text-red-500" />
              <p className="ml-1 text-sm font-medium text-red-500">{error}</p>
            </div>
          </div>
        )}
        {message && (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <CheckCircle2Icon className="h-4 w-4 text-green-500" />
              <p className="ml-1 text-sm font-medium text-green-500">
                {message}
              </p>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
