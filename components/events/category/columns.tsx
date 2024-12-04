"use client";

import DeleteClient from "@/components/clients/clients-delete";
import EditClient from "@/components/clients/clients-edit";
import { Client } from "@/types/models";
import { Avatar } from "@radix-ui/react-avatar";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

const HandleEdit = ({ row }: { row: Client }) => {
  const [client, setClient] = useState<Client>(row);
  return <EditClient client={client} />;
};

const HandleDelete = ({ row }: { row: Client }) => {
  const [client, setClient] = useState<Client>(row);
  return <DeleteClient client={client} />;
};

export const columnsClients: ColumnDef<Client>[] = [
//   {
//     accessorKey: "id",
//     header: "id",
//     cell: ({ row }) => {
//       return <p>{row.original.id ?? ""}</p>;
//     },
//   },
  {
    accessorKey: "url",
    header: "",
    cell: ({ row }) => {
      return (
       ""
      );
    },
  },
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
  {
    accessorKey: "actions",
    header: () => (
      <div className="flex justify-center items-center">Acciones</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-x-2">
          <HandleEdit row={row.original} />
          <HandleDelete row={row.original} />
        </div>
      );
    },
  },
];
