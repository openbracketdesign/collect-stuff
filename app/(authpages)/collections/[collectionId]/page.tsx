import { CollectionItemsTableOrGrid } from "@/components/collection/CollectionItemsTableOrGrid"
import { CollectionActions } from "@/components/header/CollectionActions"
import { PageTitle } from "@/components/header/PageTitle"
import PageContent from "@/components/PageContent"
import { getCollectionById } from "@/server/query"
import { auth } from "@clerk/nextjs/server"
import { cx } from "class-variance-authority"

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>
}) {
  const { collectionId } = await params
  const collection = await getCollectionById(collectionId)

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
    )
  }

  const { userId } = await auth()

  return (
    <>
      <PageTitle
        breadcrumbs={[{ name: "My Collections", href: "/collections" }]}
        title={collection.name}
      >
        {userId === collection.userId && (
          <CollectionActions
            collectionId={collectionId}
            canEdit={userId === collection.userId}
            canStar={!!userId}
            starred={collection.stars?.length > 0}
          />
        )}
      </PageTitle>

      <div className="mt-6 md:m-0 md:border-0 border-t">
        <PageContent>
          <p
            className={cx("mb-4 max-w-[70ch]", {
              "text-gray-400": !collection.description,
            })}
          >
            {collection.description ?? "No description"}
          </p>

          <CollectionItemsTableOrGrid
            collection={collection}
            canAddItems={userId === collection.userId}
          />
        </PageContent>
      </div>
    </>
  )
}
