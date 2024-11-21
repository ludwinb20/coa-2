"use client";

import { ColumnDef } from "@tanstack/react-table";

type RowsEtapasChats = {
    nombre: string;
    precio: number;
    categoria: string;
};

export const columnsAsset: ColumnDef<RowsEtapasChats>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
        return <p>{row.original.nombre ?? ""}</p>;
      },
  },
  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) => {
        return <p>{row.original.precio ?? ""}</p>;
      },
  },
  {
    accessorKey: "categoria",
    header: "Categoria",
    cell: ({ row }) => {
        return <p>{row.original.categoria ?? ""}</p>;
      },
  },
];