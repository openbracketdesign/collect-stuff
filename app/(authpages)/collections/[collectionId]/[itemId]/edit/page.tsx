import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { EditItemForm } from "./EditItemForm";

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ collectionId: string; itemId: string }>;
}) {
  /** TEMP GUARD FOR DB INJECTION */

  const { userId } = await auth();

  if (userId !== "user_3At4IYWqSuiNtNy5T9g2kyGpLJP") {
    notFound();
  }

  /** END TEMP GUARD */

  const { itemId } = await params;
  const item = null;
  // await getAuthedItem(itemId);

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
