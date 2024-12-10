"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Ausencia } from "@/types/models";

export const columnsAusenciasAdmin: ColumnDef<Ausencia>[] = [
  {
    accessorKey: "profile",
    header: "Usuario",
    cell: ({ row }) => {
      return <div className="flex flex-row">
        <Avatar>
          <AvatarImage src={row.original.profile?.avatar_url ?? undefined} alt={row.original.profile?.full_name ?? "avatar"} />
          <AvatarFallback>{row.original.profile?.full_name?.slice(0, 2).toUpperCase() ?? "?"}</AvatarFallback>
        </Avatar>
        <p>{row.original.profile?.full_name ?? ""}</p>
      </div>;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      return <p>{row.original.type}</p>;
    },
  },
  {
    accessorKey: "start",
    header: "Inicio",
    cell: ({ row }) => {
      const date = row.original.start;
      const formattedDate = date 
      ? new Date(date).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) 
      : "";
    
    return <p>{formattedDate}</p>;
    },
  },
  {
    accessorKey: "end",
    header: "Fin",
    cell: ({ row }) => {
      const date = row.original.end;
      const formattedDate = date 
      ? new Date(date).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) 
      : "";
    
    return <p>{formattedDate}</p>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Fecha de solicitud",
    cell: ({ row }) => {
      const date = row.original.created_at;
      const formattedDate = date 
      ? new Date(date).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) 
      : "";
    
    return <p>{formattedDate}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      return <p>{row.original.status}</p>;
    },
  },
];