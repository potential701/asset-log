"use server";

import { CreateAssetFormSchema, CreateAssetFormState, GenericFormState } from "@/lib/definitions";
import { asset, log } from "@/db/schema";
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

export async function checkOut(state: GenericFormState, formData: FormData) {
  try {
    const newLog: typeof log.$inferInsert = {
      asset_id: formData.get("asset_id") as unknown as number,
      user_id: formData.get("user_id") as unknown as number,
    };

    await db.insert(log).values(newLog);
    revalidatePath("/asset");
    return {
      message: "Asset checked out successfully. Please check it back in when returning.",
      success: true,
    };
  } catch {
    return {
      message: "There was an error checking out an asset. Please try again.",
      success: false,
    };
  }
}
