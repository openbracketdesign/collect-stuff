"use client";

import type { CollectionWithItems } from "@/server/schema";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import type { CollectionNoProperties } from "~/types";

export function CollectionItemsList({
  collection,
  className,
}: {
  collection: CollectionWithItems;
  className: string;
}) {
  const pathname = usePathname();

  return (
    <div className={className}>
      <h2 className="space-grotesk mb-2 text-xl font-semibold tracking-tight">
        <Link className="text-primary" href={`/collections/${collection.id}`}>
          {collection.name}
        </Link>
      </h2>

      <div className="xl:border-l xl:pl-4">
        {collection.items?.map((item) => (
          <Link
            key={item.id}
            href={`/collections/${collection.id}/${item.id}`}
            className={cx("mb-1 flex items-center gap-2 hover:text-primary", {
              "text-primary": pathname.includes(item.id),
            })}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
