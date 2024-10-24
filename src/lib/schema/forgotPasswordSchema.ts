"use client";
import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type ForgotPasswordSchemaProps = z.infer<typeof forgotPasswordSchema>;
