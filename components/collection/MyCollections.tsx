import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMyCollectionsWithItems } from "@/server/query";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CreateCollectionButton } from "../button/CreateCollectionButton";
import { PageTitle } from "../header/PageTitle";
import PageContent from "../PageContent";

export const MyCollections = async () => {
  const collections = await getMyCollectionsWithItems();

  if (!collections) {
    return (
      <>
        <PageTitle title="Oops!" breadcrumbs={[{ name: "Home", href: "/" }]} />

        <PageContent>
          <h1>Collections not found</h1>
        </PageContent>
      </>
    );
  }

  return (
    <>
      {collections.length > 0 && (
        <h2 className="mb-4 text-2xl text-primary">
          {collections.length}{" "}
          {collections.length === 1 ? "collection" : "collections"}
        </h2>
      )}

      {collections.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <Card className="group grid h-full grid-cols-[2fr_3fr] gap-4 p-4 hover:border-primary-300">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((i) =>
                      collection.items?.length > 0 &&
                      collection.items[i]?.images[0]?.url ? (
                        <Image
                          key={i}
                          src={collection.items[i].images[0].url}
                          alt={collection.items[i].name}
                          width={70}
                          height={70}
                          className="h-16 w-full rounded"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          key={i}
                          className="h-16 w-full rounded border"
                        ></div>
                      ),
                    )}
                  </div>
                </CardContent>

                <CardHeader className="p-0">
                  <CardTitle className="space-grotesk text-xl leading-tight group-hover:text-primary flex items-center gap-2">
                    {collection.stars && collection.stars.length > 0 && (
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    )}
                    {`${collection.name.slice(0, 50)}${collection.name.length > 50 ? "..." : ""}`}
                  </CardTitle>

                  <CardDescription className="mt-2 line-clamp-3 text-primary empty:hidden">
                    {collection.items?.length}{" "}
                    {`${collection.items?.length === 1 ? "item" : "items"}`}
                  </CardDescription>

                  <CardDescription className="mt-2 line-clamp-3 empty:hidden">
                    {collection.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {collections.length < 1 && (
        <div>
          <p className="mb-4">
            No collections yet! We&apos;ve all got to start somewhere.
          </p>

          <CreateCollectionButton />
        </div>
      )}
    </>
  );
};
