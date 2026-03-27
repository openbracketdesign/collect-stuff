"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { editCollection } from "@/server/actions";
import { Collection } from "@/server/schema";
import { cx } from "class-variance-authority";
import { ArrowLeftCircle, Check, Plus, Trash, Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function EditCollectionForm({ collection }: { collection: Collection }) {
  const router = useRouter();

  const [newProperties, setNewProperties] = useState<string[]>([]);
  const [deletedProperties, setDeletedProperties] = useState<string[]>([]);

  const addNewProperty = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setNewProperties([...newProperties, ""]);
  };

  const toggleDeletedProperty = (
    event: React.MouseEvent<HTMLButtonElement>,
    propertyId: string,
  ) => {
    event.preventDefault();
    setDeletedProperties(
      deletedProperties.includes(propertyId)
        ? deletedProperties.filter((id) => id !== propertyId)
        : [...deletedProperties, propertyId],
    );
  };

  const doEditCollection = async (formData: FormData) => {
    try {
      const updatedCollection = await editCollection(
        formData,
        collection.id,
        collection.properties.map((property) => property.id),
        newProperties,
        deletedProperties,
      );

      if (updatedCollection?.name) {
        toast.success(`"${updatedCollection.name}" updated!`);
        router.replace(`/collections/${collection.id}`);
      } else {
        toast.error(
          "Sorry, we couldn't update the collection. Please try again.",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Sorry, we couldn't update the collection. Please try again.",
      );
    }
  };

  // TODO: use shadcn <Form> component

  return (
    <form
      action={doEditCollection}
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

      <div className="flex flex-col gap-4">
        <p className="flex items-center text-primary text-sm font-medium">
          Properties
        </p>

        {collection.properties.length > 0 &&
          collection.properties.map((property, i) => (
            <div key={property.id} className="flex flex-col gap-2">
              <Label
                htmlFor={property.id}
                className="flex items-center text-primary"
              >
                {`Property ${i + 1} name`}
              </Label>
              <InputGroup>
                <InputGroupInput
                  type="text"
                  id={property.id}
                  name={property.id}
                  placeholder={`Property ${i + 1} name`}
                  defaultValue={property.name}
                  className={cx({
                    "opacity-50": deletedProperties.includes(property.id),
                  })}
                  disabled={deletedProperties.includes(property.id)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    variant="outline"
                    aria-label="Delete"
                    title="Delete"
                    onClick={(event) =>
                      toggleDeletedProperty(event, property.id)
                    }
                    className={cx({
                      "bg-red-500 text-white hover:bg-green-500 hover:text-white":
                        deletedProperties.includes(property.id),
                    })}
                  >
                    {deletedProperties.includes(property.id) ? (
                      <Undo2 />
                    ) : (
                      <Trash />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
          ))}

        {newProperties.map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Label
              htmlFor={`property-${i}`}
              className="flex items-center text-primary"
            >
              {`Property ${i + collection.properties.length + 1} name`}
            </Label>
            <Input
              type="text"
              id={`property-${i}`}
              name={`property-${i}`}
              placeholder={`Property ${i + collection.properties.length + 1} name`}
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
