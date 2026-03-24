import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const collection = pgTable("collection", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("userId").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  modified: timestamp("modified").defaultNow().notNull(),
});

export const item = pgTable("item", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image").notNull().default(""),
  userId: text("userId").notNull(),
  collectionId: uuid("collectionId")
    .notNull()
    .references(() => collection.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow().notNull(),
  modified: timestamp("modified").defaultNow().notNull(),
});

export const collectionRelations = relations(collection, ({ many }) => ({
  items: many(item),
}));

export const itemRelations = relations(item, ({ one }) => ({
  collection: one(collection, {
    fields: [item.collectionId],
    references: [collection.id],
  }),
}));

/** Row shape from `SELECT` / `db.query.*` on `collection` alone */
export type Collection = typeof collection.$inferSelect;
/** Values accepted by `db.insert(collection)` */
export type NewCollection = typeof collection.$inferInsert;

export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;

/** Matches `with: { items: true }` on collection queries */
export type CollectionWithItems = Collection & { items: Item[] };

/** Matches `with: { collection: true }` on item queries */
export type ItemWithCollection = Item & { collection: Collection };
export type ItemWithCollectionAndItems = ItemWithCollection & { items: Item[] };
