"use client";

import { EditButton } from "../button/EditButton";
import ShareOrCopyButton from "../button/ShareOrCopyButton";
import { StarButton } from "../button/StarButton";

export function ItemActions({
  collectionId,
  itemId,
}: {
  collectionId: string;
  itemId: string;
}) {
  return (
    <div className='flex gap-4'>
      <EditButton collectionId={collectionId} itemId={itemId} />

      <StarButton />

      <ShareOrCopyButton />
    </div>
  );
}
