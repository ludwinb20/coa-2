"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Ausencia } from "@/types/models";

export const columnsAusenciaEmployee: ColumnDef<Ausencia>[] = [
  {
    accessorKey: "created_at",
    header: "Fecha de solicitud",
    cell: ({ row }) => {
      const date = row.original.created_at;
      const formattedDate = date
        ? new Date(date).toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "";

      return <p>{formattedDate}</p>;
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
        ? new Date(date).toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short",
          })
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
        ? new Date(date).toLocaleString("es-ES", {
            dateStyle: "short",
            timeStyle: "short",
          })
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
