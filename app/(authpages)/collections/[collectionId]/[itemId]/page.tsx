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
            <Carousel className="h-[300px] w-full lg:h-[440px]">
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

          <ul className="mt-6 space-y-4">
            {/* {item.collection.collectionProperties.map((prop, i) => (
                <li key={i}>
                  <span className="mr-2 text-primary">{prop.name}</span>{" "}
                  {item.itemProperties.find((p) => p.propertyId === prop.id)
                    ?.value ?? "-"}
                </li>
              ))} */}

            {/* <li>
                <span className="mr-2 text-primary">Added</span>{" "}
                {item.createdAt.toDateString()}
              </li> */}

            <li
              className={cx("max-w-[70ch] text-lg", {
                "text-gray-400": !item.description,
              })}
            >
              {item.description ?? "No description"}
            </li>
          </ul>
        </div>

        <CollectionItemsList
          collection={item.collection}
          className="border-t border-dashed py-6 xl:border-l xl:border-t-0 xl:pl-6"
        />
      </PageContent>
    </>
  );
}
