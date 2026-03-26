"use client";

import { MultiUploader } from "@/components/MultiUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpload } from "@/hooks/useUpload";
import { createItem, insertItemImages } from "@/server/actions";
import { Collection } from "@/server/schema";
import { ArrowLeftCircle, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AddItemForm({ collection }: { collection: Collection }) {
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();

  const { startUpload } = useUpload(files);

  const addItemToCollection = async (formData: FormData) => {
    const collectionPropertyIds = collection.properties.map(
      (property) => property.id,
    );

    let newItem: { id: string; name: string };

    try {
      newItem = await createItem(
        formData,
        collection.id,
        collectionPropertyIds,
      );
    } catch {
      toast.error("Sorry, we couldn't create the item. Please try again.");
      return;
    }

    if (files.length > 0) {
      toast.success(
        `"${newItem.name}" added! Uploading ${files.length > 1 ? "images" : "image"}...`,
      );

      try {
        const imageUrls = await startUpload(files);

        if (imageUrls) {
          await insertItemImages(
            newItem.id,
            imageUrls.map((image) => ({
              url: image.ufsUrl,
              fileKey: image.key,
            })),
          );
        }
      } catch {
        toast.error(
          `Your item was saved, but the ${files.length > 1 ? "images" : "image"} could not be added. You can add them from the item page.`,
        );
      }
    } else {
      toast.success(`"${newItem.name}" added!`);
    }

    router.replace(`/collections/${collection.id}/${newItem.id}`);
  };

  // TODO: use shadcn <Form> component

  return (
    <form
      action={addItemToCollection}
      className="flex max-w-[100%] flex-col gap-4 md:max-w-[600px]"
    >
      <div className="mb-3 flex flex-col gap-2">
        <Label htmlFor="name" className="flex items-center text-primary">
          Name
        </Label>
        <Input type="text" name="name" placeholder="Item name" />
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <Label htmlFor="description" className="flex items-center text-primary">
          Description
        </Label>
        <Textarea name="description" placeholder="Description" />
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <Label htmlFor="image" className="flex items-center text-primary">
          Images (max 10, max 4MB each)
        </Label>
        <MultiUploader files={files} setFiles={setFiles} />
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <p className="flex items-center text-primary text-sm font-medium">
          Properties
        </p>
        <div className="flex flex-col gap-4 border p-4 rounded-md">
          {collection.properties.length > 0 ? (
            collection.properties.map((property) => (
              <Input
                key={property.id}
                type="text"
                name={property.id}
                placeholder={property.name}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">
              This collection doesn't have any properties yet. Edit the
              collection to add properties, then add an item to add values.
            </p>
          )}
        </div>
      </div>

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
    </form>
  );
}
