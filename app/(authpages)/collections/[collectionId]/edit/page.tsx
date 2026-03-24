import { PageTitle } from "~/app/_components/Header/PageTitle";
import PageContent from "~/app/_components/PageContent";
import { getAuthedCollection } from "~/server/query/collection";
import { EditCollectionForm } from "./EditCollectionForm";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  const collection = await getAuthedCollection(collectionId);

  if (!collection) {
    return (
      <>
        <PageTitle
          title="Oops!"
          breadcrumbs={[{ name: "Collections", href: "/collections" }]}
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
        <h2 className="mb-4 text-2xl text-primary">Edit collection</h2>

        <EditCollectionForm collection={collection} />
      </PageContent>
    </>
  );
}
