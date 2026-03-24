"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EditButton } from "../button/EditButton";
import ShareOrCopyButton from "../button/ShareOrCopyButton";
import { StarButton } from "../button/StarButton";

export function CollectionActions({ collectionId }: { collectionId: string }) {
  return (
    <div className='flex gap-4'>
      <Link href={`/collections/${collectionId}/add`}>
        <Button>
          <span className='block md:hidden xl:block'>Add</span>
          <Plus />
        </Button>
      </Link>

      <EditButton collectionId={collectionId} />

      <StarButton />

      <ShareOrCopyButton />
    </div>
  );
}
