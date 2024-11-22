"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";
import { Client } from "@/types/clients";
import EditClient from "./clients-edit";
import { useState } from "react";
import DeleteClient from "./clients-delete";

const HandleEdit = ({row}:{row: Client}) => {
    const [client, setClient] = useState<Client>(row);
    return <EditClient client={client} />;
};

const HandleDelete = ({row}:{row: Client}) => {
    const [client, setClient] = useState<Client>(row);
    return <DeleteClient client={client} />;
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
            <HandleDelete row={row.original}/>
        </div>
      },
  }
];