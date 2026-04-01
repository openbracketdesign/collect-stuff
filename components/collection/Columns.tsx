"use client";

import { CollectionWithItemsAndImages } from "@/server/schema";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { DeleteButton } from "../button/DeleteButton";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const buildColumns = (
  collection: CollectionWithItemsAndImages,
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

  const propertyCols = collection.properties.map((property) => ({
    accessorKey: property.id,
    header: property.name,
  }));

  const actions: ColumnDef<Record<string, string>> = {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="space-y-1">
            <DropdownMenuItem asChild>
              <Link href={`/collections/${collection.id}/${item.id}/edit`}>
                Edit
                <Pencil className="h-4 w-4 ml-auto" />
              </Link>
            </DropdownMenuItem>
            <DeleteButton
              thing={{ id: item.id, name: item.name }}
              variant="menuItem"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };

  return [...fixedCols, ...propertyCols, actions];
};
