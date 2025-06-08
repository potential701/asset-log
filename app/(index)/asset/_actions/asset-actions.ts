"use server";

import {
  CreateAssetFormSchema,
  CreateAssetFormState,
  GenericFormState,
  ReturnAssetFormSchema,
  ReturnAssetFormState,
} from "@/lib/definitions";
import { asset, issue, log } from "@/db/schema";
import { db } from "@/db/drizzle";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { AssetCondition, AssetStatus } from "@/lib/enums";

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
    await db
      .update(asset)
      .set({ status: AssetStatus.BUSY, updated_at: sql`now()` })
      .where(eq(asset.id, newLog.asset_id));
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

export async function checkIn(state: ReturnAssetFormState, formData: FormData) {
  try {
    const validatedFields = ReturnAssetFormSchema.safeParse({
      id: +formData.get("id")!,
      return_condition: formData.get("return_condition"),
      description: formData.get("description"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        success: false,
      };
    }

    const logData = (await db.select().from(log).where(eq(log.id, validatedFields.data.id)))[0];

    await db
      .update(log)
      .set({ checked_in_at: sql`now()`, return_condition: validatedFields.data.return_condition as AssetCondition })
      .where(eq(log.id, validatedFields.data.id));

    await db
      .update(asset)
      .set({
        status:
          validatedFields.data.return_condition === AssetCondition.BROKEN
            ? AssetStatus.MAINTENANCE
            : AssetStatus.AVAILABLE,
        updated_at: sql`now()`,
      })
      .where(eq(asset.id, logData.asset_id));

    if (validatedFields.data.return_condition != AssetCondition.GOOD) {
      try {
        await db.insert(issue).values({
          asset_id: logData.asset_id,
          user_id: logData.user_id,
          description: validatedFields.data.description!,
          is_resolved: false,
        });
      } catch {
        return {
          message: "There was an error logging an asset issue, but an asset was returned successfully.",
          success: true,
        };
      }
    }

    revalidatePath("/asset");
    return {
      message: "Asset returned successfully. Thank you.",
      success: true,
    };
  } catch {
    return {
      message: "There was an error returning an asset. Please try again.",
      success: false,
    };
  }
}
