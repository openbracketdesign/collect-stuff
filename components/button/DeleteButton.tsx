"use client";

import { deleteCollection, deleteItem } from "@/server/actions";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function DeleteButton({
  thing,
  type = "item",
  variant = "button",
  redirectTo,
}: {
  thing: { id: string; name: string };
  type?: "item" | "collection";
  variant?: "button" | "menuItem";
  redirectTo?: string;
}) {
  const router = useRouter();

  const doDelete = async (id: string, name: string) => {
    try {
      const deleted =
        type === "item" ? await deleteItem(id) : await deleteCollection(id);

      if (deleted.id) {
        toast.success(`"${name}" deleted!`);
        if (redirectTo) {
          router.replace(redirectTo);
        } else {
          router.refresh();
        }
      } else {
        toast.error(`Sorry, we couldn't delete "${name}". Please try again.`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Sorry, we couldn't delete "${name}". Please try again.`);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "button" ? (
          <Button
            variant="destructive"
            onSelect={(e) => e.preventDefault()}
            className="bg-destructive/10 text-destructive"
          >
            Delete
            <Trash className="h-4 w-4 ml-auto" />
          </Button>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="bg-destructive/10 text-destructive"
          >
            Delete
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete <span className="font-bold">{thing.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            {type === "item" ? "item" : "collection"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => doDelete(thing.id, thing.name)}
          >
            Delete
            <Trash />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
