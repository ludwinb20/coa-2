"use client";
import { useSession } from "@/app/session-provider";
import ClientsIndex from "@/components/clients/clients-index";
import NotAllowed from "@/components/layout/not-allowed";
import { getClients } from "@/services/clients";
import { Client } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import rolesPermissions from "@/utils/roles";

export default function Clients() {
  const { user } = useSession();

  
  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes", user?.id],
    queryFn: () => getClients({ empresa_id: user?.empresa.id ?? null }),
  });

  if (user && !rolesPermissions.access_clients_index.includes(user?.profile.rol_id)) {
    return <NotAllowed />;
  }

  return (
    <div className="">
      {isLoading ? (
        <div>Cargando clientes...</div> 
      ) : (
        <ClientsIndex clients={clientes ?? []} />
      )}
    </div>
  );
}
