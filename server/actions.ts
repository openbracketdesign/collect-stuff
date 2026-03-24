"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "./db";
import { collection, item } from "./schema";

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
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

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
    .where(and(eq(collection.id, collectionId), eq(collection.userId, user.id)))
    .returning({ name: collection.name });
}

export async function createItem(formData: FormData, collectionId: string) {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const name = formText(formData.get("name")) ?? "";
  const description = formText(formData.get("description"));

  return db
    .insert(item)
    .values({
      name,
      description,
      collectionId,
      userId: user.id,
    })
    .returning({ id: item.id });
}

export async function editItem(formData: FormData, itemId: string) {
  if (!itemId) {
    throw new Error("Item ID is required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const name = formText(formData.get("name")) ?? "";
  const description = formText(formData.get("description"));

  return db
    .update(item)
    .set({
      name,
      description,
      modified: new Date(),
    })
    .where(and(eq(item.id, itemId), eq(item.userId, user.id)))
    .returning({ name: item.name });
}
