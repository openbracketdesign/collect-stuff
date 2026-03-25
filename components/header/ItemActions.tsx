"use client";

import { EditButton } from "../button/EditButton";
import ShareOrCopyButton from "../button/ShareOrCopyButton";
import { StarButton } from "../button/StarButton";

export function ItemActions({
  collectionId,
  itemId,
  canEdit,
  canStar,
  starred,
}: {
  collectionId: string;
  itemId: string;
  canEdit: boolean;
  canStar: boolean;
  starred: boolean;
}) {
  return (
    <div className="flex gap-4">
      {canEdit && <EditButton collectionId={collectionId} itemId={itemId} />}

      {canStar && <StarButton id={itemId} starred={starred} type="ITEM" />}

      <ShareOrCopyButton />
    </div>
  );
}
