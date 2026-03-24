import { PageTitle } from "~/app/_components/Header/PageTitle";
import PageContent from "~/app/_components/PageContent";
import { getCollection } from "~/server/query/collection";
import { AddItemForm } from "./AddItemForm";

export default async function AddItemPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const collectionId = (await params).collectionId;
  const collection = await getCollection(collectionId);

  if (!collection) {
    return (
      <>
        <PageTitle
          breadcrumbs={[{ name: "My Collections", href: "/collections" }]}
          title="Oops!"
        />
        <PageContent>
          <h1>Collection not found</h1>
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageTitle
        breadcrumbs={[{ name: "My Collections", href: "/collections" }]}
        title={collection.name}
      />

      <PageContent>
        <h2 className="mb-4 text-2xl text-primary">Add item</h2>

        <AddItemForm collection={collection} />
      </PageContent>
    </>
  );
}
