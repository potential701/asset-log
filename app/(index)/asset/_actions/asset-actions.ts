"use server";

import { CreateAssetFormSchema, CreateAssetFormState } from "@/lib/definitions";
import { asset } from "@/db/schema";
import { db } from "@/db/drizzle";
import { revalidatePath } from "next/cache";

export async function create(state: CreateAssetFormState, formData: FormData) {
  try {
    const validatedFields = CreateAssetFormSchema.safeParse({
      name: formData.get("name"),
      type: formData.get("type"),
      serial_number: formData.get("serial_number"),
      status: formData.get("status"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const newAsset: typeof asset.$inferInsert = validatedFields.data;

    await db.insert(asset).values(newAsset);

    revalidatePath("/asset");
    return {
      errors: undefined,
      message: "New asset created successfully. You can now view it in assets.",
      success: true,
    };
  } catch {
    return {
      errors: undefined,
      message: "There was an error adding a new asset. Please ensure it does not exist already.",
      success: false,
    };
  }
}
