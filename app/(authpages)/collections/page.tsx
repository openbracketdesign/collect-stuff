import { MyCollections } from "@/components/collection/MyCollections";
import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";

export default async function CollectionsPage() {
  return (
    <>
      <PageTitle title="My Collections" breadcrumbs={[]} />

      <PageContent>
        <MyCollections />
      </PageContent>
    </>
  );
}
