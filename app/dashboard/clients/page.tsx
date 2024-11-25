"use client";
import { useSession } from "@/app/session-provider";
import ClientsIndex from "@/components/clients/clients-index";
import NotAllowed from "@/components/layout/not-allowed";
import { getClients } from "@/services/clients";
// import { useEffect, useState } from "react";
// import { Client } from "@/types/clients";
import { useQuery } from "@tanstack/react-query";
import rolesPermissions from "@/utils/roles";

export default function Clients() {
  const { user } = useSession();

  
  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes", user.id],
    queryFn: () => getClients({ empresa_id: user.empresa.id ?? null }),
  });

  if (!rolesPermissions.access_clients_index.includes(user.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="p-6">
      {isLoading ? (
        <div>Cargando clientes...</div>
      ) : (
        <ClientsIndex clients={clientes ?? []} />
      )}
    </div>
  );
}
