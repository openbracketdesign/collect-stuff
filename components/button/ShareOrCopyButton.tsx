import { Button } from "@/components/ui/button";
import { Check, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CopyOrShareButton() {
  const [copied, setCopied] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth > 1024 : false,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDesktop(window.innerWidth > 1024);
    }

    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (!isDesktop) {
      try {
        await navigator.share({
          title: document.title,
          url: currentUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        toast.info("Copied link to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="group text-primary"
    >
      <span className="block md:hidden xl:block">Share</span>
      {copied ? (
        <Check className="text-green-500" />
      ) : (
        <Share2 className="h-4 w-4 group-hover:motion-safe:animate-[wiggle_0.2s]" />
      )}
    </Button>
  );
}
