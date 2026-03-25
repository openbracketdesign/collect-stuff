"use client";

import { useUploadThing } from "@/app/api/uploadthing/hooks";
import { MultiUploader } from "@/components/MultiUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const addItemToCollection = async (formData: FormData) => {
    try {
      const [newItem] = await createItem(formData, collection.id);

      if (!newItem?.id) {
        toast("Sorry, we couldn't create the item. Please try again.");
        throw new Error("Failed to create item");
      }

      if (files.length > 0) {
        toast(
          `"${newItem.name}" added! Uploading ${files.length > 1 ? "images" : "image"}...`,
        );

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
      } else {
        toast(`"${newItem.name}" added!`);
      }

      router.replace(`/collections/${collection.id}/${newItem.id}`);
    } catch (error) {
      toast("Sorry, we couldn't create the item. Please try again.");
    }
  };

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (uploadResult) => {
      try {
        if (!uploadResult?.[0]?.ufsUrl) {
          throw new Error(
            `Couldn't upload ${files.length > 1 ? "images" : "image"}, but the rest of your data was saved. Try again later.`,
          );
        }

        toast(`Image uploaded successfully.`);
      } catch (e) {
        console.error(e);
        toast(
          `Couldn't upload ${files.length > 1 ? "images" : "image"}, but the rest of your data was saved. Try again later.`,
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
          Images (max 10, max 4MB each)
        </Label>

        {/* <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("uploaded successfully!");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        /> */}

        {/* <Input
          type="file"
          onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            setFiles(files);

            // Do something with files

            // Then start the upload
            // await startUpload(files);
          }}
        /> */}
        <MultiUploader files={files} setFiles={setFiles} />
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
