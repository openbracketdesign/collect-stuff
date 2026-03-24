"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "./db";
import { collection } from "./schema";

function formText(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" ? value : null;
}

export async function createCollection(formData: FormData) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const name = formText(formData.get("name")) ?? "";
  const description = formText(formData.get("description"));

  return db
    .insert(collection)
    .values({
      name,
      description,
      userId: user.id,
    })
    .returning({ id: collection.id });
}

export async function editCollection(formData: FormData, collectionId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const name = formText(formData.get("name")) ?? "";
  const description = formText(formData.get("description"));

  return db
    .update(collection)
    .set({
      name,
      description,
      modified: new Date(),
    })
    .where(
      and(eq(collection.id, collectionId), eq(collection.userId, user.id)),
    )
    .returning({ name: collection.name });
}
