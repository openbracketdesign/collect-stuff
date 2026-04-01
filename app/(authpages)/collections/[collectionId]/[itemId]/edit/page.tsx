import { DeleteItemButton } from "@/components/button/DeleteItemButton";
import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { getAuthedItemById, getMyCollectionList } from "@/server/query";
import { EditItemForm } from "./EditItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ collectionId: string; itemId: string }>;
}) {
  const { itemId } = await params;
  const item = await getAuthedItemById(itemId);

  const collections = await getMyCollectionList("name", "ASC");

  if (!item) {
    return (
      <>
        <PageTitle
          title="Oops!"
          breadcrumbs={[{ name: "Collections", href: "/collections" }]}
        />

        <PageContent>
          <h1>Item not found</h1>
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Edit item" breadcrumbs={[]}>
        <DeleteItemButton item={item} />
      </PageTitle>
      <PageContent>
        <EditItemForm item={item} collections={collections} />
      </PageContent>
    </>
  );
}
