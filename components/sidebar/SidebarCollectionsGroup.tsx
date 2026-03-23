"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

export function SidebarCollectionsGroup({ children }: { children: ReactNode }) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <Link href='/collections' onClick={() => setOpenMobile(false)}>
        <SidebarGroupLabel className='text-md space-grotesk mb-2 text-primary hover:text-gray-900'>
          My Collections
        </SidebarGroupLabel>
      </Link>

      <SidebarGroupContent className='ml-3 w-auto'>
        {/* TODO: use sidebar menu skeleton */}
        {children}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
