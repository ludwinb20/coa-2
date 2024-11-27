"use client";

import { Asset, Client , Category} from "@/types/models";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";
import { useState } from "react";

import DeleteClient from "../clients/clients-delete";
import EditAsset from "../asset/asset-edit";
import DeleteAsset from "../asset/asset-delete";
import EditCategory from "./category-edit";
import DeleteCategory from "./category-delete";


const HandleEdit = ({row}:{row: Category}) => {
  const [category, setAsset] = useState<Category>(row);
  return <EditCategory category={category} />;
};

const HandleDelete = ({row}:{row: Category}) => {
  const [category, setCategory] = useState<Category>(row);
  return <DeleteCategory category={category} />;
};


export const columnsCategory: ColumnDef<Category>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
        return <p>{row.original.nombre ?? ""}</p>;
      },
  },
  {
    accessorKey: "descripcion",
    header: "Descripcion",
    cell: ({ row }) => {
        return <p>{row.original.descripcion ?? ""}</p>;
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