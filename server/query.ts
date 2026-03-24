import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function getMyCollections() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const collections = await sql`
    SELECT * FROM collections
    WHERE "userId" = ${userId}
    ORDER BY date DESC
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

  const user = await auth();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const collection = await sql`
    SELECT * FROM collections
    WHERE id = ${id}
  `;
  return collection?.[0];
}
