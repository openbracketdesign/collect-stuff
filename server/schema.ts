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
  userId: text("userId").notNull(),
  collectionId: uuid("collectionId")
    .notNull()
    .references(() => collection.id, { onDelete: "cascade" }),
  date: timestamp("date").defaultNow().notNull(),
  modified: timestamp("modified").defaultNow().notNull(),
});

export const itemImage = pgTable("item_image", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("itemId")
    .notNull()
    .references(() => item.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  fileKey: text("fileKey").notNull(),
});

export const collectionStar = pgTable("collection_star", {
  id: uuid("id").primaryKey().defaultRandom(),
  collectionId: uuid("collectionId")
    .notNull()
    .references(() => collection.id, { onDelete: "cascade" }),
  userId: text("userId").notNull(),
});

export const itemStar = pgTable("item_star", {
  id: uuid("id").primaryKey().defaultRandom(),
  itemId: uuid("itemId")
    .notNull()
    .references(() => item.id, { onDelete: "cascade" }),
  userId: text("userId").notNull(),
});

export const collectionRelations = relations(collection, ({ many }) => ({
  items: many(item),
  stars: many(collectionStar),
}));

export const itemRelations = relations(item, ({ one, many }) => ({
  collection: one(collection, {
    fields: [item.collectionId],
    references: [collection.id],
  }),
  images: many(itemImage),
  stars: many(itemStar),
}));

export const itemImageRelations = relations(itemImage, ({ one }) => ({
  item: one(item, {
    fields: [itemImage.itemId],
    references: [item.id],
  }),
}));

export const collectionStarRelations = relations(collectionStar, ({ one }) => ({
  collection: one(collection, {
    fields: [collectionStar.collectionId],
    references: [collection.id],
  }),
}));

export const itemStarRelations = relations(itemStar, ({ one }) => ({
  item: one(item, {
    fields: [itemStar.itemId],
    references: [item.id],
  }),
}));

/** Row shape from `SELECT` / `db.query.*` on `collection` alone */
export type Collection = typeof collection.$inferSelect & {
  stars?: { id: string }[];
};
/** Values accepted by `db.insert(collection)` */
// export type NewCollection = typeof collection.$inferInsert;

export type Item = typeof item.$inferSelect;
// export type NewItem = typeof item.$inferInsert;

export type ItemImage = typeof itemImage.$inferSelect;

/** Matches `with: { items: true }` on collection queries */
export type CollectionWithItems = Collection & { items: Item[] };
export type CollectionWithItemsAndImages = Collection & {
  items: ItemWithImages[];
};

/** Matches `with: { images: true }` on item queries */
export type ItemWithImages = Item & {
  images: ItemImage[];
  collection: { name: string };
  stars?: { id: string }[];
};

/** Matches `with: { collection: true }` on item queries */
// export type ItemWithCollection = Item & { collection: Collection };
// export type ItemWithCollectionAndImages = ItemWithCollection & {
//   images: ItemImage[];
// };

// export type ItemWithCollectionAndItems = ItemWithCollectionAndImages & {
//   items: Item[];
// };
