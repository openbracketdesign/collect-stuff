"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cx } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  collectionId: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  collectionId,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cx({
                      "text-primary": cell.column.id === "name",
                      "w-12": cell.column.id === "image",
                    })}
                  >
                    {cell.column.id === "image" ? (
                      <Link
                        href={`/collections/${collectionId}/${(cell.row.original as { id: string }).id}`}
                        className='block h-12 w-12'
                      >
                        <Image
                          src={cell.getValue() as string}
                          alt={(cell.row.original as { name: string }).name}
                          width={64}
                          height={64}
                          style={{ objectFit: "cover" }}
                          className='h-full rounded-md border'
                        />
                      </Link>
                    ) : cell.column.id === "name" ? (
                      <Link
                        href={`/collections/${collectionId}/${(cell.row.original as { id: string }).id}`}
                        className='text-lg'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Link>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
