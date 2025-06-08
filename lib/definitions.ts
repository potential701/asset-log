import { z } from "zod";
import { AssetCondition, AssetStatus, AssetType, Role } from "@/lib/enums";

export type GenericFormState =
  | {
      message?: string;
      success?: boolean;
    }
  | undefined;

export const SignupFormSchema = z.object({
  name: z.string().min(3, { message: "Must contain at least 3 characters" }).trim(),
  password: z
    .string()
    .min(8, { message: "Must contain at least 8 characters" })
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

export const LoginFormSchema = z.object({
  name: z.string().trim(),
  password: z.string().trim(),
});

export type LoginFormState =
  | {
      errors?: {
        name?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export const CreateAssetFormSchema = z.object({
  name: z.string().min(3, { message: "Must contain at least 3 characters" }).trim(),
  type: z.nativeEnum(AssetType),
  serial_number: z.string().min(6, { message: "Must contain at least 6 characters" }).trim(),
  status: z.nativeEnum(AssetStatus),
});

export type CreateAssetFormState =
  | {
      errors?: {
        name?: string[];
        type?: string[];
        serial_number?: string[];
        status?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export const ReturnAssetFormSchema = z
  .object({
    id: z.number(),
    return_condition: z.nativeEnum(AssetCondition),
    description: z.string().optional(),
  })
  .superRefine(({ return_condition, description }, refinementContext) => {
    if (return_condition != AssetCondition.GOOD && description === "") {
      return refinementContext.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required when condition is not good",
        path: ["description"],
      });
    }
  });

export type ReturnAssetFormState =
  | {
      errors?: {
        id?: string[];
        return_condition?: string[];
        description?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;
