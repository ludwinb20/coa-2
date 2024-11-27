"use client";
import { useSession } from "@/app/session-provider";
import UsersIndex from "@/components/users/users-index";
import NotAllowed from "@/components/layout/not-allowed";
import { getUsers } from "@/services/users";
// import { useEffect, useState } from "react";
// import { Client } from "@/types/clients";
import { useQuery } from "@tanstack/react-query";
import rolesPermissions from "@/utils/roles";
import { redirect } from "next/navigation";

export default function Users() {
  const { user } = useSession();

  const { data: users, isLoading } = useQuery({
    queryKey: ["users", user?.id],
    queryFn: () => getUsers({ empresa_id: user?.empresa.id ?? null }),
  });
  console.log(user);


  if (user && !rolesPermissions.access_users_index.includes(user?.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="p-6">
      {isLoading ? (
        <div>Cargando usuarios...</div>
      ) : (
        <UsersIndex users={users ?? []} />
      )}
    </div>
  );
}