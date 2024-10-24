"use client";
import { z } from "zod";

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must contain at least 8 character(s)"),
    passwordConfirmation: z
      .string()
      .min(8, "Password Confimation must contain at least 8 character(s)"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ["passwordConfirmation"],
  });

export type UpdatePasswordSchemaProps = z.infer<typeof updatePasswordSchema>;
