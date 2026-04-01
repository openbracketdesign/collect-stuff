"use client";

import { MultiUploader } from "@/components/MultiUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpload } from "@/hooks/useUpload";
import {
  deleteRemovedImages,
  editItem,
  insertItemImages,
} from "@/server/actions";
import { Collection, type ItemWithImages } from "@/server/schema";
import { cx } from "class-variance-authority";
import { ArrowLeftCircle, Check, Trash, Undo2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function EditItemForm({
  item,
  collections,
}: {
  item: ItemWithImages;
  collections: Collection[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [deletedImageFileKeys, setDeletedImageFileKeys] = useState<string[]>(
    [],
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState(
    item.collectionId,
  );
  const [selectedCollectionProperties, setSelectedCollectionProperties] =
    useState(
      collections.find((collection) => collection.id === selectedCollectionId)!
        .properties,
    );

  const router = useRouter();

  const { startUpload } = useUpload(files);

  const updateSelectedCollection = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setSelectedCollectionProperties(
      collections.find((collection) => collection.id === collectionId)!
        .properties,
    );
  };

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
      const selectedCollectionId = formData.get("collectionId") as string;
      const collectionPropertyIds = collections
        .find((collection) => collection.id === selectedCollectionId)!
        .properties.map((property) => property.id);

      const updatedItem = await editItem(
        formData,
        item.id,
        deletedImageFileKeys,
        collectionPropertyIds,
      );

      if (!updatedItem) {
        toast.error("Sorry, we couldn't update the item. Please try again.");
        throw new Error("Failed to update item");
      }

      if (files.length > 0) {
        toast.success(
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
        toast.success(`"${updatedItem.name}" updated!`);
      }

      if (deletedImageFileKeys.length > 0) {
        // Using 'void' here indicates we're intentionally discarding the returned Promise,
        // so we fire-and-forget the async operation (deleteRemovedImages). This ensures
        // the function runs asynchronously and any errors are logged via .catch, but
        // we don't await or block on its completion.
        void deleteRemovedImages(deletedImageFileKeys).catch(console.error);
      }

      router.replace(`/collections/${updatedItem.collectionId}/${item.id}`);
    } catch {
      toast.error("Sorry, we couldn't update the item. Please try again.");
    }
  };

  // TODO: use shadcn <Form> component

  return (
    <form
      action={doEditItem}
      className="flex max-w-[100%] flex-col gap-4 md:max-w-[600px]"
    >
      <div className="mb-2 flex flex-col gap-2 pb-6 border-b">
        <Label htmlFor="collectionId" className="text-primary">
          Collection
        </Label>
        <input type="hidden" name="collectionId" value={selectedCollectionId} />
        <Select
          name="collectionId"
          value={selectedCollectionId}
          onValueChange={updateSelectedCollection}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {collections.map((collection) => (
                <SelectItem
                  key={collection.id}
                  value={collection.id}
                  className={cx({
                    "text-primary": collection.id === selectedCollectionId,
                  })}
                >
                  {collection.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <Label htmlFor="name" className="text-primary">
          Item name
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Item name"
          defaultValue={item.name}
        />
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <Label htmlFor="description" className="text-primary">
          Item description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description"
          defaultValue={item.description ?? ""}
        />
      </div>

      <div className="mb-3 flex flex-col gap-2">
        <Label className="text-primary">Images (max 10, max 4MB each)</Label>

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

      <div className="mb-3 flex flex-col gap-2">
        <p className="text-primary text-sm font-medium">Item properties</p>
        <div
          key={selectedCollectionId}
          className="flex flex-col gap-4 border p-4 rounded-md"
        >
          <p className="text-sm text-gray-500">
            Edit the collection to add, remove or modify property names.
          </p>

          {selectedCollectionProperties.length > 0 &&
            selectedCollectionProperties.map((property) => (
              <div key={property.id} className="flex flex-col gap-2">
                <Label
                  htmlFor={property.id}
                  className="flex items-center text-primary"
                >
                  {property.name}
                </Label>
                <Input
                  type="text"
                  id={property.id}
                  name={property.id}
                  placeholder={property.name}
                  defaultValue={
                    item.properties.find((p) => p.propertyId === property.id)
                      ?.value ?? ""
                  }
                />
              </div>
            ))}

          {selectedCollectionProperties.length === 0 && (
            <p className="text-sm text-gray-500">
              This collection doesn&apos;t have any properties yet. Edit the
              collection to add properties, then edit this item to add values.
            </p>
          )}
        </div>
      </div>

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
