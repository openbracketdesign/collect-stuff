import { useUploadThing } from "@/app/api/uploadthing/hooks";
import { toast } from "sonner";

export function useUpload(files: File[]) {
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

  return { startUpload };
}
