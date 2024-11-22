"use client";

import { Asset } from "@/types/asset";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "../ui/button";
import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";
import { Client } from "@/types/clients";
import { useState } from "react";
import EditClient from "../clients/clients-edit";
import DeleteClient from "../clients/clients-delete";
import EditAsset from "../asset/asset-edit";
import DeleteAsset from "../asset/asset-delete";
import { Category } from "@/types/category";




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
       
        </div>
      },
  }
];