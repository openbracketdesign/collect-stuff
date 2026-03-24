"use server";

import { neon } from "@neondatabase/serverless";

export async function createCollection(formData: FormData) {
  // Connect to the Neon database
  const sql = neon(`${process.env.DATABASE_URL}`);
  const name = formData.get("name");
  const description = formData.get("description");
  // Insert the collection from the form into the Postgres database
  const newCollection = await sql`
      INSERT INTO collections (name, description, date)
      VALUES (${name}, ${description}, NOW())
      RETURNING id`;
  return newCollection;
}
