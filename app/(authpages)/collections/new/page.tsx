import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { NewCollectionForm } from "./NewCollectionForm";

export default function NewCollectionPage() {
  return (
    <>
      <PageTitle title="Create a new collection" breadcrumbs={[]} />

      <PageContent>
        <NewCollectionForm />
      </PageContent>
    </>
  );
}
