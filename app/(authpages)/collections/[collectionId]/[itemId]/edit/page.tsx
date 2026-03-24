import { PageTitle } from "~/app/_components/Header/PageTitle";
import PageContent from "~/app/_components/PageContent";
import { getAuthedItem } from "~/server/query/item";
import { EditItemForm } from "./EditItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ collectionId: string; itemId: string }>;
}) {
  const { itemId } = await params;
  const item = await getAuthedItem(itemId);

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
