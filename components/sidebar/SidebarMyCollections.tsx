import { SidebarMenu } from "@/components/ui/sidebar";
import { getMyCollectionList } from "@/server/query";
import { SidebarCollections } from "./SidebarCollections";

export async function SidebarMyCollections() {
  const collections = await getMyCollectionList("name", "ASC");

  return (
    <SidebarMenu>
      <SidebarCollections collections={collections} />
    </SidebarMenu>
  );
}
