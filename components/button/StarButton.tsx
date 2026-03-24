import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

export function StarButton() {
  const starThing = () => {
    toast("WIP: coming soon");
  };

  return (
    <Button
      variant='outline'
      className='group text-amber-500 hover:bg-amber-100 hover:text-amber-500'
      onClick={starThing}
    >
      <span className='block md:hidden xl:block'>Star</span>
      <Star className='group-hover:fill-amber-500' />
    </Button>
  );
}
