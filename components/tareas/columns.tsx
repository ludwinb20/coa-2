"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { EditIcon } from "@/icons/icons";
import { DeleteIcon, XIcon } from "lucide-react";


import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Client, Tarea } from "@/types/models";
import { Project } from "@/types/models";
import EditClient from "../clients/clients-edit";
import ProjectEdit from "../projects/project-edit";
import ProjectDelete from "../projects/project-delete";
import SimpleButtonRedirect from "./redirect";




const HandleEdit = ({ row }: { row: Project }) => {
  const [project, setProject] = useState<Project>(row);
  return <ProjectEdit project={project} />;
};

const HandleDelete = ({ row }: { row: Project }) => {
  const [project, setProject] = useState<Project>(row);
  return <ProjectDelete project={project} />;
};

export const columnsTarea: ColumnDef<Tarea>[] = [

  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      return <p>{row.original.nombre ?? ""}</p>;
    },
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
    cell: ({ row }) => {
      return <p>{row.original.descripcion ?? ""}</p>;
    },
  },
 
  
  {
    accessorKey: "estado",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      const estado = row.original.estado;
      const formatEstado = (estado: string | null) => {
        switch (estado) {
          case 'en_progreso':
            return 'En Progreso';
          case 'pendiente':
            return 'Pendiente';
          case 'completada':
            return 'Completada';
          case 'cancelada':
            return 'Cancelada';
          default:
            return estado || 'Sin estado';
        }
      };

      return (
        <div className="flex justify-center">
          <div className={`
            px-2.5 py-0.5 rounded-full text-sm font-medium
            ${estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' : ''}
            ${estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${estado === 'completada' ? 'bg-green-100 text-green-800' : ''}
        
          `}>
            {formatEstado(estado)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "encargado",
    header: "Encargado",
    cell: ({ row }) => {
      const profile = row.original.profiles_encargado;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage 
              src={row.original.avatarUrl ?? undefined} 
              alt={profile?.full_name ?? "avatar"} 
            />
            <AvatarFallback>
              {profile?.full_name?.slice(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700">
            {profile?.full_name || 'Sin asignar'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "creador",
    header: "Creado por",
    cell: ({ row }) => {
      const profile = row.original.profiles_creador;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage 
              src={row.original.creadorAvatarUrl ?? undefined} 
              alt={profile?.full_name ?? "avatar"} 
            />
            <AvatarFallback>
              {profile?.full_name?.slice(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700">
            {profile?.full_name || 'Sin asignar'}
          </span>
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
