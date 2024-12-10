"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";


import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Client } from "@/types/models";
import { Project } from "@/types/models";
import EditClient from "../clients/clients-edit";
import ProjectEdit from "./project-edit";
import ProjectDelete from "./project-delete";


const HandleEdit = ({ row }: { row: Project }) => {
  const [project, setProject] = useState<Project>(row);
  return <ProjectEdit project={project} />;
};

const HandleDelete = ({ row }: { row: Project }) => {
  const [project, setProject] = useState<Project>(row);
  return <ProjectDelete project={project} />;
};

export const columnsProjects: ColumnDef<Project>[] = [

  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      return <p>{row.original.nombre ?? ""}</p>;
    },
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => {
      return <p>{row.original.cliente_id ?? ""}</p>;
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
          <HandleEdit row={row.original} />
          <HandleDelete row={row.original} />
        </div>
      );
    },
  },
];
