import { SidebarMenu } from "@/components/ui/sidebar";
// import { getMyCollections } from "~/server/query/collection";
import { SidebarCollections } from "./SidebarCollections";

export async function SidebarMyCollections() {
  const collections: any[] = []; // await getMyCollections();

  const sortedCollections = collections.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name),
  );

  return (
    <SidebarMenu>
      <SidebarCollections collections={collections} />
    </SidebarMenu>
  );
}
