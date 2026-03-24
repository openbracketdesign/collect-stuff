import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function getMyCollections(
  orderBy: "date" | "name" = "date",
  orderDirection: "ASC" | "DESC" = "DESC",
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const collections = await sql`
    SELECT * FROM collections
    WHERE "userId" = ${userId}
    ORDER BY ${orderBy === "date" ? sql`date` : sql`name`} ${orderDirection === "ASC" ? sql`ASC` : sql`DESC`}
  `;
  return collections;
}

export async function getAuthedCollectionById(id: string) {
  if (!id) {
    throw new Error("No collection ID provided");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated for this collection");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const collection = await sql`
    SELECT * FROM collections
    WHERE id = ${id}
    AND "userId" = ${userId}
  `;
  return collection?.[0];
}

export async function getCollectionById(id: string) {
  if (!id) {
    throw new Error("No collection ID provided");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const collection = await sql`
    SELECT * FROM collections
    WHERE id = ${id}
  `;
  return collection?.[0];
}
