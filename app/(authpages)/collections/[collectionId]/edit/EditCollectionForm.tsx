"use client";

import { ArrowLeftCircle, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { editCollectionSubmit } from "~/server/actions";
import { type Collection } from "~/types";

export function EditCollectionForm({ collection }: { collection: Collection }) {
  const router = useRouter();

  const editCollection = async (formData: FormData) => {
    try {
      await editCollectionSubmit(formData, collection.id);

      // TODO: style toast
      toast(`"${formData.get("name") as string}" updated successfully.`);
      // toast(
      //   <>
      //     <CheckCircle />
      //     {`"${formData.get("name") as string}" updated successfully.`}
      //   </>,
      // );

      router.replace(`/collections/${collection.id}`);
    } catch (error) {
      toast("Failed to update collection :(");
    }
  };

  // TODO: use shadcn <Form> component

  return (
    <form
      action={editCollection}
      className="flex max-w-[100%] flex-col gap-4 md:max-w-[600px]"
    >
      <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="name" className="flex w-40 items-center">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          placeholder="Collection name"
          defaultValue={collection.name}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="description" className="flex w-40 items-start sm:pt-2">
          Description
        </Label>
        <Textarea
          name="description"
          placeholder="Description"
          defaultValue={collection.description ?? ""}
        />
      </div>

      {/* {collection.collectionProperties.map((property, i) => (
        <div key={i} className="flex gap-2">
          <Label htmlFor={property.id} className="flex w-40 items-center">
            {`Property ${i + 1}`}
          </Label>
          <Input
            type="text"
            name={property.id}
            placeholder={`Property ${i + 1}`}
            defaultValue={property.name}
          />
        </div>
      ))} */}

      <div className="ml-auto flex gap-4">
        <Link href={`/collections/${collection.id}`} className="inline-block">
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
