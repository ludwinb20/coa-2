"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Marcajes } from "@/types/models";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const columnsMarcajes: ColumnDef<Marcajes>[] = [
  {
    accessorKey: "avatar_url",
    header: "",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.profile?.avatar_url ?? undefined} alt={row.original.profile?.full_name ?? "avatar"} />
          <AvatarFallback>{row.original.profile?.full_name?.slice(0, 2).toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: "Nombre",
    cell: ({ row }) => {
      return <p>{row.original.profile?.full_name ?? ""}</p>;
    },
  },
  {
    accessorKey: "in",
    header: "Entrada",
    cell: ({ row }) => {
      const date = row.original.in;
      const formattedDate = date 
      ? new Date(date).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) 
      : "";
    
    return <p>{formattedDate}</p>;
    },
  },
  {
    accessorKey: "out",
    header: "Salida",
    cell: ({ row }) => {
      const date = row.original.out;
      const formattedDate = date 
      ? new Date(date).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) 
      : "";
    
    return <p>{formattedDate}</p>;
    
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const totalSeconds = row.original.total;
      
      // Verificar que el valor sea un número
      if (typeof totalSeconds !== "number") {
        return <p>Invalid data</p>;
      }
  
      // Convertir a horas, minutos y segundos
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
  
      // Formatear con ceros iniciales si es necesario
      const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  
      return <p>{formattedTime} horas</p>;
    },
  },  
  {
    accessorKey: "actions",
    header: () => (
      <div className="flex justify-center items-center">
        Acciones
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center items-center gap-x-2">
          {/* <HandleEditMarcaje row={row.original} />
          <HandleDeleteMarcaje row={row.original} /> */}
        </div>
      );
    },
  }
];
