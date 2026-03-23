"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function Hamburger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button className='lg:hidden' variant='outline' onClick={toggleSidebar}>
      <Menu />
    </Button>
  );
}
