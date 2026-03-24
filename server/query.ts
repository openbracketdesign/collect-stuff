"use server";

import { auth } from "@clerk/nextjs/server";
import { and, asc, desc, eq } from "drizzle-orm";

import { db } from "./db";
import { collection } from "./schema";

export async function getMyCollections(
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
    with: { items: true },
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
    with: { items: true },
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
    with: { items: true },
  });
}
