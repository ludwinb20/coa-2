"use client";
import { Asset } from "@/types/asset";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";

import { useState } from "react";
import { Campo } from "@/types/models";
import CampoList from "./salidas-carousel";
import { useRouter } from "next/navigation";
import SimpleButtonRedirect from "./redirect";
import EditAsset from "../asset/asset-edit";
import AcceptCampo from "./accept-campo";
import RejectCampo from "./reject-campo";
import CompleteCampo from "./complete-campo";

const HandleAccept = ({row}:{row: Campo}) => {
  return <AcceptCampo id={row.id} />;
};

const HandleReject = ({row}:{row: Campo}) => {
  const [asset, setAsset] = useState<Campo>(row);

  return <RejectCampo id={row.id} />;
};



export const columnsCampo: ColumnDef<Campo>[] = [
   {
     accessorKey: "proyecto_id",
     header: "Proyecto",
     cell: ({ row }) => {
       return <p>{row.original.proyecto_id ?? ""}</p>;
     },
   },
   {
    accessorKey: "clients",
    header: "Cliente",
    cell: ({ row }) => {
      return <p>{row.original.clients?.name ?? "Sin Cliente"}</p>;
    },
  },
   {
     accessorKey: "fecha_inicio",
     header: "Fecha Inicio",
     cell: ({ row }) => {
       const fechaInicio = row.original.fecha_inicio;
       
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
    accessorKey: "fecha_final",
    header: "Fecha Final",
    cell: ({ row }) => {
      const fechaInicio = row.original.fecha_final;
      
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
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      return <p>{row.original.estado ?? "no"}</p>;
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
     <HandleAccept row={row.original}/>
     <HandleReject row={row.original}/>
   
        </div>
      );
    },
  },
  {
    accessorKey: "ver",
    header: () => (
      <div className="flex justify-center items-center">Ver</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-x-2">
        <SimpleButtonRedirect id={row.original.id} />
        </div>
      );
    },
  },
  
];