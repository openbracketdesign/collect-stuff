"use client"

import { CollectionWithItemsAndImages } from "@/server/schema"
import { cx } from "class-variance-authority"
import { List, Plus, Table } from "lucide-react"
import Link from "next/dist/client/link"
import { useState } from "react"
import { Button } from "../ui/button"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { CollectionItems } from "./CollectionItems"

export function CollectionItemsTableOrGrid({
  collection,
  canAddItems,
}: {
  collection: CollectionWithItemsAndImages
  canAddItems: boolean
}) {
  const [isGridView, setIsGridView] = useState(true)

  return (
    <>
      <div
        className={cx("mb-4 mt-6 pt-6 border-t", {
          "mb-0": collection.items?.length === 0,
        })}
      >
        <div className="flex">
          <h2 className="text-2xl text-primary">
            {collection.items?.length ?? 0}{" "}
            {collection.items?.length === 1 ? "item" : "items"}
          </h2>

          <div className="gap-2 ml-auto flex">
            {canAddItems && (
              <Link href={`/collections/${collection.id}/add`}>
                <Button size="sm">
                  Add <Plus />
                </Button>
              </Link>
            )}

            <ToggleGroup
              type="single"
              variant="outline"
              value={isGridView ? "grid" : "table"}
              onValueChange={(value) => setIsGridView(value === "grid")}
              size="sm"
            >
              <ToggleGroupItem value="table" aria-label="Toggle table view">
                <Table />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Toggle grid view">
                <List />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      <CollectionItems
        collection={collection}
        view={isGridView ? "GRID" : "TABLE"}
      />
    </>
  )
}
