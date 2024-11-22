"use client";
import { useSession } from "@/app/session-provider";
import ClientsIndex from "@/components/clients/clients-index";
import { getClients } from "@/services/clients";
// import { useEffect, useState } from "react";
// import { Client } from "@/types/clients";
import { useQuery } from "@tanstack/react-query";

export default function Clients() {
  const { user } = useSession();
  const { data: clientes, isLoading } = useQuery({
    queryKey: ["clientes", user.id],
    queryFn: () => getClients({ empresa_id: user.empresa.id ?? null }),
  });

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
