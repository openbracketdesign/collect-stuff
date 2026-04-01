"use client";

import type { CollectionWithItems } from "@/server/schema";
import { cx } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function CollectionItemsList({
  collection,
}: {
  collection: CollectionWithItems;
}) {
  const pathname = usePathname();

  return (
    <div className="border-t border-dashed py-6 xl:border-l xl:border-t-0 xl:pl-6">
      <h2 className="space-grotesk mb-2 text-xl font-semibold tracking-tight">
        <Link className="text-primary" href={`/collections/${collection.id}`}>
          {collection.name}
        </Link>
      </h2>

      <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(40px,1fr))]">
        {collection.items?.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Link
                href={`/collections/${collection.id}/${item.id}`}
                className={cx(
                  "h-10 w-10 border bg-muted rounded hover:border hover:border-primary overflow-hidden",
                  {
                    "border-primary bg-primary/10":
                      pathname === `/collections/${collection.id}/${item.id}`,
                  },
                )}
              >
                {item.images?.[0] ? (
                  <Image
                    src={item.images[0].url}
                    alt=""
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover object-center"
                  />
                ) : (
                  <div className="flex items-center justify-center"></div>
                )}
              </Link>
            </TooltipTrigger>

            <TooltipContent>{item.name}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
