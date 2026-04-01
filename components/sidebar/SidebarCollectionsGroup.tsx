"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { type ReactNode } from "react";

export function SidebarCollectionsGroup({ children }: { children: ReactNode }) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <Link href="/collections" onClick={() => setOpenMobile(false)}>
        <SidebarGroupLabel className="text-md mb-2 text-primary hover:text-gray-900">
          My Collections
        </SidebarGroupLabel>
      </Link>

      <SidebarGroupContent className="w-auto">
        {/* TODO: use sidebar menu skeleton */}
        {children}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
