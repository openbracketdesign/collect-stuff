"use client"

import { EditButton } from "../button/EditButton"
import ShareOrCopyButton from "../button/ShareOrCopyButton"
import { StarButton } from "../button/StarButton"

export function CollectionActions({
  collectionId,
  canEdit,
  canStar,
  starred,
}: {
  collectionId: string
  canEdit: boolean
  canStar: boolean
  starred: boolean
}) {
  return (
    <div className="gap-4 flex">
      {/* <Link href={`/collections/${collectionId}/add`}>
        <Button>
          <span className="block md:hidden xl:block">Add</span>
          <Plus />
        </Button>
      </Link> */}

      {canEdit && <EditButton collectionId={collectionId} />}

      {canStar && (
        <StarButton id={collectionId} type="COLLECTION" starred={starred} />
      )}

      <ShareOrCopyButton />
    </div>
  )
}
