"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { type CollectionWithItemProperties } from "~/types";
import { buildColumns } from "./Columns";
import { DataTable } from "./DataTable";

export function CollectionItems({
  collection,
  view,
}: {
  collection: any;
  view?: "grid" | "table";
}) {
  if (view === "table") {
    const columns = buildColumns(collection);
    const itemProperties: Array<Record<string, string>> = collection.items?.map(
      (item: any) => {
        const itemProps = item.itemProperties.map((property: any) => ({
          id: property.propertyId,
          value: property.value,
        }));
        const itemPropsObject = itemProps.reduce(
          (acc: Record<string, string>, prop: any) => {
            acc[prop.id] = prop.value;
            return acc;
          },
          {},
        );

        return {
          id: item.id,
          name: item.name,
          image: item.image,
          ...itemPropsObject,
        };
      },
    );

    return (
      <DataTable
        columns={columns}
        data={itemProperties}
        collectionId={collection.id}
      />
    );
  }

  // grid
  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-4'>
      {collection.items?.map((item: any) => (
        <Link key={item.id} href={`/collections/${collection.id}/${item.id}`}>
          <Card className='group grid h-full grid-cols-[2fr_3fr] gap-4 p-4 hover:border-primary-300'>
            <CardContent className='p-0'>
              <Image
                src={item.image}
                alt={item.name}
                className='max-h-[140px] w-full rounded md:w-[140px]'
                style={{ objectFit: "contain" }}
                height={300}
                width={300}
              />
            </CardContent>

            <CardHeader className='p-0'>
              <CardTitle className='space-grotesk text-xl leading-tight group-hover:text-primary'>
                {item.name}
              </CardTitle>

              <CardDescription className='mt-2 line-clamp-3 empty:hidden'>
                {item.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
