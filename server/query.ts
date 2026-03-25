"use server";

import { auth } from "@clerk/nextjs/server";
import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "./db";
import { collection, collectionStar, item, itemStar } from "./schema";

export async function getMyCollectionList(
  orderBy: "date" | "name" = "date",
  orderDirection: "ASC" | "DESC" = "DESC",
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const orderColumn = orderBy === "date" ? collection.date : collection.name;
  const orderFn = orderDirection === "ASC" ? asc : desc;

  return db.query.collection.findMany({
    where: eq(collection.userId, userId),
    orderBy: [orderFn(orderColumn)],
    with: {
      stars: {
        where: eq(collectionStar.userId, userId),
        limit: 1,
      },
      properties: true,
    },
  });
}

export async function getMyCollectionsWithItems(
  orderBy: "date" | "name" = "date",
  orderDirection: "ASC" | "DESC" = "DESC",
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const orderColumn = orderBy === "date" ? collection.date : collection.name;
  const orderFn = orderDirection === "ASC" ? asc : desc;

  return db.query.collection.findMany({
    where: eq(collection.userId, userId),
    orderBy: [orderFn(orderColumn)],
    with: {
      items: {
        with: {
          images: {
            limit: 4,
          },
        },
      },
      stars: {
        where: eq(collectionStar.userId, userId),
        limit: 1,
      },
    },
  });
}

export async function getCollectionsWithItemsByUserId(
  userId: string,
  orderBy: "date" | "name" = "date",
  orderDirection: "ASC" | "DESC" = "DESC",
) {
  if (!userId) {
    throw new Error("No user ID provided");
  }

  const orderColumn = orderBy === "date" ? collection.date : collection.name;
  const orderFn = orderDirection === "ASC" ? asc : desc;

  return db.query.collection.findMany({
    where: eq(collection.userId, userId),
    orderBy: [orderFn(orderColumn)],
    with: {
      items: {
        with: {
          images: {
            limit: 4,
          },
        },
      },
    },
  });
}

export async function getAuthedCollectionById(id: string) {
  if (!id) {
    throw new Error("No collection ID provided");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated for this collection");
  }

  return db.query.collection.findFirst({
    where: and(eq(collection.id, id), eq(collection.userId, userId)),
    with: {
      properties: true,
    },
  });
}

export async function getCollectionById(id: string) {
  if (!id) {
    throw new Error("No collection ID provided");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  return db.query.collection.findFirst({
    where: eq(collection.id, id),
    with: {
      items: {
        with: {
          images: {
            limit: 4,
          },
          collection: { columns: { name: true }, with: { properties: true } },
          properties: true,
        },
      },
      properties: true,
      ...(userId
        ? {
            stars: {
              where: eq(collectionStar.userId, userId),
              limit: 1,
            },
          }
        : {}),
    },
  });
}

export async function getAuthedItemById(id: string) {
  if (!id) {
    throw new Error("No item ID provided");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  return db.query.item.findFirst({
    where: and(eq(item.id, id), eq(item.userId, userId)),
    with: {
      images: true,
      collection: { columns: { name: true }, with: { properties: true } },
      properties: true,
    },
  });
}

export async function getItemWithCollectionAndItemsById(id: string) {
  if (!id) {
    throw new Error("No item ID provided");
  }

  const { userId } = await auth();

  return db.query.item.findFirst({
    where: eq(item.id, id),
    with: {
      collection: {
        with: {
          items: { orderBy: [asc(item.name)] },
          properties: true,
        },
      },
      images: true,
      ...(userId
        ? {
            stars: {
              where: eq(itemStar.userId, userId),
              limit: 1,
            },
          }
        : {}),
      properties: true,
    },
  });
}
