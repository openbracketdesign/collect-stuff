"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
// import { type CollectionWithItemProperties } from "~/types";
import { CollectionWithItemsAndImages } from "@/server/schema"
import Image from "next/image"
import { StarButton } from "../button/StarButton"
import { buildColumns } from "./Columns"
import { DataTable } from "./DataTable"

export function CollectionItems({
  collection,
  view,
}: {
  collection: CollectionWithItemsAndImages
  view?: "GRID" | "TABLE"
}) {
  if (view === "TABLE") {
    const columns = buildColumns(collection)

    const itemProps = collection.items?.map((item) => {
      const fixedProps: Record<string, string> = {
        image: item.images[0]?.url || "",
        name: item.name,
        id: item.id,
      }

      const props = item.properties.reduce((acc, property) => {
        acc[property.propertyId] = property.value ?? "--"
        return acc
      }, fixedProps)

      return props
    })

    return (
      <DataTable
        columns={columns}
        data={itemProps}
        collectionId={collection.id}
      />
    )
  }

  // grid
  return (
    <div className="gap-4 lg:grid-cols-1 grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
      {collection.items?.length === 0 && (
        <p className="text-gray-500">
          No items in this collection yet. Add some items to get started!
        </p>
      )}

      {collection.items?.map((item) => (
        <Link key={item.id} href={`/collections/${collection.id}/${item.id}`}>
          <Card className="group gap-4 p-4 hover:border-primary-300 grid h-full grid-cols-[80px_3fr]">
            <CardContent className="p-0">
              {item.images[0]?.url ? (
                <Image
                  src={item.images[0].url}
                  alt={item.name}
                  className="rounded md:w-[80px] h-[80px] w-full"
                  style={{ objectFit: "contain" }}
                  height={300}
                  width={300}
                />
              ) : (
                <div className="rounded h-[80px] w-full border" />
              )}
            </CardContent>

            <CardHeader className="p-0 gap-y-1 gap-x-4">
              <CardTitle className="space-grotesk text-base leading-5 group-hover:text-primary">
                {item.name}
              </CardTitle>

              <CardDescription className="line-clamp-3 empty:hidden">
                {item.description}
              </CardDescription>

              <CardAction className="justify-end">
                <StarButton
                  type="ITEM"
                  id={item.id}
                  iconOnly
                  starred={item.stars && item.stars.length > 0}
                />
              </CardAction>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
