import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { getAuthedItemById } from "@/server/query";
import { EditItemForm } from "./EditItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ collectionId: string; itemId: string }>;
}) {
  const { itemId } = await params;
  const item = await getAuthedItemById(itemId);

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
      <PageTitle title="Edit item" breadcrumbs={[]} />
      <PageContent>
        <EditItemForm item={item} />
      </PageContent>
    </>
  );
}
