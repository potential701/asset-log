"use server";

import { SignupFormState, SignupFormSchema } from "@/lib/definitions";
import { user } from "@/db/schema";
import { db } from "@/db/drizzle";
import { hash } from "@/lib/password";
import { eq } from "drizzle-orm";

export async function signup(state: SignupFormState, formData: FormData): Promise<SignupFormState> {
  try {
    const validatedFields = SignupFormSchema.safeParse({
      name: formData.get("name"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    validatedFields.data.password = await hash(validatedFields.data.password);

    const newUser: typeof user.$inferInsert = validatedFields.data;

    const data = await db.select().from(user).where(eq(user.name, validatedFields.data.name));
    if (data.length > 0) {
      return {
        message: "A user with this name already exists. Please enter a different name.",
      };
    }

    await db.insert(user).values(newUser);

    return {
      message: "New user created successfully. You may now login to your account.",
      success: true,
    };
  } catch {
    return {
      message: "Error creating your account. Please try again.",
    };
  }
}
