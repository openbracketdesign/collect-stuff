"use client";

import { type ColumnDef } from "@tanstack/react-table";
// import type { CollectionWithItemProperties } from "~/types";

export const buildColumns = (
  collection: any,
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
  ];

  const propertyCols = collection.collectionProperties.map((property: any) => ({
    accessorKey: property.id,
    header: property.name,
  }));

  return [...fixedCols, ...propertyCols];
};
