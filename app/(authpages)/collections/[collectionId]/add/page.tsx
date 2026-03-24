import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { getAuthedCollectionById } from "@/server/query";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { AddItemForm } from "./AddItemForm";

export default async function AddItemPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  /** TEMP GUARD FOR DB INJECTION */

  const { userId } = await auth();

  if (userId !== "user_3At4IYWqSuiNtNy5T9g2kyGpLJP") {
    notFound();
  }

  /** END TEMP GUARD */

  const collectionId = (await params).collectionId;
  const collection = await getAuthedCollectionById(collectionId);

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
