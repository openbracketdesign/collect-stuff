"use client";

import { useUploadThing } from "@/app/api/uploadthing/hooks";
import { MultiUploader } from "@/components/MultiUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteRemovedImages,
  editItem,
  insertItemImages,
} from "@/server/actions";
import { type ItemWithImages } from "@/server/schema";
import { cx } from "class-variance-authority";
import { ArrowLeftCircle, Check, Trash, Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function EditItemForm({ item }: { item: ItemWithImages }) {
  const [files, setFiles] = useState<File[]>([]);
  const [deletedImageFileKeys, setDeletedImageFileKeys] = useState<string[]>(
    [],
  );

  const router = useRouter();

  const toggleDeletedImage = (
    event: React.MouseEvent<HTMLButtonElement>,
    imageFileKey: string,
  ) => {
    event.preventDefault();

    if (deletedImageFileKeys.includes(imageFileKey)) {
      setDeletedImageFileKeys(
        deletedImageFileKeys.filter((key) => key !== imageFileKey),
      );
    } else {
      setDeletedImageFileKeys([...deletedImageFileKeys, imageFileKey]);
    }
  };

  const doEditItem = async (formData: FormData) => {
    try {
      const [updatedItem] = await editItem(
        formData,
        item.id,
        deletedImageFileKeys,
        // item.collection.collectionProperties.map((property) => property.id),
      );

      if (!updatedItem) {
        toast("Sorry, we couldn't update the item. Please try again.");
        throw new Error("Failed to update item");
      }

      if (files.length > 0) {
        toast(
          `"${updatedItem.name}" updated! Uploading ${files.length > 1 ? "images" : "image"}...`,
        );

        const imageUrls = await startUpload(files);

        if (imageUrls) {
          await insertItemImages(
            item.id,
            imageUrls.map((image) => ({
              url: image.ufsUrl,
              fileKey: image.key,
            })),
          );
        }
      } else {
        toast(`"${updatedItem.name}" updated!`);
      }

      if (deletedImageFileKeys.length > 0) {
        // Using 'void' here indicates we're intentionally discarding the returned Promise,
        // so we fire-and-forget the async operation (deleteRemovedImages). This ensures
        // the function runs asynchronously and any errors are logged via .catch, but
        // we don't await or block on its completion.
        void deleteRemovedImages(deletedImageFileKeys).catch(console.error);
      }

      router.replace(`/collections/${item.collectionId}/${item.id}`);
    } catch (error) {
      toast("Sorry, we couldn't update the item. Please try again.");
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
      action={doEditItem}
      className="flex max-w-[100%] flex-col gap-4 md:max-w-[600px]"
    >
      <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="name" className="flex w-40 items-center">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          placeholder="Item name"
          defaultValue={item.name}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="description" className="flex w-40 items-start sm:pt-2">
          Description
        </Label>
        <Textarea
          name="description"
          placeholder="Description"
          defaultValue={item.description ?? ""}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-2">
        <Label htmlFor="image" className="flex sm:w-40 items-start sm:pt-2">
          Images (max 10, max 4MB each)
        </Label>

        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-2 gap-4">
            {item.images.map((image) => (
              <div key={image.id} className="flex items-center gap-2">
                <Image
                  key={image.id}
                  src={image.url}
                  alt={item.name}
                  width={100}
                  height={100}
                  className={cx("h-[100px] rounded-md border p-1 w-[100px]", {
                    "opacity-50": deletedImageFileKeys.includes(image.fileKey),
                  })}
                  style={{ objectFit: "contain" }}
                />

                <Button
                  variant="outline"
                  size="icon"
                  onClick={(event) => toggleDeletedImage(event, image.fileKey)}
                  className={cx({
                    "bg-red-500 text-white hover:bg-green-500 hover:text-white":
                      deletedImageFileKeys.includes(image.fileKey),
                  })}
                >
                  {deletedImageFileKeys.includes(image.fileKey) ? (
                    <Undo2 className="h-4 w-4" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>

          <MultiUploader files={files} setFiles={setFiles} />
        </div>
      </div>

      {/* {item.collection.collectionProperties.map((property, i) => (
        <Input
          key={i}
          type="text"
          name={property.id}
          placeholder={property.name}
          defaultValue={
            item.itemProperties.find((p) => p.propertyId === property.id)?.value
          }
        />
      ))} */}

      <div className="ml-auto flex gap-4">
        <Link
          href={`/collections/${item.collectionId}/${item.id}`}
          className="inline-block"
        >
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
