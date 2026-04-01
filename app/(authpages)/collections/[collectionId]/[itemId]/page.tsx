import { CollectionItemsList } from "@/components/collection/CollectionItemsList";
import { ItemActions } from "@/components/header/ItemActions";
import { PageTitle } from "@/components/header/PageTitle";
import PageContent from "@/components/PageContent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getItemWithCollectionAndItemsById } from "@/server/query";
import { auth } from "@clerk/nextjs/server";
import { cx } from "class-variance-authority";
import Image from "next/image";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ collectionId: string; itemId: string }>;
}) {
  const { collectionId, itemId } = await params;

  const item = await getItemWithCollectionAndItemsById(itemId);

  if (!item) {
    return (
      <>
        <PageTitle
          title="Oops!"
          breadcrumbs={[{ name: "Collections", href: "/collections" }]}
        />

        <PageContent>
          <h1>Item not found</h1>
        </PageContent>
      </>
    );
  }

  const { userId } = await auth();

  return (
    <>
      <PageTitle
        title={item.name}
        breadcrumbs={[
          { name: "Collections", href: "/collections" },
          {
            name: item.collection.name,
            href: `/collections/${item.collection.id}`,
          },
        ]}
      >
        {userId === item.userId && (
          <ItemActions
            collectionId={collectionId}
            itemId={itemId}
            canEdit={userId === item.userId}
            canStar={!!userId}
            starred={item.stars?.length > 0}
          />
        )}
      </PageTitle>

      <PageContent sidePanel>
        <div className="py-6">
          {item.images.length > 0 && (
            <Carousel className="h-[300px] w-full lg:h-[440px] mb-6">
              <CarouselContent>
                {item.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <Image
                      className="h-[300px] w-full rounded-md border p-4 lg:h-[440px]"
                      src={image.url}
                      alt={item.name}
                      style={{ objectFit: "contain" }}
                      height={300}
                      width={300}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {item.images.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          )}

          <p
            className={cx("max-w-[70ch] text-lg mb-4 pb-4 border-b", {
              "text-gray-400": !item.description,
            })}
          >
            {item.description ?? "No description"}
          </p>

          <div className="max-w-[70ch] border rounded-md">
            {item.collection.properties.map((property, i) => (
              <div key={i} className="grid grid-cols-2 border-b">
                <span className="mr-2 text-primary p-3">{property.name}</span>{" "}
                <span className="border-l p-3">
                  {item.properties.find((p) => p.propertyId === property.id)
                    ?.value ?? "--"}
                </span>
              </div>
            ))}

            <div className="grid grid-cols-2">
              <span className="mr-2 text-primary p-3">Added</span>{" "}
              <span className="border-l p-3">{item.date.toDateString()}</span>
            </div>
          </div>
        </div>

        <CollectionItemsList collection={item.collection} />
      </PageContent>
    </>
  );
}
