"use client";

import DeleteCategory from "@/components/category/category-delete";
import EditCategory from "@/components/category/category-edit";
import {  Client , Category, Events_category} from "@/types/models";
import { ColumnDef } from "@tanstack/react-table";

import { useState } from "react";
import EditCategorys from "./category-edit";
import DeleteCategorys from "./category-delete";



const HandleEdit = ({row}:{row: Events_category}) => {
  const [category, setAsset] = useState<Events_category>(row);
  return <EditCategorys category={category} />;
};

const HandleDelete = ({row}:{row: Events_category}) => {
  const [category, setCategory] = useState<Events_category>(row);
  return <DeleteCategorys category={category} />;
};


export const columnsCategory: ColumnDef<Events_category>[] = [
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