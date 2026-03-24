"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCollection } from "@/server/actions";
import { ArrowLeftCircle, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NewCollectionForm() {
  const router = useRouter();

  const doCreateCollection = async (formData: FormData) => {
    try {
      const newCollection = (await createCollection(formData)) as {
        id: string;
      }[];

      if (newCollection?.[0]?.id) {
        toast(`"${formData.get("name") as string}" created!`);
        router.replace(`/collections/${newCollection?.[0]?.id}`);
      }
    } catch (error) {
      toast("Failed to create collection :(");
    }
  };

  // TODO: use shadcn <Form> component

  return (
    <form
      action={doCreateCollection}
      className="flex max-w-[100%] flex-col gap-4 md:max-w-[600px]"
    >
      <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="name" className="flex w-40 items-center">
          Name
        </Label>
        <Input type="text" name="name" placeholder="Collection name" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="description" className="flex w-40 items-start sm:pt-2">
          Description
        </Label>
        <Textarea name="description" placeholder="Description" />
      </div>

      <div className="ml-auto flex gap-4">
        <Link href="/collections" className="inline-block">
          <Button variant="outline">
            <ArrowLeftCircle />
            Back
          </Button>
        </Link>

        <Button>
          Save
          <Check />
        </Button>
      </div>

      {/** TODO: handle adding new properties (names) */}
    </form>
  );
}
