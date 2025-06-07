"use server";

import { SignupFormState, SignupFormSchema } from "@/lib/definitions";
import { user } from "@/db/schema";
import { db } from "@/db/drizzle";
import { hash } from "@/lib/password";

export async function signup(state: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  validatedFields.data.password = await hash(validatedFields.data.password);

  const newUser: typeof user.$inferInsert = validatedFields.data;

  await db.insert(user).values(newUser);

  return {
    errors: undefined,
    message: "New user created successfully. You may now login to your account.",
    success: true,
  };
}
