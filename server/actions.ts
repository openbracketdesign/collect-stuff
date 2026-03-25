"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

import { db } from "./db";
import { collection, item, itemImage } from "./schema";

const utapi = new UTApi({});

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

export async function editItem(
  formData: FormData,
  itemId: string,
  deletedImageFileKeys: string[],
) {
  if (!itemId) {
    throw new Error("Item ID is required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const collectionId = formText(formData.get("collectionId")) ?? "";
  const name = formText(formData.get("name")) ?? "";
  const description = formText(formData.get("description"));

  const itemUpdate = () =>
    db
      .update(item)
      .set({
        name,
        collectionId,
        description,
        modified: new Date(),
      })
      .where(and(eq(item.id, itemId), eq(item.userId, user.id)))
      .returning({ name: item.name, collectionId: item.collectionId });

  // db.batch runs statements in one Neon transaction.
  if (deletedImageFileKeys.length > 0) {
    const [, updatedRows] = await db.batch([
      db
        .delete(itemImage)
        .where(
          and(
            eq(itemImage.itemId, itemId),
            inArray(itemImage.fileKey, deletedImageFileKeys),
          ),
        ),
      itemUpdate(),
    ]);

    return updatedRows;
  }

  // if no images are deleted, just update the item
  return itemUpdate();
}

/** insert images to item_image table, assigning them to item by itemId */
export async function insertItemImages(
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

/** Remove files from UploadThing storage (server-only; call from client via server action). */
export async function deleteRemovedImages(fileKeys: string[]) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  if (fileKeys.length === 0) {
    return;
  }

  await utapi.deleteFiles(fileKeys);
}
