"use client";

import { Asset } from "@/types/asset";
import { ColumnDef } from "@tanstack/react-table";


import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Campologs } from "@/types/models";





export const columnsLogs: ColumnDef<Campologs>[] = [
  {
    accessorKey: "evento",
    header: "Evento",
    cell: ({ row }) => {
        return <p>{row.original.evento ?? ""}</p>;
      },
  },
  {
    accessorKey: "asset_id",
    header: "Asset id",
    cell: ({ row }) => {
        return <p>{row.original.asset_id?? "Sin ID"}</p>;
      },
  },
  {
    accessorKey: "fecha",
    header: "Fecha ",
    cell: ({ row }) => {
      const fechaInicio = row.original.fecha;
      
      if (fechaInicio instanceof Date) {
        return <p>{fechaInicio.toLocaleString()}</p>;
      }
      
      if (typeof fechaInicio === 'string') {
        // If it's a string, try to parse it
        const parsedDate = new Date(fechaInicio);
        return <p>{!isNaN(parsedDate.getTime()) ? parsedDate.toLocaleString() : fechaInicio}</p>;
      }
      
      // If it's neither a Date nor a string, or is null/undefined
      return <p>{fechaInicio ?? ""}</p>;
    },

  },
  
  {
    accessorKey: "observaciones",
    header: "Observaciones",
    cell: ({ row }) => {
        return <p>{row.original.observaciones ?? "Sin Obsevaciones"}</p>;
      },
  },
 
];