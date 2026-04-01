"use client";

import { deleteItem } from "@/server/actions";
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

export function DeleteItemButton({
  item,
  variant = "button",
}: {
  item: { id: string; name: string };
  variant?: "button" | "menuItem";
}) {
  const router = useRouter();

  const doDeleteItem = async (itemId: string, itemName: string) => {
    try {
      const deleted = await deleteItem(itemId);

      if (deleted.id) {
        toast.success(`"${itemName}" deleted!`);
        router.refresh();
      } else {
        toast.error(
          `Sorry, we couldn't delete "${itemName}". Please try again.`,
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(`Sorry, we couldn't delete "${itemName}". Please try again.`);
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
            Delete <span className="font-bold">{item.name}</span>?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => doDeleteItem(item.id, item.name)}
          >
            Delete
            <Trash />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
