import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

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

export const collectionProperty = pgTable(
  "collection_property",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    collectionId: uuid("collectionId")
      .notNull()
      .references(() => collection.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
  },
  (table) => [
    uniqueIndex("collection_property_collectionId_name_unique").on(
      table.collectionId,
      table.name,
    ),
  ],
);

export const itemProperty = pgTable(
  "item_property",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("itemId")
      .notNull()
      .references(() => item.id, { onDelete: "cascade" }),
    propertyId: uuid("propertyId")
      .notNull()
      .references(() => collectionProperty.id, { onDelete: "cascade" }),
    value: text("value"),
  },
  (table) => [
    uniqueIndex("item_property_itemId_propertyId_unique").on(
      table.itemId,
      table.propertyId,
    ),
  ],
);

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
  properties: many(collectionProperty),
}));

export const itemRelations = relations(item, ({ one, many }) => ({
  collection: one(collection, {
    fields: [item.collectionId],
    references: [collection.id],
  }),
  images: many(itemImage),
  stars: many(itemStar),
  properties: many(itemProperty),
}));

export const itemImageRelations = relations(itemImage, ({ one }) => ({
  item: one(item, {
    fields: [itemImage.itemId],
    references: [item.id],
  }),
}));

export const collectionPropertyRelations = relations(
  collectionProperty,
  ({ one }) => ({
    collection: one(collection, {
      fields: [collectionProperty.collectionId],
      references: [collection.id],
    }),
  }),
);

export const itemPropertyRelations = relations(itemProperty, ({ one }) => ({
  item: one(item, {
    fields: [itemProperty.itemId],
    references: [item.id],
  }),
  property: one(collectionProperty, {
    fields: [itemProperty.propertyId],
    references: [collectionProperty.id],
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
  properties: CollectionProperty[];
};
/** Values accepted by `db.insert(collection)` */
// export type NewCollection = typeof collection.$inferInsert;

export type Item = typeof item.$inferSelect;
// export type NewItem = typeof item.$inferInsert;

export type ItemImage = typeof itemImage.$inferSelect;

/** Matches `with: { items: true }` on collection queries */
export type CollectionWithItems = Collection & {
  items: (Item & { images: ItemImage[] })[];
};
export type CollectionWithItemsAndImages = Collection & {
  items: ItemWithImages[];
};

/** Matches `with: { images: true }` on item queries */
export type ItemWithImages = Item & {
  images: ItemImage[];
  collection: { name: string; properties: CollectionProperty[] };
  stars?: { id: string }[];
  properties: ItemProperty[];
};

export type CollectionProperty = typeof collectionProperty.$inferSelect;
export type ItemProperty = typeof itemProperty.$inferSelect;

/** Matches `with: { collection: true }` on item queries */
// export type ItemWithCollection = Item & { collection: Collection };
// export type ItemWithCollectionAndImages = ItemWithCollection & {
//   images: ItemImage[];
// };

// export type ItemWithCollectionAndItems = ItemWithCollectionAndImages & {
//   items: Item[];
// };
