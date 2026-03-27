"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCollection } from "@/server/actions";
import { ArrowLeftCircle, Check, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function NewCollectionForm() {
  const router = useRouter();

  const [newProperties, setNewProperties] = useState<string[]>([""]);

  const addNewProperty = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setNewProperties([...newProperties, ""]);
  };

  const doCreateCollection = async (formData: FormData) => {
    // TODO: form validation
    try {
      const [[newCollection]] = await createCollection(formData, newProperties);

      if (!newCollection?.id) {
        toast.error(
          "Sorry, we couldn't create the collection. Please try again.",
        );
        return;
      }

      router.replace(`/collections/${newCollection.id}`);
    } catch (error) {
      console.error(error);
      toast.error(
        "Sorry, we couldn't create the collection. Please try again.",
      );
    }
  };

  // TODO: use shadcn <Form> component

  return (
    <form
      action={doCreateCollection}
      className="flex max-w-[100%] flex-col gap-4 md:max-w-[600px]"
    >
      <div className="mb-3 flex flex-col gap-2">
        <Label htmlFor="name" className="flex items-center text-primary">
          Name
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Collection name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="flex items-center text-primary">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="flex items-center text-primary text-sm font-medium">
          Properties
        </p>
        {newProperties.map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Label
              htmlFor={`property-${i}`}
              className="flex items-center text-primary sr-only"
            >
              {`Property ${i + 1} name`}
            </Label>
            <Input
              type="text"
              id={`property-${i}`}
              name={`property-${i}`}
              placeholder={`Property ${i + 1} name`}
              onChange={(event) => {
                const newProps = [...newProperties];
                newProps[i] = event.target.value;
                setNewProperties(newProps);
              }}
            />
          </div>
        ))}

        <Button variant="outline" onClick={addNewProperty}>
          <Plus />
          Add Property
        </Button>
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
