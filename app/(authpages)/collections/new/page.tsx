import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { NewCollectionForm } from "./NewCollectionForm";

export default async function NewCollectionPage() {
  /** TEMP GUARD FOR DB INJECTION */

  const { userId } = await auth();

  if (userId !== "user_3At4IYWqSuiNtNy5T9g2kyGpLJP") {
    notFound();
  }

  /** END TEMP GUARD */

  return (
    <>
      <PageTitle title="Create a new collection" />

      <PageContent>
        <NewCollectionForm />
      </PageContent>
    </>
  );
}
