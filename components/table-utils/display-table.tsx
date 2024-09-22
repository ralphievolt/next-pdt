"use client"

import * as React from "react";
import { useRouter } from "next/navigation";
import { FaAngleDown,FaAngleUp } from "react-icons/fa";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  TableContainer,Icon 
} from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

export type DataTableProps<Data extends object> = {
  data: Data[];
  columns: ColumnDef<Data, any>[];
};

type GenericObject = { [key: string]: any };

export function DisplayTable<Data extends object>({
  data,
  columns,
}: DataTableProps<Data>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
  const router = useRouter();


  return (
    <TableContainer mt={2}>
    
      <Table
        size="sm"
        variant="striped"
        // colorScheme="facebook"
        style={{
          borderCollapse: "separate",
          borderSpacing: "0 0.5em",
        }}
      >
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta;
                return (
                  <Th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    <chakra.span pl="4">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === "desc" ? (
                          <Icon as={FaAngleUp} aria-label="sorted descending" />
                        ) : (
                          <Icon as={FaAngleDown} aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
     
        <Tbody>
          
          {table.getRowModel().rows.map((row) => (
            <Tr
              key={row.id}
              onClick={() => {
                const x: GenericObject = row.original;

                router.push(`/job-signoff/${x._id}`);
              }}
            >
                 
              {row.getVisibleCells().map((cell) => {
                const meta: any = cell.column.columnDef.meta;
                return (
                  <Td key={cell.id} isNumeric={meta?.isNumeric}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}

               
            </Tr>
          ))}
        </Tbody>
      </Table> 
    </TableContainer>
  );
}
