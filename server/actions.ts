"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

import { db } from "./db";
import {
  collection,
  collectionStar,
  item,
  itemImage,
  itemStar,
} from "./schema";

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

export async function starCollection(collectionId: string, isStarred: boolean) {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  if (isStarred) {
    await db.insert(collectionStar).values({ collectionId, userId: user.id });
  } else {
    await db
      .delete(collectionStar)
      .where(
        and(
          eq(collectionStar.collectionId, collectionId),
          eq(collectionStar.userId, user.id),
        ),
      );
  }
}

export async function createItem(formData: FormData, collectionId: string) {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const [ownedCollection] = await db
    .select({ id: collection.id })
    .from(collection)
    .where(and(eq(collection.id, collectionId), eq(collection.userId, user.id)))
    .limit(1);

  if (!ownedCollection) {
    throw new Error("Collection not found");
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

  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const [ownedItem] = await db
    .select({ id: item.id })
    .from(item)
    .where(and(eq(item.id, itemId), eq(item.userId, user.id)))
    .limit(1);

  if (!ownedItem) {
    return [];
  }

  const [targetCollection] = await db
    .select({ id: collection.id })
    .from(collection)
    .where(and(eq(collection.id, collectionId), eq(collection.userId, user.id)))
    .limit(1);

  if (!targetCollection) {
    throw new Error("Collection not found");
  }

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

export async function starItem(itemId: string, isStarred: boolean) {
  if (!itemId) {
    throw new Error("Item ID is required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  if (isStarred) {
    await db.insert(itemStar).values({ itemId, userId: user.id });
  } else {
    await db
      .delete(itemStar)
      .where(and(eq(itemStar.itemId, itemId), eq(itemStar.userId, user.id)));
  }
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

  const [ownedItem] = await db
    .select({ id: item.id })
    .from(item)
    .where(and(eq(item.id, itemId), eq(item.userId, user.id)))
    .limit(1);

  if (!ownedItem) {
    throw new Error("Item not found");
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
