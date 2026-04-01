import { DeleteButton } from "@/components/button/DeleteButton";
import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { getAuthedCollectionById } from "@/server/query";
import { EditCollectionForm } from "./EditCollectionForm";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = await params;
  const collection = await getAuthedCollectionById(collectionId);

  if (!collection) {
    return (
      <>
        <PageTitle
          title="Oops!"
          breadcrumbs={[{ name: "Collections", href: "/collections" }]}
        />

        <PageContent>
          <h1>
            Collection not found, or maybe you don&apos;t have permission to
            edit it
          </h1>
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Edit collection">
        <DeleteButton
          thing={collection}
          type="collection"
          redirectTo="/collections"
        />
      </PageTitle>

      <PageContent>
        <EditCollectionForm collection={collection} />
      </PageContent>
    </>
  );
}
