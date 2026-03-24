import { CollectionItems } from "@/components/collection/CollectionItems";
import { CollectionActions } from "@/components/header/CollectionActions";
import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { cx } from "class-variance-authority";
import { Plus } from "lucide-react";
import Link from "next/link";
// import { getCollectionWithItemProperties } from "~/server/query/collection";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const collectionId = (await params).collectionId;
  // const collection = await getCollectionWithItemProperties(collectionId);
  const collection = {
    name: "test collection",
    description: "This is a mock description for the collection.",
    userId: "mockUserId123",
    items: [
      {
        id: "item1",
        name: "Mock Item One",
        description: "First mock item in the collection.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "item2",
        name: "Mock Item Two",
        description: "Second mock item in the collection.",
        createdAt: new Date().toISOString(),
      },
    ],
  };

  if (!collection) {
    return (
      <>
        <PageTitle
          breadcrumbs={[{ name: "My Collections", href: "/collections" }]}
          title='Oops!'
        />
        <PageContent>
          <h1>Collection not found</h1>
        </PageContent>
      </>
    );
  }

  const user = await auth();

  return (
    <>
      <PageTitle
        breadcrumbs={[{ name: "My Collections", href: "/collections" }]}
        title={collection.name}
      >
        {user.userId === collection.userId && (
          <CollectionActions collectionId={collectionId} />
        )}
      </PageTitle>

      <div className='mt-6 border-t md:m-0 md:border-0'>
        <PageContent>
          <p
            className={cx("mb-4 max-w-[70ch]", {
              "text-gray-400": !collection.description,
            })}
          >
            {collection.description ?? "No description"}
          </p>

          <div
            className={cx("mb-4 mt-6 border-t pt-6", {
              "mb-0": collection.items.length === 0,
            })}
          >
            <div className='inline-flex'>
              <h2 className='text-2xl text-primary'>
                {collection.items.length}{" "}
                {collection.items.length === 1 ? "item" : "items"}
              </h2>

              {user.userId === collection.userId && (
                <Link
                  href={`/collections/${collectionId}/add`}
                  className='ml-4'
                >
                  <Button size='sm'>
                    Add <Plus />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <CollectionItems collection={collection} />
        </PageContent>
      </div>
    </>
  );
}
