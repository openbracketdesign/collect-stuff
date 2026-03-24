"use client";

import { ArrowLeftCircle, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { useUploadThing } from "~/app/api/uploadthing/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { editItem } from "@/server/actions";
import { type Item } from "@/server/schema";

export function EditItemForm({ item }: { item: Item }) {
  // const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();

  const doEditItem = async (formData: FormData) => {
    try {
      const updatedItem = await editItem(
        formData,
        item.id,
        // item.collection.collectionProperties.map((property) => property.id),
      );
      toast(
        `"${updatedItem?.[0]?.name}" updated successfully. Uploading image...`,
      );

      router.replace(`/collections/${item.collectionId}/${item.id}`);

      // TODO: only upload if different files and files exist
      // await startUpload(files);

      // router.refresh();
    } catch (error) {
      toast("Failed to update item :(");
    }
  };

  // const { startUpload } = useUploadThing("imageUploader", {
  //   onClientUploadComplete: async (uploadResult) => {
  //     try {
  //       if (!uploadResult?.[0]?.url) {
  //         throw new Error(
  //           "Couldn't upload image, but the rest of your data was saved. Try again later.",
  //         );
  //       }

  //       await addItemImageSubmit({
  //         itemId: item.id,
  //         image: uploadResult[0].url,
  //       });

  //       toast(`Image uploaded successfully.`);
  //     } catch (e) {
  //       console.error(e);
  //       toast(
  //         "Couldn't upload image, but the rest of your data was saved. Try again later.",
  //       );
  //     }
  //   },
  // });

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
        <Label htmlFor="image" className="flex w-40 items-start sm:pt-2">
          Image (max 4MB)
        </Label>

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

        {/* <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            console.log(`onClientUploadComplete`, res);
            // alert("Upload Completed");
          }}
          onUploadBegin={() => {
            console.log("upload begin");
          }}
          config={{ appendOnPaste: true, mode: "manual" }}
        /> */}
        {/* <MultiUploader /> */}
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
