"use client"

import { CollectionWithItemsAndImages } from "@/server/schema"
import { type ColumnDef } from "@tanstack/react-table"

export const buildColumns = (
  collection: CollectionWithItemsAndImages
): Array<ColumnDef<Record<string, string>>> => {
  const fixedCols = [
    {
      accessorKey: "image",
      header: "Image",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
  ]

  const propertyCols = collection.properties.map((property) => ({
    accessorKey: property.id,
    header: property.name,
  }))

  return [...fixedCols, ...propertyCols]
}
