"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";
import { Client } from "@/types/clients";
import EditClient from "./clients-edit";
import { useState } from "react";

const HandleEdit = ({row}:{row: Client}) => {
    const [client, setClient] = useState<Client>(row);
    return <EditClient client={client} />;
};

const handleDelete = (client: Client) => {
  console.log('Eliminando cliente:', client);
};

export const columnsClients: ColumnDef<Client>[] = [
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
    header: () =>(
        <div className="flex justify-center items-center">
          Acciones
        </div>
      ),
    cell: ({ row }) => {
        return <div className="flex justify-center items-center gap-x-2">
            <HandleEdit row={row.original}/>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original)}><XIcon /></Button>
        </div>
      },
  }
];