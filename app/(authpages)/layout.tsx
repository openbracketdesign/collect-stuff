import { CreateCollectionButton } from "@/components/button/CreateCollectionButton";
import { Footer } from "@/components/Footer";
import Logo from "@/components/header/Logo";
import { SidebarCollectionsGroup } from "@/components/sidebar/SidebarCollectionsGroup";
import { SidebarMyCollections } from "@/components/sidebar/SidebarMyCollections";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex-row border-b p-4">
          <Logo />
        </SidebarHeader>

        <SidebarHeader className="flex-row border-b p-4">
          <CreateCollectionButton />
        </SidebarHeader>

        <SidebarContent className="border-b">
          <SidebarCollectionsGroup>
            <SidebarMyCollections />
          </SidebarCollectionsGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 flex items-center justify-center">
          <SignOutButton>
            <Button variant="outline" className="h-10 w-full">
              Sign out <LogOut />
            </Button>
          </SignOutButton>
        </SidebarFooter>
      </Sidebar>

      <main className="flex flex-1 flex-col">
        {children}

        <Footer />
      </main>

      <Toaster />
    </SidebarProvider>
  );
}
