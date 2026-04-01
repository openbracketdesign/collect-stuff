import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getMyCollectionsWithItems } from "@/server/query";
import Image from "next/image";
import Link from "next/link";
import { CreateCollectionButton } from "../button/CreateCollectionButton";
import { StarButton } from "../button/StarButton";
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
        <div className="gap-4 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] grid">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <Card className="group gap-4 p-4 hover:border-primary-300 lg:grid-rows-[auto_1fr_auto] lg:grid-cols-1 grid h-full grid-cols-[2fr_3fr]">
                <CardContent className="p-0">
                  <div className="gap-2 grid grid-cols-2">
                    {[0, 1, 2, 3].map((i) =>
                      collection.items[i]?.images[0]?.url ? (
                        <Image
                          key={i}
                          src={collection.items[i].images[0].url}
                          alt={collection.items[i].name}
                          width={70}
                          height={70}
                          className="h-16 rounded w-full"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          key={i}
                          className="h-16 rounded bg-muted w-full border"
                        ></div>
                      ),
                    )}
                  </div>
                </CardContent>

                <CardHeader className="p-0 gap-x-4">
                  <CardTitle className="text-lg leading-5 group-hover:text-primary gap-2 flex items-center">
                    {`${collection.name.slice(0, 50)}${collection.name.length > 50 ? "..." : ""}`}
                  </CardTitle>

                  <CardDescription className="mt-2 text-primary line-clamp-3 empty:hidden">
                    {collection.itemCount}{" "}
                    {`${collection.itemCount === 1 ? "item" : "items"}`}
                  </CardDescription>

                  <CardAction className="justify-end">
                    <StarButton
                      type="COLLECTION"
                      id={collection.id}
                      iconOnly
                      starred={collection.stars && collection.stars.length > 0}
                    />
                  </CardAction>
                </CardHeader>

                <CardFooter className="p-0 m-0 pt-3 lg:col-span-1 col-span-2 border-t">
                  <CardDescription className="line-clamp-3 empty:hidden">
                    {collection.description}
                  </CardDescription>
                </CardFooter>
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
