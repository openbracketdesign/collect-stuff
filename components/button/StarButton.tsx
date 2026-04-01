"use client";

import { Button } from "@/components/ui/button";
import { starCollection, starItem } from "@/server/actions";
import { cx } from "class-variance-authority";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

export function StarButton({
  id,
  starred,
  type = "COLLECTION",
  iconOnly = false,
}: {
  id: string;
  starred?: boolean;
  type: "ITEM" | "COLLECTION";
  iconOnly?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isStarred, setOptimisticStarred] = useOptimistic(
    starred ?? false,
    (_current, next: boolean) => next,
  );

  const doStarItem = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    const next = !isStarred;

    startTransition(async () => {
      setOptimisticStarred(next);
      try {
        if (type === "ITEM") {
          await starItem(id, next);
        } else {
          await starCollection(id, next);
        }

        await router.refresh();
      } catch {
        toast.error(
          `Sorry, we couldn't star the ${type === "ITEM" ? "item" : "collection"}. Please try again.`,
        );
        throw new Error(
          `Failed to star ${type === "ITEM" ? "item" : "collection"}`,
        );
      }
    });
  };

  return (
    <Button
      variant="outline"
      disabled={isPending}
      className={cx(
        "group text-amber-500 hover:bg-amber-100 hover:text-amber-500",
        isStarred && "bg-amber-500 border-amber-500 text-white",
      )}
      onClick={doStarItem}
    >
      {!iconOnly && <span className="md:hidden xl:block block">Star</span>}
      <Star
        className={cx("group-hover/button:fill-amber-500", {
          "fill-white": isStarred,
        })}
      />
    </Button>
  );
}
