"use client";

import { Asset } from "@/types/asset";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";
import { useState } from "react";
import EditClient from "../clients/clients-edit";
import DeleteClient from "../clients/clients-delete";
import EditAsset from "./asset-edit";
import DeleteAsset from "./asset-delete";
import ViewAsset from "./asset-view";


const HandleEdit = ({row}:{row: Asset}) => {
  const [asset, setAsset] = useState<Asset>(row);
  return <EditAsset asset={asset} />;
};

const HandleView = ({row}:{row: Asset}) => {
  const [asset, setAsset] = useState<Asset>(row);
  return <ViewAsset asset={asset} />;
};

const HandleDelete = ({row}:{row: Asset}) => {
  const [asset, setAsset] = useState<Asset>(row);
  return <DeleteAsset asset={asset} />;
};

export const columnsAsset: ColumnDef<Asset>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
        return <p>{row.original.nombre ?? ""}</p>;
      },
  },
 
  {
    accessorKey: "category",
    header: "Categoría",
    cell: ({ row }) => {
        return <p>{row.original.category?.nombre ?? "Sin categoría"}</p>;
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
           <HandleView row={row.original}/>
        </div>
      },
  }
];