"use client"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { Menu } from "lucide-react"

export function Hamburger() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      className="lg:hidden mr-3 self-start"
      variant="outline"
      onClick={toggleSidebar}
    >
      <Menu />
    </Button>
  )
}
