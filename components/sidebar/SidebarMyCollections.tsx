import { SidebarMenu } from "@/components/ui/sidebar";
import { getMyCollections } from "@/server/query";
import { SidebarCollections } from "./SidebarCollections";

export async function SidebarMyCollections() {
  const collections = await getMyCollections("name", "ASC");

  return (
    <SidebarMenu>
      <SidebarCollections collections={collections} />
    </SidebarMenu>
  );
}
