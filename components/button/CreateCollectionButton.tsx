import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function CreateCollectionButton() {
  return (
    <Link href="/collections/new">
      <Button>
        Create <Plus />
      </Button>
    </Link>
  );
}
