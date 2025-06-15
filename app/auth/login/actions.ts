"use server";

import { LoginFormSchema, LoginFormState } from "@/lib/definitions";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { verify } from "@/lib/password";
import { createSession } from "@/lib/session";

export async function login(state: LoginFormState, formData: FormData) {
  try {
    const validatedFields = LoginFormSchema.safeParse({
      name: formData.get("name"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const data = await db.select().from(user).where(eq(user.name, validatedFields.data.name));
    if (data.length === 0) throw new Error();
    const foundUser = data[0];

    const isPasswordCorrect = await verify(validatedFields.data.password, foundUser.password);
    if (!isPasswordCorrect) throw new Error();

    await createSession({
      id: foundUser.id,
      name: foundUser.name,
      role: foundUser.role,
    });

    await db
      .update(user)
      .set({ last_login_at: sql`now()` })
      .where(eq(user.id, foundUser.id));

    return {
      message: "Logged in successfully.",
      success: true,
    };
  } catch {
    return {
      message: "Invalid username or password. Please try again.",
    };
  }
}
