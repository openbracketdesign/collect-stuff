"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

import { db } from "./db";
import {
  collection,
  collectionStar,
  item,
  itemImage,
  itemProperty,
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
    .returning({ id: collection.id, name: collection.name });
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

export async function createItem(
  formData: FormData,
  collectionId: string,
  propertyIds: string[],
) {
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
  const propertyRows = propertyIds
    .map((propertyId) => {
      const value = formText(formData.get(propertyId));
      return value !== null ? { propertyId, value } : null;
    })
    .filter(
      (row): row is { propertyId: string; value: string } => row !== null,
    );

  // use transaction to pass new ID from item insert to item property insert
  return await db.transaction(async (tx) => {
    const [newItem] = await tx
      .insert(item)
      .values({
        name,
        description,
        collectionId,
        userId: user.id,
      })
      .returning({ id: item.id, name: item.name });

    await tx.insert(itemProperty).values(
      propertyRows.map((row) => ({
        itemId: newItem.id,
        propertyId: row.propertyId,
        value: row.value,
      })),
    );

    return newItem;
  });
}

export async function editItem(
  formData: FormData,
  itemId: string,
  deletedImageFileKeys: string[],
  collectionPropertyIds: string[],
) {
  if (!itemId) {
    throw new Error("Item ID is required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const collectionId = formText(formData.get("collectionId")) ?? "";

  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const [ownedItem] = await db
    .select({ id: item.id })
    .from(item)
    .where(and(eq(item.id, itemId), eq(item.userId, user.id)))
    .limit(1);

  if (!ownedItem) {
    throw new Error("Item not found");
  }

  const [targetCollection] = await db
    .select({ id: collection.id })
    .from(collection)
    .where(and(eq(collection.id, collectionId), eq(collection.userId, user.id)))
    .limit(1);

  if (!targetCollection) {
    throw new Error("Collection not found");
  }

  const name = formText(formData.get("name")) ?? "";
  const description = formText(formData.get("description"));

  const itemUpdate = db
    .update(item)
    .set({
      name,
      description,
      collectionId,
      modified: new Date(),
    })
    .where(and(eq(item.id, itemId), eq(item.userId, user.id)))
    .returning({ name: item.name, collectionId: item.collectionId });

  const imageDelete = db
    .delete(itemImage)
    .where(
      and(
        eq(itemImage.itemId, itemId),
        inArray(itemImage.fileKey, deletedImageFileKeys),
      ),
    );

  const propertyRows = collectionPropertyIds
    .map((propertyId) => {
      const value = formText(formData.get(propertyId));
      return value !== null ? { propertyId, value } : null;
    })
    .filter(
      (row): row is { propertyId: string; value: string } => row !== null,
    );

  if (propertyRows.length > 0) {
    const [[updatedItem]] = await db.batch([
      itemUpdate,
      db
        .insert(itemProperty)
        .values(
          propertyRows.map((row) => ({
            itemId,
            propertyId: row.propertyId,
            value: row.value || null,
          })),
        )
        .onConflictDoUpdate({
          target: [itemProperty.itemId, itemProperty.propertyId],
          set: { value: sql`excluded.value` },
        }),
      imageDelete,
    ]);

    return updatedItem;
  }

  const [[updatedItem]] = await db.batch([itemUpdate, imageDelete]);

  return updatedItem;
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
