"use client";
import { useSession } from "@/app/session-provider";
import ClientsIndex from "@/components/clients/clients-index";
import NotAllowed from "@/components/layout/not-allowed";
import { getClients } from "@/services/clients";
// import { useEffect, useState } from "react";
// import { Client } from "@/types/clients";
import { useQuery } from "@tanstack/react-query";
import rolesPermissions from "@/utils/roles";
import { getSalidas } from "@/services/salidas";
import CamposIndex from "@/components/salidas/salidas-index";
import CampoList from "@/components/salidas/view-salidas";

export default function Campo() {
  const { user } = useSession();

  
  const { data: campo, isLoading } = useQuery({
    queryKey: ["campo", user.id],
    queryFn: () => getSalidas(),
  });

  if (!rolesPermissions.access_clients_index.includes(user.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="p-6">
      {isLoading ? (
        <div>Cargando campos...</div>
      ) : (
        <CamposIndex campos={campo ?? []} />
        //<CampoList/>
      )}
    </div>
  );
}