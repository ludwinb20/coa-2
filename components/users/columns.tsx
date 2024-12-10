"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserProfile } from "@/types/models";
import EditUsers from "./users-edit";
import { useState } from "react";
import DeleteUsers from "./users-delete";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useUsers from "@/hooks/use-users";
import ResetPassowrd from "./reset-password";
import QRUser from "./qr";

const HandleEdit = ({ row }: { row: UserProfile }) => {
  const [user, setUser] = useState<UserProfile>(row);
  const { roles, departments, loading, error } = useUsers();
  return <EditUsers userProfile={user} roles={roles} departments={departments}/>;
};

const HandleDelete = ({ row }: { row: UserProfile }) => {
  const [user, setUser] = useState<UserProfile>(row);
  return <DeleteUsers userProfile={user} />;
};

const HandleResetPassword = ({email}:{email: string}) => {
  return <ResetPassowrd email={email}/>;
};

const HandleQR = ({ row }: { row: UserProfile }) => {
  const [user, setUser] = useState<UserProfile>(row);
  return <QRUser userProfile={user} />;
};

export const columnsUsers: ColumnDef<UserProfile>[] = [
//   {
//     accessorKey: "id",
//     header: "id",
//     cell: ({ row }) => {
//       return <p>{row.original.id ?? ""}</p>;
//     },
//   },
  {
    accessorKey: "url",
    header: "",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.url ?? undefined} alt={row.original.full_name ?? "avatar"} />
          <AvatarFallback>{row.original.full_name?.slice(0, 2).toUpperCase() ?? (row.original.username?.slice(0, 2).toUpperCase() ?? "?")}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "full_name",
    header: "Nombre",
    cell: ({ row }) => {
      return <p>{row.original.full_name ?? ""}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Correo electronico",
    cell: ({ row }) => {
      return <p>{row.original.email ?? ""}</p>;
    },
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
    cell: ({ row }) => {
      return <p>{row.original.departments?.name ?? ""}</p>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return <p>{row.original.roles?.name ?? ""}</p>;
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
          <HandleQR row={row.original} />
          <HandleEdit row={row.original} />
          <HandleDelete row={row.original} />
          <HandleResetPassword email={row.original.email ?? ""}/>
        </div>
      );
    },
  },
];
