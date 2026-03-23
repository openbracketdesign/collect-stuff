import { SignOutButton } from "@clerk/nextjs";
import { LogOut, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/Footer";
import Logo from "@/components/header/Logo";
import { SidebarCollectionsGroup } from "@/components/sidebar/SidebarCollectionsGroup";
import { SidebarMyCollections } from "@/components/sidebar/SidebarMyCollections";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className='flex-row border-b p-4'>
          <Logo />
        </SidebarHeader>

        <SidebarHeader className='flex-row border-b p-4'>
          <Link href='/collections/new'>
            <Button>
              Create <Plus />
            </Button>
          </Link>
        </SidebarHeader>

        <SidebarContent className='border-b'>
          <SidebarCollectionsGroup>
            <SidebarMyCollections />
          </SidebarCollectionsGroup>
        </SidebarContent>

        <SidebarFooter className='p-4'>
          <SignOutButton>
            <Button variant='outline'>
              Sign out <LogOut />
            </Button>
          </SignOutButton>
        </SidebarFooter>
      </Sidebar>

      <main className='flex flex-1 flex-col'>
        {children}

        <Footer />
      </main>

      <Toaster />
    </SidebarProvider>
  );
}
