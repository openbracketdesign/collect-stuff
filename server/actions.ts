"use server";

import { currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function createCollection(formData: FormData) {
  // Connect to the Neon database
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const name = formData.get("name");
  const description = formData.get("description");

  // Insert the collection from the form into the Postgres database
  const newCollection = await sql`
      INSERT INTO collections (name, description, date, "userId")
      VALUES (${name}, ${description}, NOW(), ${user.id})
      RETURNING id`;
  return newCollection;
}

export async function editCollection(formData: FormData, collectionId: string) {
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const sql = neon(`${process.env.DATABASE_URL}`);
  const name = formData.get("name");
  const description = formData.get("description");

  // Insert the collection from the form into the Postgres database
  const updatedCollection = await sql`
      UPDATE collections SET name = ${name}, description = ${description} WHERE id = ${collectionId} AND "userId" = ${user.id}
      RETURNING name`;
  return updatedCollection;
}
