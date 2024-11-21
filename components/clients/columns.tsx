"use client";

import { ColumnDef } from "@tanstack/react-table";

type RowsEtapasChats = {
    name: string;
    rtn: string;
};

export const columnsClients: ColumnDef<RowsEtapasChats>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
        return <p>{row.original.name ?? ""}</p>;
      },
  },
  {
    accessorKey: "rtn",
    header: "RTN",
    cell: ({ row }) => {
        return <p>{row.original.rtn ?? ""}</p>;
      },
  },
];