import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export function EditButton({
  collectionId,
  itemId,
}: {
  collectionId: string;
  itemId?: string;
}) {
  return (
    <Link
      href={
        itemId
          ? `/collections/${collectionId}/${itemId}/edit`
          : `/collections/${collectionId}/edit`
      }
    >
      <Button variant='outline' className='group text-primary'>
        <span className='block md:hidden xl:block'>Edit</span>
        <Pencil className='transition-transform group-hover:translate-x-[4px] group-hover:rotate-[-10deg]' />
      </Button>
    </Link>
  );
}
