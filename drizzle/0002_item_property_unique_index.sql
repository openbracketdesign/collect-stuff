DELETE FROM "item_property" AS ip
WHERE ip.id IN (
  SELECT id
  FROM (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY "itemId", "propertyId"
        ORDER BY id DESC
      ) AS rn
    FROM "item_property"
  ) AS ranked
  WHERE ranked.rn > 1
);
--> statement-breakpoint
CREATE UNIQUE INDEX "item_property_itemId_propertyId_unique" ON "item_property" USING btree ("itemId","propertyId");