import { z } from "zod";
import { Role } from "@/lib/enums";

export const SignupFormSchema = z.object({
  name: z.string().min(3, { message: "Must contain at least 3 characters" }).trim(),
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Must contain at least one letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Must contain at least one special character" })
    .trim(),
  role: z.nativeEnum(Role),
});

export type SignupFormState =
  | {
      errors?: {
        name?: string[];
        password?: string[];
        role?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
