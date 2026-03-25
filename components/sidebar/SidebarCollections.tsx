"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collection } from "@/server/schema";
import { cx } from "class-variance-authority";
import { Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarCollections({
  collections,
}: {
  collections: Collection[];
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <>
      {collections.map((collection) => (
        <SidebarMenuItem key={collection.id}>
          <SidebarMenuButton asChild>
            <Link
              href={`/collections/${collection.id}`}
              onClick={() => setOpenMobile(false)}
              className={cx("hover:text-primary", {
                "text-primary": pathname.includes(collection.id),
              })}
            >
              {collection.name}
              {collection.stars && collection.stars.length > 0 && (
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              )}
            </Link>
          </SidebarMenuButton>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction>
                <MoreHorizontal />
              </SidebarMenuAction>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem className="cursor-pointer">
                <Link
                  href={`/collections/${collection.id}/edit`}
                  className="grow"
                >
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Share</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </SidebarMenuItem>
      ))}
    </>
  );
}
