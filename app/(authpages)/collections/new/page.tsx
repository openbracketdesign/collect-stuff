import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { NewCollectionForm } from "./NewCollectionForm";

export default async function NewCollectionPage() {
  return (
    <>
      <PageTitle title="Create a new collection" />

      <PageContent>
        <NewCollectionForm />
      </PageContent>
    </>
  );
}
