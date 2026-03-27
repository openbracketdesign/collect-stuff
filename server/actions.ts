"use server";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

import { db } from "./db";
import {
  collection,
  collectionProperty,
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

export async function createCollection(
  formData: FormData,
  newProperties: string[],
) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const name = formText(formData.get("name")) ?? "";
  const description = formText(formData.get("description"));

  const propertyRows = newProperties
    .map((property) => {
      return { name: property };
    })
    .filter((row) => row.name !== "");

  const collectionId = crypto.randomUUID();

  return await db.batch([
    db
      .insert(collection)
      .values({
        id: collectionId,
        name,
        description,
        userId: user.id,
      })
      .returning({ id: collection.id, name: collection.name }),
    db.insert(collectionProperty).values(
      propertyRows.map((row) => ({
        collectionId,
        name: row.name,
      })),
    ),
  ]);
}

export async function editCollection(
  formData: FormData,
  collectionId: string,
  collectionPropertyIds: string[],
  newProperties: string[],
  deletedProperties: string[],
) {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const name = formText(formData.get("name")) ?? "";
  const description = formText(formData.get("description"));

  const newPropertyRows = newProperties
    .map((property) => {
      return { name: property };
    })
    .filter((row) => row.name !== "");

  const collectionUpdate = db
    .update(collection)
    .set({
      name,
      description,
      modified: new Date(),
    })
    .where(and(eq(collection.id, collectionId), eq(collection.userId, user.id)))
    .returning({ name: collection.name });

  /** could filter out unchanged properties here, but would need to know the current property names:ids */
  const propertyUpdate = collectionPropertyIds.map((id) =>
    db
      .update(collectionProperty)
      .set({ name: formText(formData.get(id)) ?? "" })
      .where(
        and(
          eq(collectionProperty.id, id),
          eq(collectionProperty.collectionId, collectionId),
        ),
      ),
  );

  const propertyDelete = db
    .delete(collectionProperty)
    .where(inArray(collectionProperty.id, deletedProperties));

  if (newPropertyRows.length > 0) {
    const [[updatedCollection]] = await db.batch([
      collectionUpdate,
      ...propertyUpdate,
      db
        .insert(collectionProperty)
        .values(
          newPropertyRows.map((row) => ({
            collectionId,
            name: row.name,
          })),
        )
        .onConflictDoNothing({
          target: [collectionProperty.collectionId, collectionProperty.name],
        }),
      propertyDelete,
    ]);

    return updatedCollection;
  }

  const [[updatedCollection]] = await db.batch([
    collectionUpdate,
    ...propertyUpdate,
    propertyDelete,
  ]);

  return updatedCollection;
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

  const itemId = crypto.randomUUID();

  const itemInsert = db.insert(item).values({
    id: itemId,
    name,
    description,
    collectionId,
    userId: user.id,
  });

  if (propertyRows.length > 0) {
    await db.batch([
      itemInsert,
      db.insert(itemProperty).values(
        propertyRows.map((row) => ({
          itemId,
          propertyId: row.propertyId,
          value: row.value,
        })),
      ),
    ]);
  }

  await itemInsert;

  return { id: itemId, name };
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

  // delete image references that are no longer in the form data: only runs if there are deleted image file keys
  const imageDelete = db
    .delete(itemImage)
    .where(
      and(
        eq(itemImage.itemId, itemId),
        inArray(itemImage.fileKey, deletedImageFileKeys),
      ),
    );

  // form fields are named with collection property id
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
        .insert(itemProperty) // upsert item properties; do not bother deleting old ones associated with different collection if that was changed. If the collection is changed back, we will still have them
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

  // if there are no property rows, just update the item and delete any unused image references
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
