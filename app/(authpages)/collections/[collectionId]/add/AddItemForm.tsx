"use client";

import { ArrowLeftCircle, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUploadThing } from "~/app/api/uploadthing/hooks";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { addItemImageSubmit, addItemSubmit } from "~/server/actions";
import { type Collection } from "~/types";

export function AddItemForm({ collection }: { collection: Collection }) {
  const [files, setFiles] = useState<File[]>([]);
  const itemId = useRef<string | null>(null);

  const router = useRouter();

  const addItemToCollection = async (formData: FormData) => {
    try {
      const newItem = await addItemSubmit(formData, collection.id);
      toast(`"${formData.get("name") as string}" added! Uploading image...`);

      if (newItem?.[0]?.id) {
        itemId.current = newItem?.[0]?.id;
      }

      router.replace(`/collections/${collection.id}/${newItem?.[0]?.id}`);

      // TODO: only upload if different files and files exist
      await startUpload(files);

      router.refresh();
    } catch (error) {
      toast("Failed to add item :(");
    }
  };

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (uploadResult) => {
      try {
        if (!uploadResult?.[0]?.url || !itemId.current) {
          throw new Error(
            "Couldn't upload image, but the rest of your data was saved. Try again later.",
          );
        }

        await addItemImageSubmit({
          itemId: itemId.current,
          image: uploadResult[0].url,
        });
        toast(`Image uploaded successfully.`);
      } catch (e) {
        console.error(e);
        toast(
          "Couldn't upload image, but the rest of your data was saved. Try again later.",
        );
      }
    },
  });

  // TODO: use shadcn <Form> component

  return (
    <form
      action={addItemToCollection}
      className="flex max-w-[100%] flex-col gap-4 md:max-w-[600px]"
    >
      <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="name" className="flex w-40 items-center">
          Name
        </Label>
        <Input type="text" name="name" placeholder="Item name" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="description" className="flex w-40 items-start sm:pt-2">
          Description
        </Label>
        <Textarea name="description" placeholder="Description" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="image" className="flex w-40 items-start sm:pt-2">
          Image (max 4MB)
        </Label>

        <Input
          type="file"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            setFiles(files);

            // Do something with files

            // Then start the upload
            // await startUpload(files);
          }}
        />
        {/* <MultiUploader /> */}
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
