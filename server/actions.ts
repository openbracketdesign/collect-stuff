"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "./db";
import { collection, item, itemImage } from "./schema";

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
    .returning({ id: item.id, name: item.name });
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

/** insert images to item_image table, assigning them to item by itemId */
export async function addImagesToItem(
  itemId: string,
  imageUrls: { url: string; fileKey: string }[] | undefined,
) {
  if (!itemId) {
    throw new Error("Item ID is required");
  }

  if (!imageUrls) {
    throw new Error("Image URLs are required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  await db.insert(itemImage).values(
    imageUrls.map((image) => ({
      itemId,
      url: image.url,
      fileKey: image.fileKey,
    })),
  );

  // not returning anything, just inserting the item image(s)
}
